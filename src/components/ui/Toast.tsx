import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ToastProps {
    message: string;
    type?: 'error' | 'success' | 'info';
    duration?: number;
    onClose: () => void;
}

const Toast = ({ message, type = 'info', duration = 5000, onClose }: ToastProps) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        error: <AlertCircle className="h-5 w-5" />,
        success: <CheckCircle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
    };

    const colors = {
        error: 'bg-red-500/10 border-red-500/50 text-red-200',
        success: 'bg-green-500/10 border-green-500/50 text-green-200',
        info: 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-lg ${colors[type]} max-w-md`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-current hover:opacity-70 transition-opacity"
                aria-label="Close notification"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
