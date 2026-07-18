import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getTickets, deleteTicket } from '../../services/ticketService'
import { useSearch } from '../../context/SearchContext'
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal'
import { 
  Inbox, 
  Layers, 
  ClipboardList, 
  CheckCircle2, 
  Plus, 
  Eye, 
  Trash2,
  TableProperties, 
  LayoutGrid,
  SearchX,
  CheckCircle
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchTerm } = useSearch()
  
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filtering & View Mode State
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [viewMode, setViewMode] = useState('table')

  // Deletion Modal State
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Listen for redirect delete toast messages
  useEffect(() => {
    if (location.state?.deleteSuccessMsg) {
      setToastMessage(location.state.deleteSuccessMsg)
      // Clear navigation history state to avoid recurring toast triggers
      window.history.replaceState({}, document.title)
      setTimeout(() => {
        setToastMessage(null)
      }, 2050)
    }
  }, [location])

  const fetchTickets = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true)
      const data = await getTickets()
      // Sort by creation date descending
      const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setTickets(sorted)
      setError(null)
    } catch (err) {
      setError(err.message || 'An error occurred while fetching tickets.')
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets(true)
  }, [])

  // Helper: Initials generator for customer avatars
  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Helper: Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Handle Deletion confirm
  const handleConfirmDelete = async () => {
    if (!deleteTargetId || isDeleting) return
    
    try {
      setIsDeleting(true)
      setDeleteError(null)
      await deleteTicket(deleteTargetId)
      
      // Show success toast/alert
      setToastMessage(`Ticket ${deleteTargetId} has been deleted successfully.`)
      setTimeout(() => {
        setToastMessage(null)
      }, 2000)
      
      // Close confirmation dialog
      setDeleteTargetId(null)
      
      // Refresh list and counts dynamically
      await fetchTickets(false)
    } catch (err) {
      setDeleteError(err.response?.data?.detail || err.message || 'Failed to delete ticket. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Metrics calculation
  const totalCount = tickets.length
  const openCount = tickets.filter((t) => t.status === 'Open').length
  const progressCount = tickets.filter((t) => t.status === 'In Progress').length
  const closedCount = tickets.filter((t) => t.status === 'Closed').length

  // Filtered tickets logic
  const filteredTickets = tickets.filter((ticket) => {
    // 1. Status Filter matching
    const matchesStatus = statusFilter === 'All Statuses' || ticket.status === statusFilter
    
    // 2. Case-insensitive and trimmed Search matching
    const search = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !search ||
      (ticket.ticket_id ?? "").toLowerCase().includes(search) ||
      (ticket.customer_name ?? "").toLowerCase().includes(search) ||
      (ticket.customer_email ?? "").toLowerCase().includes(search) ||
      (ticket.subject ?? "").toLowerCase().includes(search)
      
    return matchesStatus && matchesSearch
  })

  // Recent tickets (top 3 newest tickets)
  const recentTickets = tickets.slice(0, 3)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 max-w-2xl mx-auto mt-10 shadow-md">
        <div className="flex items-center space-x-3">
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-bold text-base">Failed to connect to server</span>
        </div>
        <p className="text-sm mt-2 text-red-750">
          Make sure your FastAPI server is running on port 8000 and that CORS is configured properly. ({error})
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[200] bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-4 shadow-lg flex items-center space-x-2.5 animate-fade-in text-xs font-semibold">
          <CheckCircle className="h-4.5 w-4.5 text-green-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tickets */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Tickets</span>
            <span className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 shadow-sm">
              <Layers className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-800">{totalCount}</div>
        </div>

        {/* Open */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Open</span>
            <span className="p-2 bg-green-50 border border-green-200 text-green-600 rounded-lg shadow-sm">
              <Inbox className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-800">{openCount}</div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Progress</span>
            <span className="p-2 bg-amber-50 border border-amber-250 text-amber-600 rounded-lg shadow-sm">
              <ClipboardList className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-800">{progressCount}</div>
        </div>

        {/* Closed */}
        <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Closed</span>
            <span className="p-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg shadow-sm">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-slate-800">{closedCount}</div>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Tickets</h2>
        {recentTickets.length === 0 ? (
          <p className="text-xs text-slate-400">No tickets available to display.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTickets.map((ticket) => (
              <div key={ticket.ticket_id} className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-600">{ticket.ticket_id}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    ticket.status === 'Open' ? 'bg-green-50 text-green-700 border border-green-200' :
                    ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-50 text-slate-700 border border-slate-200'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="font-bold text-slate-800 text-sm tracking-tight line-clamp-2 h-10">
                  {ticket.subject}
                </div>
                <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-200">
                  <div className="h-7 w-7 rounded-full bg-slate-105 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                    {getInitials(ticket.customer_name)}
                  </div>
                  <span className="text-xs text-slate-600 font-bold truncate">{ticket.customer_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket List Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-305">
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-655 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold cursor-pointer shadow-sm"
          >
            <option>All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
        </div>

        {/* View Mode Toggle and Create Ticket Button */}
        <div className="flex items-center space-x-3 justify-end">
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-0.5 flex space-x-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === 'table' ? 'bg-white border border-slate-205 text-slate-800 shadow-sm' : 'border border-transparent text-slate-505 hover:text-slate-800'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === 'card' ? 'bg-white border border-slate-205 text-slate-800 shadow-sm' : 'border border-transparent text-slate-505 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Card</span>
            </button>
          </div>
          <button 
            onClick={() => navigate('/create-ticket')}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-1.5 shadow-md active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Main List Rendering */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded-xl p-16 text-center shadow-md">
          <SearchX className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="text-base font-bold text-slate-800 mt-4">No matching tickets found</p>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto font-medium">
            Try adjusting your search criteria or status filter to locate your ticket.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white border border-slate-300 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
              <thead className="text-[10px] uppercase font-bold text-slate-450 bg-slate-55 tracking-widest border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Ticket ID</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Subject</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Created</th>
                  <th scope="col" className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-blue-600 font-bold whitespace-nowrap">{ticket.ticket_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm">
                          {getInitials(ticket.customer_name)}
                        </div>
                        <div className="max-w-[160px] sm:max-w-none">
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">{ticket.customer_name}</div>
                          <div className="text-[10px] text-slate-450 font-semibold">{ticket.customer_email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-semibold truncate max-w-[200px] sm:max-w-xs">{ticket.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        ticket.status === 'Open' ? 'bg-green-50 text-green-700 border border-green-200' :
                        ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                          ticket.status === 'Open' ? 'bg-green-500' :
                          ticket.status === 'In Progress' ? 'bg-amber-500' :
                          'bg-slate-500'
                        }`}></span>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium whitespace-nowrap text-xs">{formatDate(ticket.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 border border-slate-200 hover:bg-blue-50/70 rounded-lg shadow-sm transition-all cursor-pointer"
                          title="View Ticket"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(ticket.ticket_id)}
                          className="p-1.5 text-slate-400 hover:text-red-655 bg-slate-55 border border-slate-200 hover:bg-red-50 rounded-lg shadow-sm transition-all cursor-pointer"
                          title="Delete Ticket"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div key={ticket.ticket_id} className="bg-white border border-slate-300 rounded-xl p-5 shadow-md flex flex-col justify-between hover:shadow-lg transition-all gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">{ticket.ticket_id}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  ticket.status === 'Open' ? 'bg-green-50 text-green-700 border border-green-200' :
                  ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-50 text-slate-700 border border-slate-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                    ticket.status === 'Open' ? 'bg-green-500' :
                    ticket.status === 'In Progress' ? 'bg-amber-500' :
                    'bg-slate-500'
                  }`}></span>
                  {ticket.status}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2 h-10">{ticket.subject}</h3>
                <div className="flex items-center space-x-2.5 mt-4 pt-3 border-t border-slate-200">
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {getInitials(ticket.customer_name)}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-700 truncate">{ticket.customer_name}</div>
                    <div className="text-[10px] text-slate-400 font-semibold truncate">{ticket.customer_email || 'No email'}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                <span className="font-medium">{formatDate(ticket.created_at)}</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setDeleteTargetId(ticket.ticket_id)}
                    className="text-xs text-red-500 hover:text-red-700 font-bold transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={deleteTargetId !== null}
        onClose={() => {
          setDeleteTargetId(null)
          setDeleteError(null)
        }}
        onConfirm={handleConfirmDelete}
        ticketId={deleteTargetId}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  )
}
