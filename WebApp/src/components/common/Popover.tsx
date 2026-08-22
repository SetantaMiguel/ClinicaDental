import { Funnel } from 'lucide-react';


interface PopoverProps {
    children: React.ReactNode;
    isOpen: boolean;          // El estado viene del padre
    onToggle: () => void;    // Función para cerrar el popover, si es necesario
    classChild: string;
}

export default function Popover({  children, isOpen, onToggle,classChild }: PopoverProps) {

    return (

        <div className="relative"> 
            <button
                className={classChild}
                onClick={onToggle} 
            > Filtros
                <span className="pl-2 inline-block">
                    <Funnel size={16} strokeWidth={2.5} />
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 animate-fade-in">
                    {children}
                </div>
            )}
        </div>  

    );
}