import Notify from '../components/general/Notify';
import { useState,useEffect } from 'react';
import { useAuth } from '../components/Context/AuthContext';


export default function Dashboard() { 
    const [showToast, setShowToast] = useState(false);
    const { user } = useAuth();
    
    const handleTriggerToast = () => {
        setShowToast(false);
        setTimeout(() => setShowToast(true), 10);
    };

    useEffect(() => {
            const timer = setTimeout(() => {
                handleTriggerToast();
            }, 0);
            return () => clearTimeout(timer); 
    }, [ ]);

  return (
    <div className="min-h-screen ">
      <Notify descripcion="Sesión iniciada correctamente" titulo={`¡Bienvenido, ${user}!`} 
        tipo="success" position="bottom-right" isOpen={showToast} onClose={() => setShowToast(false)} />

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de control</h1>

  </div>)
};
