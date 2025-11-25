import React from "react";
import { ModalSize } from "../../../enums/modal-size.enum";
import { ModalType } from "../../../enums/modal-type.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    readonly isOpen: boolean;
    readonly onOk?: () => void;
    readonly onClose: () => void;
    readonly title: string;
    readonly modalType?: ModalType;
    readonly modalSize?: ModalSize;
    readonly children?: React.ReactNode;
    readonly header?: React.ReactNode;
    readonly footer?: React.ReactNode;
}

export function Modal(props: ModalProps) {
    const {isOpen, onOk, onClose, title, modalType = ModalType.INFO, 
        modalSize = ModalSize.SMALL, children, header, footer } = props;
    if (!isOpen) return null;

    let headerBG;
    switch (modalType) {
        case ModalType.INFO:
            headerBG = 'bg-blue-500';
            break;
        case ModalType.SUCCESS:
            headerBG = 'bg-green-500';
            break;
        case ModalType.WARNING:
            headerBG = 'bg-yellow-500';
            break;
        case ModalType.DANGER:
            headerBG = 'bg-red-500';
            break;
        default:
            headerBG = 'bg-blue-500';
    }

    let sizeClass = '';
    let paddingClass = 'p-4';
    switch (modalSize) {
        case ModalSize.SMALL:
            sizeClass = 'md:w-1/2 h-auto';
            break;
        case ModalSize.MEDIUM:
            sizeClass = 'md:w-3/4 h-auto';
            break;
        case ModalSize.LARGE:
            sizeClass = 'md:w-3/4 h-auto';
            break;
        case ModalSize.FULL:
            sizeClass  = 'w-full h-screen';
            paddingClass = '';
            break;
        default:
            sizeClass = 'max-w-md';
    }

    let headerContent = header;

    if (!headerContent) {
        headerContent = (
            <div className={`card-header p-3 justify-between items-center rounded-t-md
                text-white ${headerBG}`}>
                <h2 className="font-semibold">{title}</h2>
                <button type="button" onClick={onClose} className="hover:text-gray-200" title="Close">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        );
    }

    let footerContent = footer;
    if (!footerContent) {
        footerContent = (
            <div className="actions space-x-3 flex justify-end">
                <button type="button" className="p-2 px-4 bg-gray-300 text-gray-700 hover:bg-gray-500
                    rounded-full" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="p-2 px-4 bg-blue-500 text-white hover:bg-blue-700
                    rounded-full" onClick={onOk ?? onClose}>
                    Ok
                </button>
            </div>
        )
    }

    return (
        <div className={`fixed top-0 left-0 inset-0 flex items-center justify-center bg-black bg-opacity-50
            z-50 w-screen h-screen ${paddingClass}`} onClick={onClose} aria-hidden='true'>
            <div className={`flex flex-col bg-white w-full rounded-md shadow-md ${sizeClass}`}
                onClick={(e) => e.stopPropagation()} aria-hidden='true'>
                {headerContent}
                <div className="flex-grow overflow-y-auto">
                    {children}
                </div>
                {footer && <div className="p-3">{footerContent}</div>}
            </div>
        </div>
    );
}