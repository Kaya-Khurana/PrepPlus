import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Target, Clock, Shield, Bell, Moon, LogOut } from 'lucide-react';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [settings, setSettings] = useState({
        goal: user?.goal || 'No goal set',
        hours: user?.preferredStudyHours || 4,
        darkMode: false,
        notifications: true
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <header>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and personalized study preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="card h-fit text-center space-y-6">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-primary-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-2xl shadow-primary-200">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{user?.name || 'Guest'}</h3>
                        <p className="text-slate-500 text-sm">{user?.role === 'admin' ? 'Admin' : 'Student'} Member since 2026</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex justify-between px-4">
                        <div className="text-center">
                            <p className="text-2xl font-black">{user?.level || 1}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Level</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black">{user?.points || 0}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Points</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black">{user?.gpa || '0.0'}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">GPA</p>
                        </div>
                    </div>
                </div>

                {/* Settings Form */}
                <div className="md:col-span-2 space-y-6">
                    {/* Account Settings */}
                    <div className="card space-y-6">
                        <h4 className="flex items-center gap-2 font-bold text-lg"><Shield size={20} className="text-primary-600" /> Account Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600">Full Name</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-900 border border-slate-100">
                                    <User size={18} className="text-slate-400" />
                                    <span>{user?.name}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600">Email Address</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl text-slate-900 border border-slate-100">
                                    <Mail size={18} className="text-slate-400" />
                                    <span>{user?.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Study Preferences */}
                    <div className="card space-y-6">
                        <h4 className="flex items-center gap-2 font-bold text-lg"><Target size={20} className="text-orange-500" /> Study Preferences</h4>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-600">Daily Study Goal</label>
                                <input 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    value={settings.goal}
                                    onChange={(e) => setSettings({...settings, goal: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-600">Target Study Hours</label>
                                    <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-lg text-sm">{settings.hours}h</span>
                                </div>
                                <input 
                                    type="range" min="1" max="16" value={settings.hours}
                                    onChange={(e) => setSettings({...settings, hours: e.target.value})}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* UI & System */}
                    <div className="card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                                <Bell size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold">Push Notifications</h4>
                                <p className="text-slate-500 text-xs mt-0.5">Receive reminders for upcoming tasks.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSettings({...settings, notifications: !settings.notifications})}
                            className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${settings.notifications ? 'bg-primary-600' : 'bg-slate-200'}`}
                        >
                            <motion.div 
                                animate={{ x: settings.notifications ? 24 : 0 }}
                                className="w-6 h-6 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
