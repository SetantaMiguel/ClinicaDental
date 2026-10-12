export interface CitaEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  pacienteId: number;
  observaciones?: string | null;
  pacienteNombre?: string;
  estadoCitaCodigo: string;
  estadoCitaDescripcion: string;
  fechaText?: string;
  Recibo? : CitaReciboResponse;
  usuarioCreacion?: string;
  tiposCita?: CitaCatalogos[];
}

interface CitaReciboResponse {
  idRecibo:number;
  medioPago:number;
  montoNeto:number;
  observaciones:string;
}

interface CitaCatalogos{
  idTipoCita: number;
  tipoCitaNombre: string;
}