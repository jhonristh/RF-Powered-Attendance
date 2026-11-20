import { supabase } from "./supabase";

type AttendanceRow = { id: string; tapped_at: string; card_uid: string; students: { full_name: string }[] | null };

export type Dashboard = { date: string; uniqueAttendees: number; events: { id: string; studentName: string; cardUid: string; time: string }[] };

export async function getTodayDashboard(): Promise<Dashboard> {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(new Date());
  if (!supabase) return { date, uniqueAttendees: 0, events: [] };
  const start = `${date}T00:00:00+08:00`;
  const end = `${date}T23:59:59.999+08:00`;
  const { data, error } = await supabase
    .from("attendance_events")
    .select("id,tapped_at,card_uid,students(full_name)")
    .gte("tapped_at", start).lte("tapped_at", end).order("tapped_at", { ascending: false }).limit(50);
  if (error) throw new Error(`Could not load attendance: ${error.message}`);
  const events = ((data ?? []) as AttendanceRow[]).map((row) => ({
    id: row.id, studentName: row.students?.[0]?.full_name ?? "Unassigned card", cardUid: row.card_uid,
    time: new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit" }).format(new Date(row.tapped_at))
  }));
  return { date, uniqueAttendees: new Set(events.map((event) => event.studentName)).size, events };
}
