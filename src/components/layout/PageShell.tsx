import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Starfield from '../visuals/Starfield';

interface PageShellProps {
    children: ReactNode;
}

const PageShell = ({ children }: PageShellProps) => {
    return (
        <div className="min-h-screen flex flex-col bg-space-950 text-white font-sans selection:bg-cosmic-500/30">
            <Starfield />
            <Navbar />
            <main className="flex-grow relative z-10">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default PageShell;
