# RF-Powered Attendance

Cloud-backed RFID attendance tracking. An RFID reader sends each tap to a Next.js API; the API validates the device secret, associates a card with a student, suppresses duplicate taps for 30 seconds, and stores an immutable attendance event in Supabase/Postgres. The dashboard shows today’s live events in Philippine time.

## Stack

- ESP32 + RC522 reader (or another HTTPS-capable RFID device)
- Next.js 15 dashboard and API
- Supabase Postgres

## Quick start

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local` and add the project URL, service-role key, and a long random device secret. Never expose the service-role key to the reader or browser.
3. Install and start the app:

   ```powershell
   npm install
   npm run dev
   ```

4. Create a `devices` row such as `('front-door', 'Front door reader')`, then add student and matching `rfid_cards` rows.

## Reader request

Send a `POST` request to `/api/taps`:

```json
{
  "cardUid": "A1B2C3D4",
  "deviceId": "front-door",
  "tappedAt": "2026-11-20T08:00:00+08:00"
}
```

Include `x-device-secret` with the value of `RFID_DEVICE_SHARED_SECRET`. Responses are `recorded`, `duplicate`, or `unknown_card` (404). Device firmware should queue failed requests locally and retry once connectivity returns.

## Security notes

- The device secret is a first-release shared secret; replace it with per-device credentials before a multi-site rollout.
- The Supabase service-role key stays server-only in `.env.local`.
- The schema enables RLS and does not expose direct browser policies; add staff authentication before granting dashboard access beyond trusted operators.

## Validation

```powershell
npm run lint
npm test
npm run build
```
