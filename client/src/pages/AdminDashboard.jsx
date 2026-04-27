import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, BookOpen, CheckSquare, ShieldCheck, Search, MoreVertical, Trash2, ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ userCount: 0, subjectCount: 0, taskCount: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/stats')
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const viewDetails = async (user) => {
        setDetailLoading(true);
        setSelectedUser(user);
        try {
            const res = await api.get(`/admin/users/${user._id}/details`);
            setUserDetails(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="flex justify-between items-center bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs font-bold mb-4 uppercase tracking-widest border border-primary-500/30">
                        <ShieldCheck size={14} /> System Administrator
                    </div>
                    <h1 className="text-4xl font-black">Admin Control Panel</h1>
                    <p className="text-slate-400 mt-2">Manage users, analyze global growth, and monitor system health.</p>
                </div>
                <Users className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12" />
            </header>

            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Total Students</p>
                        <h4 className="text-3xl font-black">{stats.userCount}</h4>
                    </div>
                </div>
                <div className="card flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <BookOpen size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Subjects Created</p>
                        <h4 className="text-3xl font-black">{stats.subjectCount}</h4>
                    </div>
                </div>
                <div className="card flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <CheckSquare size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Tasks Tracked</p>
                        <h4 className="text-3xl font-black">{stats.taskCount}</h4>
                    </div>
                </div>
            </div>

            {/* User Management Table */}
            <div className="card p-0 overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">User Management</h3>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..."
                            className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-full md:w-80 transition-all font-medium"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-widest">
                                <th className="px-8 py-4">Student</th>
                                <th className="px-8 py-4">Role</th>
                                <th className="px-8 py-4">Joined Date</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{u.name}</p>
                                                <p className="text-sm text-slate-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => viewDetails(u)}
                                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition-all"
                                            >
                                                View Details
                                            </button>
                                            <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inspection View (Modal/Overlay) */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-10"
                    >
                        <motion.div 
                            initial={{ y: 200 }}
                            animate={{ y: 0 }}
                            exit={{ y: 200 }}
                            className="bg-white w-full max-w-6xl h-[90vh] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary-600 transition-colors">
                                    <ArrowLeft size={20} /> Back to Dashboard
                                </button>
                                <div className="text-right">
                                    <h2 className="text-2xl font-black">{selectedUser.name}</h2>
                                    <p className="text-slate-500">{selectedUser.email}</p>
                                </div>
                            </div>

                            {detailLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                    <p className="mt-4 font-bold text-slate-500 text-lg uppercase tracking-widest">Loading Records...</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Subjects Section */}
                                    <section className="space-y-6">
                                        <h4 className="text-xl font-bold flex items-center gap-2"><BookOpen className="text-primary-600" /> Academic Subjects</h4>
                                        <div className="space-y-4">
                                            {userDetails?.subjects.map(s => (
                                                <div key={s._id} className="p-6 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.color }} />
                                                        <span className="font-bold">{s.name}</span>
                                                    </div>
                                                    <span className="text-xs font-black uppercase text-slate-400">{s.priority} Priority</span>
                                                </div>
                                            ))}
                                            {userDetails?.subjects.length === 0 && <p className="text-slate-400 italic">No subjects added yet.</p>}
                                        </div>
                                    </section>

                                    {/* Tasks Section */}
                                    <section className="space-y-6">
                                        <h4 className="text-xl font-bold flex items-center gap-2"><CheckSquare className="text-orange-600" /> Study Tasks</h4>
                                        <div className="space-y-3">
                                            {userDetails?.tasks.map(t => (
                                                <div key={t._id} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                                                    <div className={`p-2 rounded-lg ${t.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold ${t.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{t.title}</p>
                                                        <div className="flex gap-4 mt-1">
                                                            <span className="text-[10px] font-bold text-primary-600">@{t.subjectId?.name || 'Unassigned'}</span>
                                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><Calendar size={10} /> {new Date(t.deadline).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {userDetails?.tasks.length === 0 && <p className="text-slate-400 italic">No tasks created yet.</p>}
                                        </div>
                                    </section>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
