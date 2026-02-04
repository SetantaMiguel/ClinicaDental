import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import  {LogOut} from 'lucide-react';

export default function CloseSession() {
  const navigate = useNavigate(); 
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return <button className='flex items-center text-center w-full p-3 transition-all group rounded-xl
                    bg-blue-600 text-white shadow-md' onClick={handleLogout}>
      <LogOut size={22} className='min-w-[22px]'/>
    </button>;
};