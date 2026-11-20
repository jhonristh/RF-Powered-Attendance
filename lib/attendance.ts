import { supabase } from "./supabase";

export type TapInput = { cardUid: string; deviceId: string; tappedAt?: string };
export type TapResult = { status: "recorded" | "duplicate" | "unknown_card"; eventId?: string };

const normaliseUid = (value: string) => value.trim().toUpperCase().replace(/[^0-9A-F]/g, "");

export async function recordTap(input: TapInput): Promise<TapResult> {
  if (!supabase) throw new Error("Server is not configured with Supabase credentials.");
  const cardUid = normaliseUid(input.cardUid);
  if (!/^[0-9A-F]{8,20}$/.test(cardUid)) throw new Error("cardUid must be a hexadecimal RFID UID.");
  const tappedAt = input.tappedAt ? new Date(input.tappedAt) : new Date();
  if (Number.isNaN(tappedAt.valueOf())) throw new Error("tappedAt must be an ISO-8601 timestamp.");
  const { data: card, error: cardError } = await supabase.from("rfid_cards").select("student_id,active").eq("uid", cardUid).maybeSingle();
  if (cardError) throw new Error(cardError.message);
  if (!card || !card.active) return { status: "unknown_card" };
  const since = new Date(tappedAt.valueOf() - 30_000).toISOString();
  const { data: existing, error: existingError } = await supabase.from("attendance_events").select("id").eq("card_uid", cardUid).gte("tapped_at", since).limit(1).maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing) return { status: "duplicate", eventId: existing.id };
  const { data: event, error: insertError } = await supabase.from("attendance_events").insert({ student_id: card.student_id, card_uid: cardUid, device_id: input.deviceId, tapped_at: tappedAt.toISOString() }).select("id").single();
  if (insertError) throw new Error(insertError.message);
  return { status: "recorded", eventId: event.id };
}
