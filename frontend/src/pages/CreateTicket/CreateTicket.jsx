import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTicket } from '../../services/ticketService'
import { X, ArrowRight, Loader2 } from 'lucide-react'

export default function CreateTicket() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Client-side validation helper
  const validateForm = () => {
    const newErrors = {}
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer name is required'
    }
    
    if (!formData.customer_email.trim()) {
      newErrors.customer_email = 'Customer email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.customer_email)) {
      newErrors.customer_email = 'Please enter a valid email address'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsLoading(true)
      setSubmitError(null)
      await createTicket(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while creating the ticket.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center py-8 px-4 max-w-4xl mx-auto min-h-[75vh]">
      <div className="bg-white border border-slate-300 rounded-xl shadow-md w-full max-w-2xl overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Close"
          disabled={isLoading}
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Form Header */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Create New Ticket</h2>
          
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg p-4 flex items-center space-x-2 animate-pulse">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Ticket created successfully! Redirecting to Dashboard...</span>
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg p-4 flex items-center space-x-2">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Customer Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  disabled={isLoading || success}
                  className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold shadow-sm ${
                    errors.customer_name ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.customer_name && <p className="text-xs text-red-500 font-semibold">{errors.customer_name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Customer Email</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  disabled={isLoading || success}
                  className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold shadow-sm ${
                    errors.customer_email ? 'border-red-400' : 'border-slate-300'
                  }`}
                />
                {errors.customer_email && <p className="text-xs text-red-500 font-semibold">{errors.customer_email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                disabled={isLoading || success}
                className={`w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-semibold shadow-sm ${
                  errors.subject ? 'border-red-400' : 'border-slate-300'
                }`}
              />
              {errors.subject && <p className="text-xs text-red-500 font-semibold">{errors.subject}</p>}
            </div>

            {/* Description with static format bar */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Description</label>
              <div className={`border rounded-xl bg-slate-50 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm ${
                errors.description ? 'border-red-400' : 'border-slate-300'
              }`}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed explanation of the request or issue..."
                  disabled={isLoading || success}
                  rows="5"
                  className="w-full px-4 py-3 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-sm resize-none font-semibold"
                />
                
                {/* Static Text Formatting Toolbar */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-300 flex items-center justify-between text-slate-400">
                  <div className="flex items-center space-x-3.5 text-xs font-bold">
                    <button type="button" className="hover:text-slate-700" disabled>B</button>
                    <button type="button" className="hover:text-slate-700 italic" disabled>I</button>
                    <button type="button" className="hover:text-slate-700 underline" disabled>U</button>
                    <span className="w-[1px] h-3.5 bg-slate-205"></span>
                    <button type="button" className="hover:text-slate-700" disabled>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <button type="button" className="hover:text-slate-700" disabled>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs">
                    <button type="button" className="hover:text-slate-700" disabled>😊</button>
                    <button type="button" className="hover:text-slate-700" disabled>@</button>
                  </div>
                </div>
              </div>
              {errors.description && <p className="text-xs text-red-500 font-semibold">{errors.description}</p>}
            </div>

            {/* Cancel & Submit buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={isLoading || success}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-655 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || success}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-1.5 disabled:opacity-50 active:scale-[0.98] cursor-pointer shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5 text-white" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <span>Create Ticket</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
