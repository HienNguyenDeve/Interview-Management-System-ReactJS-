import { ToastItem } from "../models/core/toast.item";

type Action =
    | { type: 'ADD'; payload: ToastItem }
    | { type: 'REMOVE'; payload: number }
    | { type: 'EXIT'; payload: number };

export const toastReducer = (state: ToastItem[], action: Action): ToastItem[] => {
    switch (action.type) {
        case 'ADD':
            return [...state, action.payload];
        case 'EXIT':
            return state.map(toast =>
                toast.id === action.payload ? { ...toast, isExisting: true } : toast
            );
        case 'REMOVE':
            return state.filter(toast => toast.id !== action.payload);
        default:
            return state;
    }
}