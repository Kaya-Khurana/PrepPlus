import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle2, Clock, AlertTriangle, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ 
        title: '', 
        subjectId: '', 
        deadline: '', 
        estimatedHours: 1, 
        difficulty: 'medium' 
    });
    const [filter, setFilter] = useState('all');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [tasksRes, subsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/subjects', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setTasks(tasksRes.data);
            setSubjects(subsRes.data);
            if (subsRes.data.length > 0) setNewTask(prev => ({ ...prev, subjectId: subsRes.data[0]._id }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert('Failed to add task');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            alert('Failed to update task');
        }
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Study Tasks</h1>
                    <p className="text-slate-500 mt-1">Break down your goals into manageable steps.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 shadow-xl shadow-primary-200"
                >
                    <Plus size={20} /> New Task
                </button>
            </header>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-500" size={40} />
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
                    <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                        <div className="flex bg-slate-50 rounded-xl p-1">
                            <button 
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'all' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                All Tasks
                            </button>
                            <button 
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Pending
                            </button>
                            <button 
                                onClick={() => setFilter('completed')}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'completed' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Completed
                            </button>
                        </div>
                        <button className="ml-auto p-2 text-slate-400 hover:text-primary-600 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {filteredTasks.map((task) => (
                            <div key={task._id} className="p-6 flex items-center gap-6 hover:bg-slate-50/50 transition-colors group">
                                <button 
                                    onClick={() => toggleStatus(task._id, task.status)}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                        task.status === 'completed' 
                                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                                            : 'bg-white border-slate-200 text-transparent group-hover:border-primary-500'
                                    }`}
                                >
                                    <CheckCircle2 size={18} />
                                </button>
                                
                                <div className="flex-1">
                                    <h4 className={`font-bold text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="flex items-center gap-1.5 text-xs font-black px-2 py-0.5 rounded-md" style={{ backgroundColor: task.subjectId?.color + '20', color: task.subjectId?.color }}>
                                            {task.subjectId?.name || 'Unassigned'}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            <Clock size={12} /> {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            task.difficulty === 'hard' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {task.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <button className="p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        ))}

                        {tasks.length === 0 && (
                            <div className="p-20 text-center text-slate-400 font-medium">
                                No tasks found. Create one to stay productive!
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Task Title</label>
                                <input 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="e.g. Solve Chapter 4 Exercises"
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Subject</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    onChange={(e) => setNewTask({...newTask, subjectId: e.target.value})}
                                    value={newTask.subjectId}
                                >
                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Deadline</label>
                                    <input 
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Difficulty</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                                        onChange={(e) => setNewTask({...newTask, difficulty: e.target.value})}
                                    >
                                        <option value="medium">Medium</option>
                                        <option value="easy">Easy</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl text-sm transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary shadow-xl shadow-primary-200">Create Task</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
