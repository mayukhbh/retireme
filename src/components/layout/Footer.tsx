const Footer = () => {
    return (
        <footer className="bg-space-950 text-slate-400 py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">RetireMe</h3>
                        <p className="text-sm leading-relaxed max-w-xs text-slate-500">
                            AI-powered retirement planning that adapts to your skills, lifestyle, and financial goals.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-cosmic-500 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-cosmic-500 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-cosmic-500 transition-colors">Methodology</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-cosmic-500 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-cosmic-500 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-cosmic-500 transition-colors">Disclaimer</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 text-center text-xs text-slate-600">
                    &copy; {new Date().getFullYear()} RetireMe Inc. All rights reserved. Not financial advice.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
