import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, BookOpen, Calendar, Tag, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [newSubject, setNewSubject] = useState({ name: '', color: '#2563eb', priority: 'medium', examDate: '' });

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const [subsRes, tasksRes] = await Promise.all([
                axios.get('http://localhost:5000/api/subjects', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSubjects(subsRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubjects(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editMode) {
                await axios.put(`http://localhost:5000/api/subjects/${currentId}`, newSubject, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/subjects', newSubject, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            setEditMode(false);
            fetchSubjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save subject');
        }
    };

    const openEdit = (s) => {
        setNewSubject({ name: s.name, color: s.color, priority: s.priority, examDate: s.examDate ? s.examDate.substring(0, 10) : '' });
        setCurrentId(s._id);
        setEditMode(true);
        setShowModal(true);
    };

    const openAdd = () => {
        setNewSubject({ name: '', color: '#2563eb', priority: 'medium', examDate: '' });
        setEditMode(false);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure? This will remove all associated data.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSubjects();
        } catch (err) {
            alert('Failed to delete subject');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Academic Subjects</h1>
                    <p className="text-slate-500 mt-1">Manage your course modules and exam priorities.</p>
                </div>
                <button 
                    onClick={openAdd}
                    className="btn-primary flex items-center gap-2 shadow-xl shadow-primary-200"
                >
                    <Plus size={20} /> Add Subject
                </button>
            </header>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary-500" size={40} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {subjects.map((s, idx) => (
                            <motion.div 
                                key={s._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(s._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ backgroundColor: s.color }}>
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{s.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                s.priority === 'high' ? 'bg-red-100 text-red-600' : 
                                                s.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                                {s.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <Calendar size={16} />
                                        <span>Exam: {s.examDate ? new Date(s.examDate).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <BookOpen size={16} />
                                        <span>{tasks.filter(t => t.subjectId?._id === s._id && t.status === 'pending').length} Tasks Pending</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => openEdit(s)}
                                    className="w-full mt-6 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
                                >
                                    Manage Details <ChevronRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {subjects.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400">No subjects added yet. Start by adding your first course!</p>
                        </div>
                    )}
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
                        <h2 className="text-2xl font-bold mb-6">{editMode ? 'Edit Subject' : 'New Subject'}</h2>
                        <form onSubmit={handleAdd} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Subject Name</label>
                                <input 
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="e.g. Advanced Calculus"
                                    value={newSubject.name}
                                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Priority</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                                        value={newSubject.priority}
                                        onChange={(e) => setNewSubject({...newSubject, priority: e.target.value})}
                                    >
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Color Tag</label>
                                    <input 
                                        type="color"
                                        className="w-full h-[46px] p-1 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer"
                                        value={newSubject.color}
                                        onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Proposed Exam Date</label>
                                <input 
                                    type="date"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
                                    value={newSubject.examDate}
                                    onChange={(e) => setNewSubject({...newSubject, examDate: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary">{editMode ? 'Save Changes' : 'Create Subject'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Subjects;
