import { Outlet } from "react-router-dom";
import SlideBar from "../components/general/SlideBar";
import { useState } from "react";

export default function Layout() {
    const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SlideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      
      {/* Contenedor del contenido principal */}
      <main className={`
            flex-1 p-8 transition-all duration-300 ease-in-out 
            ${isExpanded ? 'ml-64' : 'ml-20'}
        `}>
        <Outlet />
      </main>
    </div>
  );
}