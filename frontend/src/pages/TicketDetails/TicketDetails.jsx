import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getTicket, updateTicket, deleteTicket } from '../../services/ticketService'
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MessageSquare, 
  History, 
  CheckSquare, 
  Loader2,
  Inbox,
  Clock,
  Trash2
} from 'lucide-react'

export default function TicketDetails() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Update Form State
  const [updateStatus, setUpdateStatus] = useState('')
  const [updateNoteText, setUpdateNoteText] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [infoMessage, setInfoMessage] = useState(null)

  // Deletion Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const fetchTicketDetails = async (isRefetch = false) => {
    try {
      if (!isRefetch) setIsLoading(true)
      setError(null)
      const data = await getTicket(ticketId)
      setTicket(data)
      setUpdateStatus(data.status)
    } catch (err) {
      if (!isRefetch) setError(err.message || 'An error occurred while loading ticket details.')
    } finally {
      if (!isRefetch) setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTicketDetails()
  }, [ticketId])

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Handle Deletion confirm
  const handleConfirmDelete = async () => {
    if (isDeleting) return
    
    try {
      setIsDeleting(true)
      setDeleteError(null)
      await deleteTicket(ticketId)
      
      // Close confirmation dialog
      setIsDeleteModalOpen(false)
      
      // Redirect back to dashboard passing success message in state
      navigate('/', { 
        state: { 
          deleteSuccessMsg: `Ticket ${ticketId} has been deleted successfully.` 
        } 
      })
    } catch (err) {
      setDeleteError(err.response?.data?.detail || err.message || 'Failed to delete ticket. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setUpdateError(null)
    setInfoMessage(null)
    setUpdateSuccess(false)

    const cleanedNote = updateNoteText.trim()
    const hasStatusChanged = updateStatus !== ticket.status
    const hasNoteBeenAdded = cleanedNote !== ''

    // Validation: Check if there are changes to update
    if (!hasStatusChanged && !hasNoteBeenAdded) {
      setInfoMessage('No changes to update.')
      return
    }

    try {
      setIsUpdating(true)
      const payload = {
        status: updateStatus,
        notes: hasNoteBeenAdded ? cleanedNote : null,
      }
      await updateTicket(ticketId, payload)
      
      setUpdateSuccess(true)
      setUpdateNoteText('')
      
      // Refresh page data dynamically
      await fetchTicketDetails(true)
      
      // Clear success message after 2 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 2000)
    } catch (err) {
      setUpdateError(err.message || 'An error occurred while updating the ticket.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-305 rounded-xl p-6 shadow-md max-w-2xl mx-auto mt-10 space-y-4">
        <div className="flex items-center space-x-3 text-red-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-bold text-base text-slate-800 font-sans">Error Loading Ticket</span>
        </div>
        <p className="text-sm text-slate-500">
          {error}
        </p>
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => fetchTicketDetails(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-sm"
          >
            Retry
          </button>
          <Link
            to="/"
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-655 text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="bg-white border border-slate-300 rounded-xl p-16 text-center shadow-md max-w-2xl mx-auto mt-10">
        <svg className="h-10 w-10 text-slate-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base font-bold text-slate-800 mt-4">Ticket Not Found</p>
        <p className="text-xs text-slate-500 mt-1.5 font-medium">
          The requested ticket ID does not exist in the system.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  // Sort notes chronologically (oldest first - ascending)
  const chronologicalNotes = [...(ticket.notes || [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back to Dashboard Link */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-all font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Wide) - Info, Description, Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Ticket Header card with Delete action */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{ticket.subject}</h1>
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
              </div>
              <p className="text-xs font-mono font-bold text-slate-400">Ticket ID: {ticket.ticket_id}</p>
            </div>
            
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-655 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 self-start sm:self-center cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Ticket</span>
            </button>
          </div>

          {/* Description container card */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-205 pb-3 flex items-center space-x-1.5">
              <Inbox className="h-4 w-4" />
              <span>Description</span>
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-semibold">
              {ticket.description}
            </p>
          </div>

          {/* Notes and Activity card */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-205 pb-3 flex items-center space-x-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>Activity & Notes</span>
            </h3>
            
            {chronologicalNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Clock className="h-8 w-8 mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs font-bold text-slate-400">No notes posted yet</p>
                <p className="text-[10px] text-slate-455 font-semibold">No notes or activities have been posted to this ticket yet.</p>
              </div>
            ) : (
              <div className="space-y-5 relative before:absolute before:inset-y-0 before:left-5 before:w-[1px] before:bg-slate-100">
                {chronologicalNotes.map((note, idx) => (
                  <div key={idx} className="flex space-x-4 relative">
                    {/* Avatar Icon Node */}
                    <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-300 text-slate-505 flex items-center justify-center font-bold text-xs shadow-sm shrink-0 z-10">
                      AM
                    </div>
                    {/* Note content */}
                    <div className="flex-1 bg-slate-50/50 border border-slate-300 rounded-xl p-4 space-y-2 shadow-sm">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700">Support Agent <span className="text-slate-400 font-semibold">(Internal Note)</span></span>
                        <span className="text-slate-400 font-bold">{formatDate(note.created_at)}</span>
                      </div>
                      <p className="text-sm text-slate-655 leading-relaxed whitespace-pre-wrap font-semibold">{note.note_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Narrow) - Ticket Status, Update, Customer info details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Update form card */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-205 pb-3 flex items-center space-x-1.5">
              <CheckSquare className="h-4 w-4" />
              <span>Update Ticket</span>
            </h3>

            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg p-3 flex items-center space-x-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ticket updated successfully!</span>
              </div>
            )}

            {infoMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg p-3 flex items-center space-x-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{infoMessage}</span>
              </div>
            )}

            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg p-3 flex items-center space-x-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{updateError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Change Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => {
                    setUpdateStatus(e.target.value)
                    setInfoMessage(null)
                  }}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-655 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold cursor-pointer shadow-sm"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Internal Note Textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Add Internal Note (Optional)</label>
                <div className="border border-slate-300 rounded-xl bg-slate-50 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
                  <textarea
                    value={updateNoteText}
                    onChange={(e) => {
                      setUpdateNoteText(e.target.value)
                      setInfoMessage(null)
                    }}
                    placeholder="Type actions taken..."
                    disabled={isUpdating}
                    rows="4"
                    className="w-full px-3 py-2 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs resize-none font-semibold"
                  />
                  
                  {/* Static Toolbar */}
                  <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-300 flex items-center justify-between text-slate-400">
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <button type="button" className="hover:text-slate-700" disabled>B</button>
                      <button type="button" className="hover:text-slate-700 italic" disabled>I</button>
                      <button type="button" className="hover:text-slate-700 underline" disabled>U</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-md"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5 text-white" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <History className="h-3.5 w-3.5" />
                      <span>Update Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Customer Metadata Card */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-3 flex items-center space-x-1.5">
              <User className="h-4 w-4" />
              <span>Customer Details</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-300 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0">
                  {getInitials(ticket.customer_name)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-700 truncate">{ticket.customer_name}</div>
                  <div className="text-[10px] text-slate-455 font-semibold truncate">{ticket.customer_email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-205 pt-4 text-xs font-semibold text-slate-655">
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Created</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(ticket.created_at)}</span>
                  </div>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Updated</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(ticket.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setDeleteError(null)
        }}
        onConfirm={handleConfirmDelete}
        ticketId={ticketId}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  )
}
