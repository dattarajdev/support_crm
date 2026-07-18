import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ShieldAlert } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-300/80 min-h-[calc(100vh-4rem)] p-5 flex flex-col justify-between shrink-0 sticky top-16">
      <div className="space-y-6">
        <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Main Menu
        </div>
        <nav className="space-y-1.5">
          {/* Dashboard Link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50/80 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'
              }`
            }
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            <span>Dashboard</span>
          </NavLink>

          {/* Create Ticket Link */}
          <NavLink
            to="/create-ticket"
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50/80 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/70'
              }`
            }
          >
            <PlusCircle className="h-4.5 w-4.5 shrink-0" />
            <span>Create Ticket</span>
          </NavLink>
        </nav>
      </div>

      {/* User Profile Info Footer - Generic Support Agent Profile block */}
      <div className="flex items-center space-x-3 border-t border-slate-100 pt-4 px-2">
        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-slate-200">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div className="truncate">
          <div className="text-xs font-bold text-slate-700 truncate">SupportFlow CRM</div>
          <div className="text-[10px] text-slate-400 font-semibold truncate">Support Agent Account</div>
        </div>
      </div>
    </aside>
  )
}
