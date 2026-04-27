import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookMarked, CheckSquare, Calendar, Timer, User, LogOut, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ logout, isOpen, toggle }) => {
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

    const sidebarVariants = {
        open: { x: 0, opacity: 1 },
        closed: { x: '-100%', opacity: 0 }
    };

    return (
        <>
            <aside 
                className={`fixed md:sticky top-0 left-0 z-50 w-72 h-screen bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isOpen ? 'translate-x-0 shadow-2xl shadow-slate-900/10' : '-translate-x-full'
                }`}
            >
                <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200">P+</div>
                        <span className="text-xl font-bold tracking-tight">PrepPlus</span>
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        onClick={toggle}
                        className="p-2 text-slate-400 hover:text-slate-900 md:hidden transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => { if (window.innerWidth < 768) toggle(); }}
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
        </>
    );
};

export default Sidebar;
