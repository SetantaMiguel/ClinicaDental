export interface CitaEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  pacienteId: number;
  tipoCitaId: number;
  observaciones?: string | null;
  pacienteNombre?: string;
  tipoCitaNombre?: string;
  estadoCitaCodigo: string;
  estadoCitaDescripcion: string;
  fechaText?: string;
  Recibo? : CitaReciboResponse;
}

interface CitaReciboResponse {
  idRecibo:number;
  medioPago:number;
  montoNeto:number;
  observaciones:string;
}