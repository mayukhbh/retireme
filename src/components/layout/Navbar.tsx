import { Link, useLocation } from 'react-router-dom';


const Navbar = () => {
    const location = useLocation();
    const isWizard = location.pathname === '/planner';

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-space-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute inset-0 border border-cosmic-500 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
                            <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">RetireMe</span>
                    </Link>

                    {!isWizard && (
                        <div className="flex items-center gap-6">
                            <Link to="/planner" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
                                How it works
                            </Link>
                            <Link
                                to="/planner"
                                className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/20 transition-all"
                            >
                                Start Planning
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
