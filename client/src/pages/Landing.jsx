import { Link } from 'react-router-dom';
import { BookOpen, Target, Zap, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200 shrink-0">
                        P+
                    </div>
                    <span className="text-xl md:text-2xl font-bold tracking-tight hidden sm:block">PrepPlus</span>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <Link to="/login" className="px-3 md:px-5 py-2 font-medium text-sm md:text-base hover:text-primary-600 transition-colors">Login</Link>
                    <Link to="/register" className="btn-primary text-sm md:text-base px-4 md:px-6 py-2 md:py-2.5">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-white to-primary-50/30">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-6">
                        <Zap size={16} className="fill-current" />
                        AI-Powered Study Planning is here
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                        Master Your Studies with <span className="text-primary-600">Smart AI</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                        Stop procrastinating and start succeeding. PrepPlus uses AI to generate personalized timetables, track your focus, and keep you on top of every exam.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                            Start Planning for Free <ChevronRight size={20} />
                        </Link>

                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-6">
                    <FeatureCard
                        icon={<Target className="text-indigo-600" />}
                        title="AI Timetables"
                        desc="Generate customized weekly plans based on your subjects, deadlines, and available hours."
                    />
                    <FeatureCard
                        icon={<Clock className="text-orange-600" />}
                        title="Pomodoro Engine"
                        desc="Deep work sessions with automated break tracking to maximize your productivity."
                    />
                    <FeatureCard
                        icon={<BookOpen className="text-emerald-600" />}
                        title="Progress Analytics"
                        desc="Visualize your study streaks and subject completion with beautiful, interactive charts."
                    />
                </div>
            </section>

            <footer className="p-10 border-t border-slate-100 text-center text-slate-500">
                <p>&copy; 2026 PrepPlus AI. Built for high achievers.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card text-left flex flex-col gap-4">
        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
);

export default Landing;
