import React, { useState, useRef, useEffect } from 'react';

interface ModalProps { 
    isOpen: boolean;   
    children: React.ReactNode;
    onClose?: () => void;
}

export default function Modal({ isOpen, children, onClose }: ModalProps) { 
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    
    const modalRef = useRef<HTMLDivElement>(null);

    // 1. Ampliamos la referencia para guardar los límites izquierdo y derecho
    const dragRef = useRef({
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
        minY: 0,
        minX: 0,
        maxX: 0,
    });

    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);

        if (modalRef.current) {
            // Extraemos las coordenadas exactas del modal en la pantalla
            const rect = modalRef.current.getBoundingClientRect();
            const padding = 16; // 16px de margen para que no pegue completamente al borde

            dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                initialX: position.x,
                initialY: position.y,
                
                // 2. Calculamos la distancia permitida hacia arriba, izquierda y derecha
                minY: position.y - rect.top + padding,
                minX: position.x - rect.left + padding,
                maxX: position.x + (window.innerWidth - rect.right) - padding,
            };
        }
    };

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (!isDragging) return;
            
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;

            const nextX = dragRef.current.initialX + dx;
            const nextY = dragRef.current.initialY + dy;

            setPosition({
                // 3. Limitamos el eje X para que no sobrepase ni la izquierda ni la derecha
                x: Math.max(dragRef.current.minX, Math.min(dragRef.current.maxX, nextX)),
                
                // Mantenemos el límite en el eje Y (Top)
                y: Math.max(dragRef.current.minY, nextY),
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
        // Se añade 'overflow-hidden' al contenedor principal por precaución
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 overflow-hidden ">
            <div 
                ref={modalRef}
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                className="flex flex-col bg-white rounded-2xl p-2 shadow-2xl w-full sm:w-fit max-w-[95vw] max-h-[95vh] transition-shadow duration-300 pointer-events-auto"
            >
                <div 
                    onPointerDown={handlePointerDown}
                    className="flex justify-between items-center mb-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-t-xl cursor-move select-none transition-colors touch-none shrink-0"
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

                <div className="flex p-2 overflow-x-auto overflow-y-auto ">
                    {children}
                </div>
            </div>
        </div>
    );
}