import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
              Brian Crafts • Nairobi, KE
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Attendance & Safety Adherence
            </h1>
            <p className="mt-4 text-slate-600">
              A modern, mobile-first platform for daily attendance, safety signatures, job-group pay rates and real-time reporting.
            </p>
          </div>
          <div className="relative h-72 w-full rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 shadow-inner">
            <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-transparent to-sky-100/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
