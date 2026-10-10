import { useState, useEffect } from 'react';
import { ChevronRight, UserRoundPlus } from 'lucide-react';
import { AxiosError } from 'axios';
import api from '../api/axiosConfig';
import { useNotify } from '../components/Context/NotifyContext';
import type { Usuario } from '../types/Usuario';
import type { PagePrompt } from '../types/PagePrompt';
import Tabla from '../components/common/Table';
import Modal from '../components/common/Modal';

interface UsuarioForm {
    username: string;
    email: string;
}

const initialForm: UsuarioForm = {
    username: '',
    email: '',
};


export default function UsuariosPage() {
    const { success, error } = useNotify();
    const [form, setForm] = useState<UsuarioForm>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorForm, setErrorForm] = useState<string | null>(null);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [PagePrompt, setPagePrompt] = useState<PagePrompt>({ pageNumber: 1, pageSize: 10, TotalRecords: 0 });

    useEffect(() => {
        getUsuarios();
    }, [PagePrompt.pageNumber, PagePrompt.pageSize]);

    const getUsuarios = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/Auth/usuarios', {
                params: {
                    pageNumber: PagePrompt.pageNumber,
                    pageSize: PagePrompt.pageSize,
                },
            });
            setUsuarios(response.data.data);
            setPagePrompt((current) => ({
                ...current,
                TotalRecords: response.data.totalRecords,
            }));
        } catch (err: AxiosError | any) {
            if (err.response?.status === 401) {
                console.error("Usuario no autorizado");
            }
            console.error("Error al obtener usuarios:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const habilitarUsuario = async (username: string) => {
        try {
            await api.put(`/Auth/habilitar-usuario/${username}`);
            success({ titulo: 'Usuario habilitado', descripcion: 'El usuario se habilitó correctamente.' });
            getUsuarios();
        } catch (err: AxiosError | any) {
            const responseData = (err as AxiosError<{ message?: string; errors?: string[] }>).response?.data;
            const details = responseData?.errors?.join(' ');
            error({ titulo: 'Error', descripcion: details || responseData?.message || 'No se pudo habilitar el usuario.' });
        }
    };

    const deshabilitarUsuario = async (username: string) => {
        try {
            await api.put(`/Auth/deshabilitar-usuario/${username}`);
            success({ titulo: 'Usuario deshabilitado', descripcion: 'El usuario se deshabilitó correctamente.' });
            getUsuarios();
        } catch (err: AxiosError | any) {
            console.error("Error al deshabilitar usuario:", err);
            const responseData = (err as AxiosError<{ message?: string; errors?: string[] }>).response?.data;
            const details = responseData?.errors?.join(' ');
            error({ titulo: 'Error', descripcion: details || responseData?.message || 'No se pudo deshabilitar el usuario.' });
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
        setErrorForm(null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        if (!form.email || !form.username) {

            error({ titulo: 'Validaciones', descripcion: 'Debe digitar todos los campos.' })
            return;
        }

        setIsSubmitting(true);
        setErrorForm(null);
        try {
            await api.post('/Auth/register', {
                username: form.username.trim(),
                email: form.email.trim(),
            });
            setForm(initialForm);
            success({ titulo: 'Usuario creado', descripcion: 'La cuenta se registró correctamente.' });
            getUsuarios();
        } catch (er: AxiosError | any) {
            const responseData = (er as AxiosError<{ message?: string; errors?: string[] }>).response?.data;
            const identityErrors = responseData?.errors?.join(' ');
            setErrorForm(identityErrors || responseData?.message || 'No se pudo registrar el usuario.');
            error({ titulo: 'Error', descripcion: 'No se pudo registrar el usuario.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const columnas = [
        { header: 'Usuario', key: 'userName' },
        { header: 'Email', key: 'email' },
        { header: 'Fecha de Creación', key: 'fechaCreacion' },
        { header: 'Ultima Conexion', key: 'fechaUltimaConexion' },
        {
            header: 'Estado', key: 'isEnabled', render: (row: Usuario) => (
                row.isEnabled ?
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Habilitado</span>
                    :
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Deshabilitado</span>
            )
        },
        {
            header: 'Acciones', key: 'acciones', render: (row: Usuario) => (
                <div className="flex gap-2">
                    <button className="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700" hidden={!row.isEnabled}
                        onClick={async () => {
                            deshabilitarUsuario(row.userName);
                        }}>
                        <ChevronRight />
                    </button>
                    <button className="px-2 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700" hidden={row.isEnabled}
                        onClick={async () => {
                            habilitarUsuario(row.userName);
                        }}>
                        <ChevronRight />
                    </button>

                </div>
            )
        }
    ];
    const inputClass = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100';
    const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

    return (
        <div className="relative">

            <h1 className="text-2xl font-bold text-gray-800 ">Gestión de Usuarios</h1>
            <hr className="my-4 border-gray-300" />
            <div className="mb-4 text-gray-600">
                <button className="flex w-50  items-center justify-between p-2 bg-white border border-slate-200 rounded-3xl
                        hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-all group"
                    onClick={() => setIsModalOpen(!isModalOpen)}>
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600"><UserRoundPlus className="w-5 h-5" /></div>
                        <span className="font-semibold text-slate-700">Crear Usuario</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                </button>

            </div>
            <Tabla columns={columnas} data={usuarios} isLoading={isLoading}
                PagePromts={PagePrompt} onPageChange={(page) => setPagePrompt({ ...PagePrompt, pageNumber: page })}
            />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)}>
                <div className='flex flex-col gap-4 p-6'>
                    <div className="border-b border-slate-200 pb-5">
                        <h1 className="text-2xl font-semibold text-slate-800">Crear usuario</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
                        <div>
                            <label className={labelClass} htmlFor="username">Nombre de usuario</label>
                            <input
                                className={inputClass}
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                value={form.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className={labelClass} htmlFor="email">Correo electrónico</label>
                            <input
                                className={inputClass}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        {errorForm && (
                            <p className="text-sm text-red-700" role="alert">{errorForm}</p>
                        )}

                        <button
                            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <UserRoundPlus size={18} aria-hidden="true" />
                            {isSubmitting ? 'Creando...' : 'Crear usuario'}
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}