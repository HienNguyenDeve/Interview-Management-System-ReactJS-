import { createContext, ReactNode, useCallback, useMemo, useReducer } from "react";
import { ToastType } from "../enums/core/common/toast-type.enum";
import type { ToastItem } from "../models/core/toast.item";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import { toastReducer } from "../reducers/toast.reducer";

interface ToastContextType {
    toasts: ToastItem[];
    showToast: (type: ToastType, msg: string) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType>({
    toasts: [],
    showToast: () => { },
    removeToast: () => { }
});

const ToastProvider = ({ children }: {children: ReactNode}) => {
    const [toasts, dispatch] = useReducer(toastReducer, []);
    const removeToast = useCallback((id: number) => {
        dispatch({ type: 'EXIT', payload: id });
        setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), 500) // Match animation duration
    }, []);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = Date.now();
        dispatch({ type: 'ADD', payload: { type, message, id } });
        setTimeout(() => removeToast(id), 5000); // Automatically remove after 5 seconds
    }, [removeToast]);

    const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts, showToast, removeToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-16 right-4 space-y-2 z-10" aria-live="assertive" aria-atomic="true">
                {toasts.map((toast) => {
                    let style = 'bg-blue-500 text-white border border-slate-300';
                    if (toast.type === ToastType.Warning) style = 'bg-yellow-100 text-yellow-800 border border-yellow-300';
                    if (toast.type === ToastType.Error) style = 'bg-red-100 text-red-800 border border-red-300';
                    let icon = faInfoCircle;
                    if (toast.type === ToastType.Warning) icon = faCircleExclamation;
                    if (toast.type === ToastType.Error) icon = faTriangleExclamation;
                    let iconStyle = 'text-white';
                    if (toast.type === ToastType.Warning) iconStyle = 'text-yellow-800';
                    if (toast.type === ToastType.Error) iconStyle = 'text-red-800';
                    return (
                        <button key={toast.id} type='button'
                            className={`p-4 rounded shadow-md cursor-pointer transition-opacity duration-500 ${style} ${toast.isExisting ? 'animate-slideOut' : 'animate-slideIn'}`}
                            tabIndex={0} aria-label={`Close ${toast.type} toast`}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') removeToast(toast.id); }}
                            onClick={() => removeToast(toast.id)}>
                            <FontAwesomeIcon icon={icon} className={`mr-2 ${iconStyle} animate-ping`} />
                            <span>{toast.message}</span>
                            <FontAwesomeIcon icon={faTimes} className='ml-2' />
                        </button>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export {ToastContext, ToastProvider};