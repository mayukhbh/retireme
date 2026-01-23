import { AnimatePresence } from 'framer-motion';
import Toast, { type ToastProps } from './Toast';

interface ToastData extends Omit<ToastProps, 'onClose'> {
    id: string;
}

interface ToastContainerProps {
    toasts: ToastData[];
    onClose: (id: string) => void;
}

const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => onClose(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
