export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white h-16 px-6 flex items-center justify-between border-b border-slate-700">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold tracking-wider">SupportFlow</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold">
          A
        </div>
      </div>
    </nav>
  )
}
