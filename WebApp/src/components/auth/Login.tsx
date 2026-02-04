import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { RectangleEllipsis, User } from 'lucide-react';
import api from '../../../src/api/axiosConfig';

export default function Login() {
  const [Username, setUsuario] = useState('admin');
  const [Password, setPassword] = useState('clinica123');
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      const response = await api.post('Auth/login', { Username, Password });
      
      navigate('/dashboard');
      login(response.data);
    } catch (err: any) {
      console.error('Error en el login:', err);
      setError(err.response?.data?.message || 'Error al conectar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    return () => { }; // Limpieza al desmontar
  }, [user]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-96 border border-blue-100">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Clínica Dental</h2>

        {error && <p className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <div className='flex items-center w-full mt-1 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus-within:border-blue-500 transition'>
            <span className='flex items-center justify-center h-14 px-4 text-slate-400'>
              <User className="text-slate-800" size={24} strokeWidth={2.5} />
            </span>
            <input
              type="text"
              className="flex-1 h-14 px-2 bg-transparent border-none rounded-2xl outline-none text-slate-700 placeholder:text-slate-400"
              value={Username}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="flex items-center w-full mt-1 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus-within:border-blue-500 transition-all">
            <span className="flex items-center justify-center h-14 px-4 text-slate-400">
              <RectangleEllipsis className="text-slate-800" size={24} strokeWidth={2.5} />
            </span>
            <input
              type="password"
              placeholder="••••••••••••"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 h-14 px-2 bg-transparent border-none rounded-2xl outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
         disabled={isloading}>
          {isloading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}