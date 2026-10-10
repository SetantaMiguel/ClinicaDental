import { useState } from 'react';
import { Users, Calendar, Home, Settings, KeyRound,
   ChevronLeft, ChevronRight,
  Table,CalendarDays, UserRoundPlus
  } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '../../api/axiosConfig';
import { useNotify } from '../Context/NotifyContext';
import CloseSession  from '../auth/CloseSession';
import NavItem from './NavItem';
import Modal from './Modal';
import { useAuth } from '../Context/AuthContext';

interface SlideBarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function SlideBar({ isExpanded, setIsExpanded }: SlideBarProps) {
  const { success, error } = useNotify();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { icon: <Home size={22} />, ruta: '/dashboard', label: 'Inicio' },
    { 
      icon: <Users size={22} />, 
      label: 'Entes',
      subItems: [
        { label: 'Pacientes', ruta: '/pacientes', icon:<Table size={22} /> },
        { label: 'Usuarios', ruta: '/usuarios', icon:<UserRoundPlus size={22} /> },
      ]
    },
    { 
      icon: <Calendar size={22} />, 
      label: 'Citas',
      subItems : [
          { label: 'Calendario', ruta: '/citas',icon:<CalendarDays size={22}/> },
          { label: 'Listado', ruta: '/citasListado', icon:<Table size={22} />}
      ]
    },
    { 
      icon: <Settings size={22}  />, 
      label: 'Configuración',
      subItems: [
        { label: 'Sistema', ruta: '/servicios' },
      ]      
    },
  ];

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.post('/Auth/change-password', { currentPassword, newPassword });
      closePasswordModal();
      success({ titulo: 'Contraseña actualizada', descripcion: 'La contraseña se cambió correctamente.' });
    } catch (err) {
      const responseData = (err as AxiosError<{ message?: string; errors?: string[] }>).response?.data;
      const details = responseData?.errors?.join(' ');
      setPasswordError(details || responseData?.message || 'No se pudo actualizar la contraseña.');
      error({ titulo: 'Error', descripcion: 'No se pudo actualizar la contraseña.' });
    } finally {
      setIsSavingPassword(false);
    }
  };
  
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
            O
          </div>
          <span className={`ml-4 text-xl font-bold text-gray-800 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {user?.username || 'Usuario'}
          </span>
        </div>

        <nav className="flex-1 flex flex-col px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavItem key={index} item={item} isExpanded={isExpanded} />
          ))}
          <div className="flex-1" />
          <button
            type="button"
            title="Cambiar contraseña"
            aria-label="Cambiar contraseña"
            onClick={() => setIsPasswordModalOpen(true)}
            className={`flex items-center gap-3 rounded-lg p-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 ${isExpanded ? '' : 'justify-center'}`}
          >
            <Settings size={22} className="shrink-0" />
            {isExpanded && <span className="text-sm font-medium">Cambiar contraseña</span>}
          </button>
          <CloseSession />
          <br />
        </nav>
      </div>
      <Modal isOpen={isPasswordModalOpen} onClose={closePasswordModal}>
        <form onSubmit={handlePasswordChange} className="flex w-full min-w-72 flex-col gap-4 p-5 sm:min-w-96">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <KeyRound className="text-blue-700" size={22} aria-hidden="true" />
            <h2 className="text-xl font-semibold text-slate-800">Cambiar contraseña</h2>
          </div>
          <label className="text-sm font-medium text-slate-700">
            Contraseña actual
            <input required autoComplete="current-password" type="password" value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Nueva contraseña
            <input required minLength={6} autoComplete="new-password" type="password" value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Confirmar nueva contraseña
            <input required minLength={6} autoComplete="new-password" type="password" value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
          </label>
          {passwordError && <p className="text-sm text-red-700" role="alert">{passwordError}</p>}
          <button type="submit" disabled={isSavingPassword}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
            <KeyRound size={17} aria-hidden="true" />
            {isSavingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </Modal>
    </aside>
  );
}