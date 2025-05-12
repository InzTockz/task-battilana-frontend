import { Estados } from "./estados";

export class TareaResponse {

    idTarea!: number;
    nombreTarea!: string;
    descripcion!: string;
    estado!: Estados;
    fechaCreacion!: Date;
    fechaInicio!: string;
    fechaFin!: string;
    idUsuariosEntity!: number;
    nombreUsuarioEntity!: string;
}
