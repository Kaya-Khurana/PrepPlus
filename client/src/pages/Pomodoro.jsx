import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Bell, Settings2 } from 'lucide-react';

const Pomodoro = () => {
    const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const timerRef = useRef(null);

    const modes = {
        focus: { label: 'Focus Time', time: 25 * 60, color: 'text-primary-600', bg: 'bg-primary-50', icon: <Brain size={24} /> },
        shortBreak: { label: 'Short Break', time: 5 * 60, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Coffee size={24} /> },
        longBreak: { label: 'Long Break', time: 15 * 60, color: 'text-purple-600', bg: 'bg-purple-50', icon: <Zap size={24} /> }
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const handleComplete = () => {
        setIsActive(false);
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
        
        if (mode === 'focus') {
            setSessionsCompleted(prev => prev + 1);
            alert('Session complete! Time for a break.');
            switchMode('shortBreak');
        } else {
            alert('Break over! Ready to focus?');
            switchMode('focus');
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(modes[newMode].time);
        setIsActive(false);
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].time);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = ((modes[mode].time - timeLeft) / modes[mode].time) * 100;

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] space-y-12">
            <header className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Focus Engine</h1>
                <p className="text-slate-500">Master your productivity using the Pomodoro technique.</p>
            </header>

            {/* Timer Card */}
            <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 p-12 border border-white relative overflow-hidden">
                {/* Mode Switcher */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-12 relative z-10">
                    {Object.entries(modes).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => switchMode(key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                                mode === key 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {data.label}
                        </button>
                    ))}
                </div>

                {/* Progress Circle Visual */}
                <div className="relative flex items-center justify-center mb-12">
                    <svg className="w-64 h-64 transform -rotate-90">
                        <circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-50"
                        />
                        <motion.circle
                            cx="128"
                            cy="128"
                            r="120"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={754}
                            initial={{ strokeDashoffset: 754 }}
                            animate={{ strokeDashoffset: 754 - (754 * progress) / 100 }}
                            className={`${modes[mode].color} transition-all duration-300`}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                        <span className={`text-sm font-bold mt-2 uppercase tracking-widest ${modes[mode].color}`}>
                            {mode === 'focus' ? 'Focusing' : 'Resting'}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 relative z-10">
                    <button 
                        onClick={resetTimer}
                        className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        <RotateCcw size={24} />
                    </button>
                    
                    <button 
                        onClick={toggleTimer}
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                            isActive 
                                ? 'bg-white border-2 border-slate-100 text-slate-900' 
                                : 'bg-primary-600 text-white shadow-primary-200'
                        }`}
                    >
                        {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                    </button>

                    <button className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                        <Settings2 size={24} />
                    </button>
                </div>
            </div>

            {/* Session Stats */}
            <div className="flex gap-8">
                <div className="flex items-center gap-4 px-8 py-5 bg-white rounded-3xl border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <Zap size={24} className="fill-current" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sessions</p>
                        <h4 className="text-2xl font-black">{sessionsCompleted} / 4</h4>
                    </div>
                </div>

                <div className="flex items-center gap-4 px-8 py-5 bg-white rounded-3xl border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Bell size={24} className="fill-current" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Muted</p>
                        <h4 className="text-2xl font-black">Alarm On</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pomodoro;
