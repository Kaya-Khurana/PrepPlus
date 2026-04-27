import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
    Clock, 
    Calendar as CalendarIcon, 
    BookOpen, 
    Flame, 
    CheckCircle2, 
    Plus,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        completedTasks: 0,
        pendingTasks: 0,
        studyHours: 0,
        streak: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    })();

    const fetchDashboardData = async () => {
        try {
            const [statsRes, tasksRes] = await Promise.all([
                api.get('/tasks/stats/summary'),
                api.get('/tasks')
            ]);
            setStats(statsRes.data);
            setRecentTasks(tasksRes.data.slice(0, 4));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const data = [
        { name: 'Mon', hours: stats.studyHours > 0 ? (stats.studyHours * 0.1).toFixed(1) : 0 },
        { name: 'Tue', hours: stats.studyHours > 0 ? (stats.studyHours * 0.15).toFixed(1) : 0 },
        { name: 'Wed', hours: stats.studyHours > 0 ? (stats.studyHours * 0.25).toFixed(1) : 0 },
        { name: 'Thu', hours: stats.studyHours > 0 ? (stats.studyHours * 0.2).toFixed(1) : 0 },
        { name: 'Fri', hours: stats.studyHours > 0 ? (stats.studyHours * 0.1).toFixed(1) : 0 },
        { name: 'Sat', hours: stats.studyHours > 0 ? (stats.studyHours * 0.1).toFixed(1) : 0 },
        { name: 'Sun', hours: stats.studyHours > 0 ? (stats.studyHours * 0.1).toFixed(1) : 0 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Good morning, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
                    <p className="text-slate-500 mt-1">Here's your study overview for today.</p>
                </div>
                <button className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 shadow-xl shadow-primary-200">
                    <Plus size={20} /> Add Task
                </button>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<CheckCircle2 className="text-emerald-500" />} label="Tasks Completed" value={stats.completedTasks} color="bg-emerald-50" />
                <StatCard icon={<Clock className="text-blue-500" />} label="Study Hours" value={`${stats.studyHours}h`} color="bg-blue-50" />
                <StatCard icon={<Flame className="text-orange-500" />} label="Current Streak" value={`${stats.streak} days`} color="bg-orange-50" />
                <StatCard icon={<TrendingUp className="text-purple-500" />} label="Total Subjects" value={stats.totalSubjects} color="bg-purple-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 card bg-white">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold">Study Activity</h3>
                        <select className="bg-slate-50 border-none rounded-lg text-sm font-medium px-3 py-1 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                    <div className="h-80 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="card space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Today's Tasks</h3>
                        <button className="text-primary-600 font-semibold text-sm hover:underline">View all</button>
                    </div>
                    
                    <div className="space-y-4">
                        {recentTasks.length > 0 ? (
                            recentTasks.map((task) => (
                                <TaskItem 
                                    key={task._id}
                                    title={task.title} 
                                    subject={task.subjectId?.name || 'Unassigned'} 
                                    time={new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                                />
                            ))
                        ) : (
                            <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-2xl">
                                <p className="text-slate-400 text-sm">No tasks for today.</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-slate-50">
                        <div className="bg-primary-600 rounded-2xl p-6 text-white relative overflow-hidden group cursor-pointer">
                            <div className="relative z-10 transition-transform group-hover:scale-105 duration-300">
                                <h4 className="font-bold text-lg mb-1">AI Planner</h4>
                                <p className="text-primary-100 text-sm mb-4">Generate your optimal study schedule with one click.</p>
                                <div className="inline-flex items-center gap-2 font-bold text-sm">
                                    Try it now <ChevronRight size={16} />
                                </div>
                            </div>
                            <CalendarIcon className="absolute -right-4 -bottom-4 w-32 h-32 text-primary-500/30 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="card flex items-center gap-4 border-none shadow-sm shadow-slate-200"
    >
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <h4 className="text-2xl font-bold">{value}</h4>
        </div>
    </motion.div>
);

const TaskItem = ({ title, subject, time }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer">
        <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center bg-white group-hover:border-primary-500 group-hover:bg-primary-50 transition-all">
            <CheckCircle2 size={18} className="text-slate-200 group-hover:text-primary-500" />
        </div>
        <div className="flex-1">
            <h5 className="font-bold text-sm text-slate-900">{title}</h5>
            <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-primary-600">{subject}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500">{time}</span>
            </div>
        </div>
    </div>
);

export default Dashboard;
