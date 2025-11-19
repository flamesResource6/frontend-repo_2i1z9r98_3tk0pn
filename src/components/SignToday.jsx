import { useEffect, useRef, useState } from 'react'

export default function SignToday() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [userId, setUserId] = useState('member-1')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0ea5e9'
  }, [])

  const startDraw = (e) => {
    setDrawing(true)
    const { x, y } = getPos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }
  const draw = (e) => {
    if (!drawing) return
    const { x, y } = getPos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const endDraw = () => setDrawing(false)

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const isTouch = e.touches && e.touches[0]
    const clientX = isTouch ? e.touches[0].clientX : e.clientX
    const clientY = isTouch ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const clear = () => {
    const c = canvasRef.current
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
  }

  const submit = async () => {
    const dataUrl = canvasRef.current.toDataURL('image/png')
    const payload = {
      user_id: userId,
      signature_url: dataUrl,
      device_meta: { ua: navigator.userAgent },
    }
    const res = await fetch(`${baseUrl}/attendance/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) setMessage('Signed successfully!')
    else setMessage('Failed to sign')
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h3 className="text-xl font-semibold text-slate-900">Sign today's safety document</h3>
        <p className="mt-1 text-slate-600">Read the guidelines, then sign and confirm presence.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <label className="block text-sm text-slate-600">User ID</label>
            <input value={userId} onChange={(e)=>setUserId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <div className="mt-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full rounded-lg border border-sky-200 bg-sky-50 touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
              <div className="mt-3 flex gap-3">
                <button onClick={clear} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700">Clear</button>
                <button onClick={submit} className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white">Sign & Confirm Presence</button>
              </div>
              {message && <p className="mt-2 text-sm text-teal-700">{message}</p>}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-900">Safety Guidelines</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              <li>Wear PPE: helmet, gloves, and safety boots at all times.</li>
              <li>Report hazards or incidents immediately to your Team Lead.</li>
              <li>Use tools and machinery as trained. Lock-out/tag-out when required.</li>
              <li>Maintain clean, organized work areas to prevent slips and trips.</li>
              <li>Hydrate regularly and take scheduled breaks.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
