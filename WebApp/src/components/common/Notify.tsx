import { useEffect } from "react";
import type { notifyMessage } from '../../types/index'

export default function Notify({ titulo,descripcion, tipo, position, isOpen, onClose }: notifyMessage) { 
    const icon = tipo === 'success' ? 'm4.5 12.75 6 6 9-13.5' 
                : tipo === 'error' ? 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z' 
                : tipo  ==='info' ? 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' : '';
    const borderColor = tipo === 'success' ? 'border-green-500' 
                    : tipo === 'error' ? 'border-red-500' 
                    : 'border-blue-500';    
    const iconColor = tipo === 'success' ? 'text-green-600' 
                    : tipo === 'error' ? 'text-red-600' 
                    : 'text-blue-600';

    useEffect(() => {
        if(isOpen) {
            const timer = setTimeout(() => {
                onClose?.();
            }, 3000);
            return () => clearTimeout(timer); // Limpieza al desmontar
        }
    }, [isOpen, onClose]);


    if (!isOpen) return null;
    
    return (
        <div className={`fixed ${
                        position === 'top-right' ? 'top-5 right-5' 
                        : position === 'top-left' ? 'top-5 left-5' 
                        : position === 'bottom-right' ? 'bottom-5 right-5' 
                        : 'bottom-5 left-5'} 
                        z-[100] animate-in slide-in-from-right duration-500 animate-bounce`}>

            <div className={`bg-white ${borderColor} border-l-4 shadow-lg rounded-lg p-4 flex items-center gap-3 min-w-[280px]`}>

                <div className={`bg-blue-50 p-2 rounded-full ${iconColor}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                    </svg>
                </div>

                <div>
                <p className="text-sm font-semibold text-gray-800">
                    {titulo}
                </p>
                <p className="text-xs text-gray-500">
                    {descripcion}
                </p>
                </div>

                {/* Botón de cerrar manual opcional */}
                <button 
                onClick={() => onClose?.()}
                className="ml-auto text-gray-300 hover:text-gray-500"
                >
                <span className="text-xl">&times;</span>
                </button>
            </div>
        </div>
    );
}

    
