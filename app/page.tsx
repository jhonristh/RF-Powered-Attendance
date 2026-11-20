import { getTodayDashboard } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboard = await getTodayDashboard();
  return (
    <main>
      <h1>RF Attendance</h1>
      <p className="muted">Live attendance for {dashboard.date}</p>
      <section className="grid">
        <article className="card"><span className="muted">Unique attendees</span><p className="metric">{dashboard.uniqueAttendees}</p></article>
        <article className="card"><span className="muted">Taps recorded</span><p className="metric">{dashboard.events.length}</p></article>
        <article className="card"><span className="muted">Reader status</span><p className="metric">Online</p></article>
      </section>
      <section className="panel">
        <h2>Latest taps</h2>
        {dashboard.events.length === 0 ? <p className="muted">No attendance taps have been recorded today.</p> : (
          <table><thead><tr><th>Student</th><th>Card UID</th><th>Time</th><th>Result</th></tr></thead>
            <tbody>{dashboard.events.map((event) => <tr key={event.id}><td>{event.studentName}</td><td><code>{event.cardUid}</code></td><td>{event.time}</td><td><span className="status">Recorded</span></td></tr>)}</tbody>
          </table>
        )}
      </section>
    </main>
  );
}
