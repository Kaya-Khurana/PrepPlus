import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, Clock, Calendar, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';

const AITimetable = () => {
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState(null);
    const [config, setConfig] = useState({
        hours: 4,
        time: 'Morning'
    });

    const generatePlan = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/ai/generate', {
                availableHours: config.hours,
                preferredTime: config.time
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlan(res.data.timetable);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to generate plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
            <header className="text-center space-y-4 max-w-2xl mx-auto py-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                    <Sparkles size={16} className="fill-current" />
                    Powered by Gemini AI
                </div>
                <h1 className="text-4xl font-black tracking-tight">AI Study Planner</h1>
                <p className="text-slate-500 text-lg">
                    Generate a scientifically optimized study schedule based on your subjects, difficulty levels, and energy cycles.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Configuration */}
                <div className="card h-fit sticky top-8">
                    <h3 className="text-xl font-bold mb-6">Plan Parameters</h3>
                    
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                <Clock size={16} /> Daily Study Hours
                            </label>
                            <input 
                                type="range" min="1" max="16" value={config.hours}
                                onChange={(e) => setConfig({...config, hours: e.target.value})}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                <span>1h</span>
                                <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{config.hours} Hours</span>
                                <span>16h</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                <Calendar size={16} /> Preferred Study Time
                            </label>
                            <div className="flex gap-2">
                                {['Morning', 'Evening', 'Night'].map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setConfig({...config, time: t})}
                                        className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                                            config.time === t 
                                                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-200' 
                                                : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200'
                                        }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={generatePlan}
                            disabled={loading}
                            className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    Analyzing Data...
                                </>
                            ) : (
                                <>
                                    <Zap size={20} className="fill-current" />
                                    Generate Schedule
                                </>
                            )}
                        </button>

                        <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                            <div className="flex gap-3 text-xs text-slate-500 leading-relaxed">
                                <AlertCircle className="shrink-0 text-slate-400" size={16} />
                                Tip: Add all your subjects and current tasks before generating to get the most accurate plan.
                            </div>
                            <button 
                                onClick={() => window.location.href = '/subjects'}
                                className="w-full py-2 text-xs font-bold text-primary-600 bg-white border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors"
                            >
                                Manage Subjects
                            </button>
                        </div>
                    </div>
                </div>

                {/* Plan Display */}
                <div className="md:col-span-2 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {!plan && !loading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl"
                            >
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                    <Sparkles size={40} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-400">Ready to boost your productivity?</h4>
                                <p className="text-slate-400 mt-2">Adjust the settings and click generate to see your AI-crafted study plan here.</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div className="h-full flex flex-col items-center justify-center p-12">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mb-8"
                                />
                                <h4 className="text-xl font-bold">Crafting your plan...</h4>
                                <p className="text-slate-500 mt-2">Gemini is analyzing your goals and optimizing your schedule.</p>
                            </motion.div>
                        )}

                        {plan && !loading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-2xl font-black">Your Weekly Plan</h3>
                                    <button className="text-primary-600 font-bold flex items-center gap-1 hover:underline text-sm">
                                        Save to Calendar <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(plan).map(([day, sessions], idx) => (
                                        <motion.div 
                                            key={day}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="card p-0 overflow-hidden"
                                        >
                                            <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                                                <h4 className="font-black text-slate-800">{day}</h4>
                                                <CheckCircle size={16} className="text-slate-300" />
                                            </div>
                                            <div className="p-4 space-y-3">
                                                {Array.isArray(sessions) ? sessions.map((s, i) => (
                                                    <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                                        <div className="text-xs font-bold text-slate-400 w-20 pt-1 shrink-0">{s.time}</div>
                                                        <div>
                                                            <div className="font-bold text-primary-600">{s.subject}</div>
                                                            <div className="text-sm text-slate-500">{s.task || 'General Study Session'}</div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="text-sm text-slate-500 p-2">{sessions.toString()}</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AITimetable;
