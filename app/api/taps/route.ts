import { NextRequest, NextResponse } from "next/server";
import { recordTap } from "@/lib/attendance";

export async function POST(request: NextRequest) {
  if (!process.env.RFID_DEVICE_SHARED_SECRET || request.headers.get("x-device-secret") !== process.env.RFID_DEVICE_SHARED_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const result = await recordTap({ cardUid: body.cardUid, deviceId: body.deviceId, tappedAt: body.tappedAt });
    return NextResponse.json(result, { status: result.status === "unknown_card" ? 404 : 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "invalid_request" }, { status: 400 });
  }
}
