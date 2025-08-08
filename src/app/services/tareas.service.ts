import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TareaResponse } from '../models/tareas/tarea-response';
import { Observable } from 'rxjs';
import { TareaRequest } from '../models/tareas/tarea-request';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  //private tareasApi:string = "http://localhost:8080/v1/api/tareas";
  private tareasApi:string = "http://192.168.1.10:8080/v1/api/tareas";

  constructor(private http:HttpClient) { }

  getTareas():Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listar`);
  }

  getContadorPendiente():Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-pendientes`);
  }

  getContadorTerminado():Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-terminados`);
  }

  getContadorTotales():Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-totales`);
  }

  postTareas(tarea:TareaRequest):Observable<TareaResponse>{
    return this.http.post<TareaResponse>(`${this.tareasApi}/registrar`, tarea);
  }

  deleteTarea(idTarea:number):Observable<void>{
    return this.http.delete<void>(`${this.tareasApi}/eliminar/${idTarea}`);
  }

  findTarea(idTarea:number):Observable<TareaResponse>{
    return this.http.get<TareaResponse>(`${this.tareasApi}/buscar/${idTarea}`);
  }

  updateTarea(idTarea:number, tarea:TareaRequest):Observable<TareaResponse>{
    return this.http.put<TareaResponse>(`${this.tareasApi}/actualizar/${idTarea}`, tarea);
  }

  updateStatus(idTarea:number):Observable<void>{
    return this.http.put<void>(`${this.tareasApi}/actualizar-estado/${idTarea}`, null);
  }

  getPendiente():Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-pendientes`);
  }

  getTerminado():Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-terminado`);
  }
}
