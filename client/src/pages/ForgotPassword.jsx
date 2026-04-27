import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(`Instruction sent to ${email}. Check your inbox!`);
            if (res.data.previewUrl) {
                setPreviewUrl(res.data.previewUrl);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-white"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-bold text-sm">
                    <ArrowLeft size={18} /> Back to Login
                </Link>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900">Forgot Password?</h2>
                    <p className="text-slate-500 mt-2">Enter your email and we'll send you a recovery link.</p>
                </div>

                {message && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm mb-6 border border-emerald-100 font-bold">{message}</div>}
                
                {previewUrl && (
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-8 space-y-3">
                        <p className="text-xs text-amber-700 font-bold uppercase tracking-widest">Demo Mode: Email Intercepted</p>
                        <p className="text-sm text-amber-600">Since this is a demo, you can click below to view the recovery email in a virtual inbox:</p>
                        <a 
                            href={previewUrl} 
                            target="_blank" 
                            className="block w-full text-center py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
                        >
                            Open Virtual Inbox
                        </a>
                    </div>
                )}

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="name@company.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-200"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                        <Send size={18} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
