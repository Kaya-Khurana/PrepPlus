import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookMarked, CheckSquare, Calendar, Timer, User, LogOut, Settings, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ logout }) => {
    const location = useLocation();

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    })();

    const menuItems = [
        { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <BookMarked size={22} />, label: 'Subjects', path: '/subjects' },
        { icon: <CheckSquare size={22} />, label: 'Tasks', path: '/tasks' },
        { icon: <Calendar size={22} />, label: 'AI Planner', path: '/ai-planner' },
        { icon: <Timer size={22} />, label: 'Pomodoro', path: '/pomodoro' },
        { icon: <User size={22} />, label: 'Profile', path: '/profile' },
    ];

    if (user?.role === 'admin') {
        menuItems.push({ icon: <ShieldAlert size={22} />, label: 'Admin Panel', path: '/admin' });
    }

    return (
        <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200">P+</div>
                    <span className="text-xl font-bold tracking-tight">PrepPlus</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                            location.pathname === item.path
                                ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100/50'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                        {location.pathname === item.path && (
                            <motion.div 
                                layoutId="active"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"
                            />
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-slate-50">
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium"
                >
                    <LogOut size={22} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
