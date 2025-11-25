import React from "react";

function AnonymousLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main>
                <img src="https://media.tapchitaichinh.vn/w1480/images/upload//2023/09/18/fpt-tower.jpg" alt="FPT Tower" className="w-full h-screen object-cover" />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
                    {children}
                </div>
            </main>
        </>
    );
}

export default AnonymousLayout;