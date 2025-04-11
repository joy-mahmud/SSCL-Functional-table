import React, { ReactNode, useState } from "react";
interface TooltipProps {
    content: string,
    children: ReactNode
}


const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [show, setShow] = useState(false)
    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded shadow-md whitespace-nowrap z-50 transition-all duration-200">
                    {content}
                </div>
            )}
        </div>
    )
}

export default Tooltip