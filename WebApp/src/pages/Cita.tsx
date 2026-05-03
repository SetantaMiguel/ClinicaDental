import CalendarioCitas from "../components/common/CalendarioCitas/CalendarioCitas.tsx";

export default function Cita() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Citas</h1>
      <CalendarioCitas />
    </div>
  );
}