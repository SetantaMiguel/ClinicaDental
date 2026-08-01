import React, { useState, useRef, useEffect } from 'react';

interface ModalProps { 
    isOpen: boolean;   
    children: React.ReactNode;
    onClose?: () => void;
}

export default function Modal({ isOpen, children, onClose }: ModalProps) { 
    // Estado para controlar las coordenadas (x, y) de la ventana
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    // Ref para almacenar las posiciones iniciales sin causar re-renderizados
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
    });

    // Inicia el arrastre al presionar el ratón en la cabecera
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y,
        };
    };

    // Escucha los movimientos del ratón en toda la ventana mientras se arrastra
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            
            setPosition({
                x: dragRef.current.initialX + dx,
                y: dragRef.current.initialY + dy,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            
            {/* Contenedor del Modal con transformación de posición dinámica */}
            <div 
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                className="block bg-white rounded-2xl p-2 shadow-2xl mx-4 transition-shadow duration-300 pointer-events-auto"
            >
                {/* Barra superior de arrastre (Handle) */}
                <div 
                    onMouseDown={handleMouseDown}
                    className="flex justify-between items-center mb-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-t-xl cursor-move select-none transition-colors"
                >
                    <span className="text-xs font-semibold text-gray-500 tracking-wider">
                        ≡ Arrastrar ventana
                    </span>
                    
                    <button 
                        onClick={onClose} 
                        onMouseDown={(e) => e.stopPropagation()} // Evita arrastrar al pulsar el botón de cerrar
                        className="text-gray-500 hover:text-gray-800 transition-colors p-1"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>               
                </div>          
                
                {/* Contenido principal del modal */}
                <div className="flex p-2">
                    {children}
                </div>
            </div>
        </div>
    );
}