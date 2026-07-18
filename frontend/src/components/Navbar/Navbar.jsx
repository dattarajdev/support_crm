import { useState, useEffect, useRef } from 'react'
import { useSearch } from '../../context/SearchContext'
import { useAuth } from '../../context/AuthContext'
import { Search, User, LogOut, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { searchTerm, setSearchTerm } = useSearch()
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white border-b border-slate-300/80 h-16 px-8 flex items-center justify-between sticky top-0 z-50">
      
      {/* Brand logo container */}
      <div className="flex items-center space-x-2 shrink-0">
        <span className="text-xl font-bold tracking-tight text-blue-600">SupportFlow</span>
        <span className="text-xs text-slate-400 font-semibold px-2 py-0.5 bg-slate-100 rounded-full">CRM</span>
      </div>

      {/* Global Search Bar (Centered) */}
      <div className="flex-1 max-w-lg mx-8 relative hidden md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search tickets, customers, or subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold shadow-sm"
        />
      </div>

      {/* Top right actions navigation */}
      <div className="flex items-center shrink-0">
        {/* User profile dropdown button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2.5 hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer select-none border border-transparent active:border-slate-200"
          >
            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-blue-100 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-700 hidden sm:inline-block">
              {user?.name || "Support Agent"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-300 rounded-xl shadow-lg py-1.5 z-55 animate-scale-up">
              <div className="px-4 py-2.5 border-b border-slate-100 text-left">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.name || "Support Agent"}
                </p>
                <p className="text-[10px] text-slate-400 font-bold truncate mt-0.5">
                  {user?.email || "support@supportflow.com"}
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
