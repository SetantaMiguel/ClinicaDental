import React, { useState, useRef, useEffect } from 'react';

interface ModalProps { 
    isOpen: boolean;   
    children: React.ReactNode;
    onClose?: () => void;
}

export default function Modal({ isOpen, children, onClose }: ModalProps) { 
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
    });

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y,
        };
    };

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            
            setPosition({
                x: dragRef.current.initialX + dx,
                y: dragRef.current.initialY + dy,
            });
        };

        const handlePointerUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        }

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
            
            {/* CAMBIOS AQUÍ: Reemplazamos 'max-w-lg sm:w-auto' por 'w-full sm:w-fit max-w-[95vw]' */}
            <div 
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                className="block bg-white rounded-2xl p-2 shadow-2xl w-full sm:w-fit max-w-[95vw] transition-shadow duration-300 pointer-events-auto"
            >
                <div 
                    onPointerDown={handlePointerDown}
                    className="flex justify-between items-center mb-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-t-xl cursor-move select-none transition-colors touch-none"
                >
                    <span className="text-xs font-semibold text-gray-500 tracking-wider">
                        ≡ Arrastrar ventana
                    </span>
                    
                    <button 
                        onClick={onClose} 
                        onPointerDown={(e) => e.stopPropagation()} 
                        className="text-gray-500 hover:text-gray-800 transition-colors p-1"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>               
                </div>          
                
                <div className="flex p-2 overflow-x-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}