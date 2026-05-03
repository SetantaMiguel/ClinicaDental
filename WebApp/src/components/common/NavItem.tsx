import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function NavItem({ item, isExpanded }: { item: any, isExpanded: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = !!item.subItems;

  // Si no hay subitems, es un NavLink normal
  if (!hasSubItems) {
    return (
      <NavLink to={item.ruta} className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'}`}>
        <div className="min-w-[22px]">{item.icon}</div>
        {isExpanded && <span className="ml-4 font-medium">{item.label}</span>}
      </NavLink>
    );
  }

  // Si hay subitems, renderizamos el dropdown
  return (
    <div className="flex flex-col">
      <button 
        onClick={() => isExpanded && setIsOpen(!isOpen)}
        className="flex items-center w-full p-3 text-gray-600 hover:bg-blue-50 rounded-xl transition-all"
      >
        <div className="min-w-[22px]">{item.icon}</div>
        {isExpanded && (
          <div className="flex items-center justify-between w-full ml-4">
            <span className="font-medium">{item.label}</span>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </button>

      {/* Submenú con animación simple */}
      {isExpanded && isOpen && (
        <div className="ml-9 mt-1 flex flex-col space-y-1 border-l-2 border-blue-100 pl-2">
          {item.subItems.map((sub: any, idx: number) => (
            <NavLink 
              key={idx} 
              to={sub.ruta} 
              className={({ isActive }) => `p-2 text-sm rounded-lg transition-colors ${isActive ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-blue-600'}`}
            >
              {sub.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}