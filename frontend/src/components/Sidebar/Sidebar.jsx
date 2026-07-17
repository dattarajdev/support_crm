export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between border-r border-slate-800">
      <div className="space-y-4">
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main
        </div>
        <nav className="space-y-1">
          <a
            href="/"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-white"
          >
            Dashboard
          </a>
        </nav>
      </div>
      <div className="text-xs text-slate-500 px-3 py-2">
        v0.1
      </div>
    </aside>
  )
}
