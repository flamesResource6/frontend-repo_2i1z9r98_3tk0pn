import { useEffect, useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export default function AdminPanel() {
  const [token, setToken] = useState('')
  const [otpId, setOtpId] = useState('')
  const [email, setEmail] = useState('admin@example.com')
  const [otp, setOtp] = useState('123456')

  // Job Groups
  const [jobGroups, setJobGroups] = useState([])
  const [jgName, setJgName] = useState('')
  const [jgRate, setJgRate] = useState('')

  // Users
  const [users, setUsers] = useState([])
  const [uName, setUName] = useState('')
  const [uEmail, setUEmail] = useState('')
  const [uRole, setURole] = useState('member')

  // Reports
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [teamReport, setTeamReport] = useState([])

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  const requestOTP = async () => {
    await fetch(`${baseUrl}/auth/otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    alert('OTP requested (use 123456)')
  }
  const login = async () => {
    const res = await fetch(`${baseUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp }) })
    if (res.ok) {
      const data = await res.json()
      setToken(data.access_token)
      alert('Logged in')
    } else alert('Login failed')
  }

  const loadJobGroups = async () => {
    const res = await fetch(`${baseUrl}/job-groups`, { headers: { ...authHeaders } })
    if (res.ok) {
      setJobGroups(await res.json())
    }
  }
  const createJobGroup = async () => {
    const res = await fetch(`${baseUrl}/job-groups`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders }, body: JSON.stringify({ name: jgName, daily_rate: parseFloat(jgRate || '0') }) })
    if (res.ok) { setJgName(''); setJgRate(''); loadJobGroups() }
  }

  const loadUsers = async () => {
    const res = await fetch(`${baseUrl}/users`, { headers: { ...authHeaders } })
    if (res.ok) setUsers(await res.json())
  }
  const createUser = async () => {
    const res = await fetch(`${baseUrl}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders }, body: JSON.stringify({ full_name: uName, email: uEmail, role: uRole }) })
    if (res.ok) { setUName(''); setUEmail(''); loadUsers() }
  }

  const loadTeamReport = async () => {
    const params = new URLSearchParams()
    if (start) params.append('start', start)
    if (end) params.append('end', end)
    const res = await fetch(`${baseUrl}/reports/team?${params.toString()}`, { headers: { ...authHeaders } })
    if (res.ok) setTeamReport(await res.json())
  }

  const exportLink = (path) => `${baseUrl}${path}`

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100 p-4">
          <h2 className="text-xl font-bold text-slate-900">Admin & Team Panel</h2>
          <p className="text-slate-600 mt-1">Login with OTP, manage job groups and users, view reports, and export.</p>
        </div>

        <Section title="Login (OTP)">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={requestOTP} className="rounded-lg border border-slate-300 px-4 py-2">Request OTP</button>
              <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="123456" className="w-28 rounded-lg border border-slate-300 px-3 py-2" />
              <button onClick={login} className="rounded-lg bg-sky-600 px-4 py-2 text-white">Login</button>
            </div>
          </div>
          {token && <p className="mt-2 text-sm text-teal-700">Logged in. Token stored in memory for this session.</p>}
        </Section>

        <Section title="Job Groups">
          <div className="grid gap-3 sm:grid-cols-4 items-end">
            <input value={jgName} onChange={e=>setJgName(e.target.value)} placeholder="Name" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input value={jgRate} onChange={e=>setJgRate(e.target.value)} placeholder="Daily Rate" className="rounded-lg border border-slate-300 px-3 py-2" />
            <button onClick={createJobGroup} className="rounded-lg bg-sky-600 px-4 py-2 text-white">Add</button>
            <button onClick={loadJobGroups} className="rounded-lg border border-slate-300 px-4 py-2">Refresh</button>
          </div>
          <ul className="mt-3 divide-y">
            {jobGroups.map(j => (
              <li key={j._id} className="py-2 text-sm flex justify-between">
                <span>{j.name}</span>
                <span className="text-slate-500">KES {j.daily_rate || 0}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Users">
          <div className="grid gap-3 sm:grid-cols-5 items-end">
            <input value={uName} onChange={e=>setUName(e.target.value)} placeholder="Full name" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input value={uEmail} onChange={e=>setUEmail(e.target.value)} placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" />
            <select value={uRole} onChange={e=>setURole(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
              <option value="member">member</option>
              <option value="team_lead">team_lead</option>
              <option value="admin">admin</option>
            </select>
            <button onClick={createUser} className="rounded-lg bg-sky-600 px-4 py-2 text-white">Add</button>
            <button onClick={loadUsers} className="rounded-lg border border-slate-300 px-4 py-2">Refresh</button>
          </div>
          <ul className="mt-3 divide-y">
            {users.map(u => (
              <li key={u._id} className="py-2 text-sm flex justify-between">
                <span>{u.full_name} • {u.role}</span>
                <span className="text-slate-500">{u.email}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Reports & Exports">
          <div className="grid gap-3 sm:grid-cols-5 items-end">
            <input value={start} onChange={e=>setStart(e.target.value)} placeholder="Start (YYYY-MM-DD)" className="rounded-lg border border-slate-300 px-3 py-2" />
            <input value={end} onChange={e=>setEnd(e.target.value)} placeholder="End (YYYY-MM-DD)" className="rounded-lg border border-slate-300 px-3 py-2" />
            <button onClick={loadTeamReport} className="rounded-lg border border-slate-300 px-4 py-2">Load Team</button>
            <a href={exportLink('/export/attendance.csv')} className="rounded-lg bg-slate-800 px-4 py-2 text-white text-center">CSV</a>
            <a href={exportLink('/export/attendance.xlsx')} className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-center">Excel</a>
            <a href={exportLink('/export/attendance.pdf')} className="rounded-lg bg-rose-600 px-4 py-2 text-white text-center">PDF</a>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Approved</th>
                </tr>
              </thead>
              <tbody>
                {teamReport.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 pr-4">{r.user_id}</td>
                    <td className="py-2 pr-4">{typeof r.date === 'string' ? r.date : new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-2 pr-4">{r.approved ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </section>
  )
}
