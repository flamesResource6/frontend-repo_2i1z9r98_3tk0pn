import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import SignToday from './components/SignToday'

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Hero />
      <Dashboard />
      <SignToday />
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2025 Brian Crafts • Attendance & Safety Adherence
      </footer>
    </div>
  )
}

export default App
