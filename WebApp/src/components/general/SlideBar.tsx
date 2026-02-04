import { Users, Calendar, Home, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigate, NavLink } from 'react-router-dom';
import CloseSession  from '../auth/CloseSession';

interface SlideBarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function SlideBar({ isExpanded, setIsExpanded }: SlideBarProps) {

  const menuItems = [
    { icon: <Home size={22} />, ruta: '/dashboard', label: 'Inicio' },
    { icon: <Users size={22} />, ruta: '/pacientes', label: 'Pacientes' },
    { icon: <Calendar size={22} />, ruta: '/', label: 'Citas' },
    { icon: <Settings size={22} />, ruta: '/', label: 'Configuración' },
  ];

  return (
    <aside className={`
      fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50
      ${isExpanded ? 'w-64' : 'w-20'}
    `}>
      <div className="flex flex-col h-full">
        
        {/* Botón para colapsar */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-10 bg-blue-600 text-white
             rounded-full p-1 border-2 border-white 
             hover:bg-blue-700 transition-colors
             cursor-pointer"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo */}
        <div className="flex items-center h-20 px-6 overflow-hidden">
          <div className="min-w-[32px] w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className={`ml-4 text-xl font-bold text-gray-800 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            DentalCloud
          </span>
        </div>

        {/* Menú */}
        <nav className="flex-1 flex flex-col px-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink 
              key={index} 
              to={item.ruta}
              className={({ isActive }) => `
                flex items-center w-full p-3 transition-all group rounded-xl
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              <div className="min-w-[22px]">
                {item.icon}
              </div>
              <span className={`ml-4 font-medium whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}

          <div className="flex-1" />
          {/* Botón de Cerrar Sesión */}
          <div className="flex mb-4">
            <CloseSession />
          </div>
        </nav>
      </div>
    </aside>
  );
}