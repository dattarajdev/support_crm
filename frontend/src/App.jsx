import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import CreateTicket from './pages/CreateTicket/CreateTicket'
import TicketDetails from './pages/TicketDetails/TicketDetails'
import Login from './pages/Login/Login'
import { SearchProvider } from './context/SearchContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="create-ticket" element={<CreateTicket />} />
              <Route path="tickets/:ticketId" element={<TicketDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SearchProvider>
    </AuthProvider>
  )
}

export default App
