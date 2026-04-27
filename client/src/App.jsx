import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Tasks from './pages/Tasks';
import AITimetable from './pages/AITimetable';
import Pomodoro from './pages/Pomodoro';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setIsAuthenticated(true);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {isAuthenticated ? (
          <div className="flex flex-1 relative">
            <Sidebar logout={logout} isOpen={isSidebarOpen} toggle={toggleSidebar} />
            
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                onClick={toggleSidebar}
              />
            )}

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/ai-planner" element={<AITimetable />} />
                <Route path="/pomodoro" element={<Pomodoro />} />
                <Route path="/profile" element={<Profile />} />
                {user?.role === 'admin' && <Route path="/admin" element={<AdminDashboard />} />}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/register" element={<Register login={login} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
