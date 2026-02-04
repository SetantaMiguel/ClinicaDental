import Loading from '../Icons/Loading';
import {useState} from 'react';
import CustomSwitch from './Switch';
import type { PagePrompt } from '../../types/index.ts';

interface Column<T> {
    header: string;
    key: keyof T | string;
    render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    PagePromts: PagePrompt;
    onPageChange: (NewPage: number) => void;
}


export default function Table<T>({ columns, data, isLoading, PagePromts, onPageChange }: TableProps<T>) {
    const totalPages = PagePromts.TotalRecords && PagePromts.pageSize ? Math.ceil(PagePromts.TotalRecords / PagePromts.pageSize) : 0;
    const [showInfoPage,setShowInfoPage] = useState(true);

    const SiguientePagina = () => {
        const currentPage = PagePromts.pageNumber < totalPages ? PagePromts.pageNumber + 1 : PagePromts.pageNumber;
        onPageChange(currentPage);
    }
    const AnteriorPagina = () => {
        const currentPage = PagePromts.pageNumber > 1 ? PagePromts.pageNumber - 1 : PagePromts.pageNumber;
        onPageChange(currentPage);
    }
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-end p-4">
                <CustomSwitch label='Info' enabled={showInfoPage} onChange={setShowInfoPage} />                
            </div>
            <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="py-20">
                                <div className="flex flex-col items-center justify-center w-full">
                                    <Loading />
                                    <p className="text-gray-500 font-medium mt-4 animate-pulse">
                                        Cargando pacientes...
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr><td colSpan={columns.length} className="p-10 text-center text-gray-400">No hay datos disponibles</td></tr>
                    ) : (
                        data.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-blue-50/50 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                        {col.render ? col.render(item) : (item as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {PagePromts.TotalRecords !== undefined && PagePromts.pageSize !== undefined && PagePromts.pageNumber !== undefined && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                        Mostrando página <b>{PagePromts.pageNumber}</b> de <b>{Math.ceil(PagePromts.TotalRecords / PagePromts.pageSize)} </b> 
                                  {showInfoPage && <span>- Total de registros: <b>{PagePromts.TotalRecords}</b> - Mostrando: {PagePromts.pageSize}</span>}
                   <div className="flex justify-center mt-2">
                        <button
                            className={`text-white ml-4 px-3 py-1 rounded-lg transition
                                ${PagePromts.pageNumber <= 1
                                    ? 'bg-gray-400 cursor-not-allowed '
                                    : 'bg-blue-500 hover:bg-blue-600 shadow-sm '}`}
                            disabled={PagePromts.pageNumber <= 1}
                            onClick={AnteriorPagina} >
                            Anterior
                        </button>
                        <button className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Actual 
                        </button>
                        <button
                            className={`ml-4 px-3 py-1 text-white  rounded-lg transition
                                        ${PagePromts.pageNumber >= totalPages
                                    ? 'bg-gray-400 cursor-not-allowed '
                                    : 'bg-blue-500 hover:bg-blue-600 shadow-sm  '}`}
                            disabled={PagePromts.pageNumber >= totalPages}
                            onClick={SiguientePagina}>
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}
