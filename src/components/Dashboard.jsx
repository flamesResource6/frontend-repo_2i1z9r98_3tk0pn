import { useEffect, useState } from 'react'

function Stat({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'from-sky-50 to-blue-50 text-sky-700',
    teal: 'from-teal-50 to-emerald-50 text-teal-700',
    gray: 'from-slate-50 to-gray-50 text-slate-700',
  }
  return (
    <div className={`rounded-xl bg-gradient-to-br ${tones[tone]} p-5 border border-slate-200`}> 
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [todayAttendance, setTodayAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/attendance/today`)
        const data = await res.json()
        setTodayAttendance(Array.isArray(data) ? data : [])
      } catch (e) {
        setError('Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Team present today" value={loading ? '…' : todayAttendance.length} tone="blue" />
          <Stat label="Pending signatures" value="—" tone="teal" />
          <Stat label="Total cost to date" value="KES —" tone="gray" />
          <Stat label="Attendance trend" value="Weekly ↑" tone="blue" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Today's Sign-ins</h3>
            <a href="#" className="text-sm text-sky-600 hover:text-sky-700">View all</a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Approved</th>
                  <th className="py-2 pr-4">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 pr-4">{r.user_id}</td>
                    <td className="py-2 pr-4">{r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : '—'}</td>
                    <td className="py-2 pr-4">{r.approved_by ? 'Yes' : 'No'}</td>
                    <td className="py-2 pr-4">{r.remarks || '—'}</td>
                  </tr>
                ))}
                {!loading && todayAttendance.length === 0 && (
                  <tr>
                    <td className="py-6 text-slate-500" colSpan={4}>No sign-ins yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  )
}
