import  { useState, useRef, useEffect } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface MonthYearPickerProps {
    selectedDate:Date
    onChange: (date: Date) => void;
}

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const SHORT_MONTHS = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

export default function MonthYearPicker({ onChange,selectedDate }: MonthYearPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
      
    // Estado para el año que se está visualizando en el calendario (por si el usuario navega sin hacer clic)
    const [displayYear, setDisplayYear] = useState<number>(new Date().getFullYear());
    
    const popoverRef = useRef<HTMLDivElement>(null);

    // Efecto para cerrar el popover al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(displayYear, monthIndex, 1);
        
        setIsOpen(false);
        onChange(newDate); // Pasamos la fecha al componente padre
    };

    const handlePrevYear = () => setDisplayYear(prev => prev - 1);
    const handleNextYear = () => setDisplayYear(prev => prev + 1);

    return (
        <div className="relative inline-block" ref={popoverRef}>
            {/* Botón Disparador */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
                <CalendarDays className="w-4 h-4 text-slate-500" />
                <span>
                    {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown del Calendario */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-4">
                    {/* Controles de Año */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                        <button 
                            onClick={handlePrevYear}
                            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-slate-700">
                            {displayYear}
                        </span>
                        <button 
                            onClick={handleNextYear}
                            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Grid de Meses */}
                    <div className="grid grid-cols-3 gap-2">
                        {SHORT_MONTHS.map((month, index) => {
                            const isSelected = 
                                selectedDate.getMonth() === index && 
                                selectedDate.getFullYear() === displayYear;

                            return (
                                <button
                                    key={month}
                                    onClick={() => handleMonthSelect(index)}
                                    className={`
                                        py-2 px-1 text-sm font-medium rounded-lg transition-colors
                                        ${isSelected 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }
                                    `}
                                >
                                    {month}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}