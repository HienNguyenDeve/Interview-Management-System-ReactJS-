import { useEffect, useState } from "react";

let activeRequests = 0;
let updateSpinner: (show: boolean) => void = () => { };

const showSpinner = () => {
    activeRequests++;
    updateSpinner(true);
}
const hideSpinner = () => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) updateSpinner(false);
}

const Spinner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        updateSpinner = setVisible;
    }, []);

    if (!visible) return null;

    return (
        <div className="flex">
            <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-8 border-solid border-slate-300 "></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-solid border-blue-500 border-t-transparent shadow-md"></div>
            </div>
        </div>
    );
};

export { showSpinner, hideSpinner, Spinner };