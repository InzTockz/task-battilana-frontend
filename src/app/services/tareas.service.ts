import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TareaResponse } from '../models/tareas/tarea-response';
import { Observable } from 'rxjs';
import { TareaRequest } from '../models/tareas/tarea-request';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private tareasApi:string = "http://localhost:8080/v1/api/tareas";
  //private tareasApi:string = "http://192.168.1.10:8080/v1/api/tareas";

  constructor(private http:HttpClient, private header:HeaderService) { }

  getTareas():Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listar`, {headers: this.header.getHeader()});
  }

  getContadorPendiente():Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-pendientes`, {headers: this.header.getHeader()});
  }

  getContadorTerminado():Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-terminados`, {headers: this.header.getHeader()});
  }

  getContadorTotales():Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-totales`, {headers: this.header.getHeader()});
  }

  postTareas(tarea:TareaRequest):Observable<TareaResponse>{
    return this.http.post<TareaResponse>(`${this.tareasApi}/registrar`, tarea, {headers: this.header.getHeader()});
  }

  deleteTarea(idTarea:number):Observable<void>{
    return this.http.delete<void>(`${this.tareasApi}/eliminar/${idTarea}`, {headers: this.header.getHeader()});
  }

  findTarea(idTarea:number):Observable<TareaResponse>{
    return this.http.get<TareaResponse>(`${this.tareasApi}/buscar/${idTarea}`, {headers: this.header.getHeader()});
  }

  updateTarea(idTarea:number, tarea:TareaRequest):Observable<TareaResponse>{
    return this.http.put<TareaResponse>(`${this.tareasApi}/actualizar/${idTarea}`, tarea, {headers: this.header.getHeader()});
  }

  updateStatus(idTarea:number):Observable<void>{
    return this.http.put<void>(`${this.tareasApi}/actualizar-estado/${idTarea}`, null, {headers: this.header.getHeader()});
  }

  getPendiente():Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-pendientes`, {headers: this.header.getHeader()});
  }

  getTerminado():Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-terminado`, {headers: this.header.getHeader()});
  }

  getTerminadoPorUsuario(idUsuario:number):Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-terminado/usuario/${idUsuario}`, {headers: this.header.getHeader()});
  }

  getPendientePorUsuario(idUsuario:number):Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-pendiente/usuario/${idUsuario}`, {headers: this.header.getHeader()});
  }

  getTotalPorUsuario(idUsuario:number):Observable<TareaResponse[]>{
    return this.http.get<TareaResponse[]>(`${this.tareasApi}/listado-total/usuario/${idUsuario}`, {headers: this.header.getHeader()});
  }

  getContadorPendientePorUsuario(idUsuario:number):Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-pendientes/usuario/${idUsuario}`, {headers: this.header.getHeader()})
  }

  getContadorCompletadoPorUsuario(idUsuario:number):Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-completado/usuario/${idUsuario}`, {headers: this.header.getHeader()})
  }

  getContadorTotalPorUsuario(idUsuario:number):Observable<number>{
    return this.http.get<number>(`${this.tareasApi}/contador-total/usuario/${idUsuario}`, {headers: this.header.getHeader()})
  }
}
