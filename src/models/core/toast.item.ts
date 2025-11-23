import type { ToastType } from "../../enums/core/common/toast-type.enum";

export interface ToastItem {
    id: number;
    type: ToastType;
    message: string;
    isExisting?: boolean;
}