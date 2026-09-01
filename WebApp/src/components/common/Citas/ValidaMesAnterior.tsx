import { TrendingDown, TrendingUp } from "lucide-react";

interface ValidaProps {
    value: number
}

export default function ValidaMesAnterior({ value }: ValidaProps) {
    // Si el valor es 0, no renderizamos nada para evitar espacios o fondos vacíos
    if (value === 0) return null;

    const isPositive = value > 0;

    return (
        <div className="flex items-center text-sm">
            {/* Cambiamos el color dinámicamente: Verde si sube, Rojo si baja */}
            <span 
                className={`flex items-center font-medium px-2 py-0.5 rounded-md ${
                    isPositive 
                        ? 'text-emerald-600 bg-emerald-50' 
                        : 'text-rose-600 bg-rose-50'
                }`}
            >
                {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" /> 
                ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                )}
                
                {/* Opcional: mostrar el valor (ej. 15%). Si no lo quieres, bórralo */}
                {value}% 
                
                <span className="text-slate-400 ml-2 font-normal">vs. mes anterior</span>
            </span>
        </div>
    );
}