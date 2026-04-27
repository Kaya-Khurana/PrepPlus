import { Search, Bell, User, Sun, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    })();

    return (
        <nav className="h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-50">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl md:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div className="relative w-full max-w-[160px] sm:max-w-xs md:max-w-sm lg:w-96 hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-slate-50 text-slate-500 transition-colors">
                    <Sun size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-500 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                
                <div className="h-8 w-[1px] bg-slate-100 mx-1 md:mx-2" />

                <div className="flex items-center gap-3 pl-1 md:pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user?.name}</p>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-1">{user?.role || 'Student'}</p>
                    </div>
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-200 text-sm md:text-base">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
