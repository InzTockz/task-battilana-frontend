import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TareaResponse } from '../models/tareas/tarea-response';
import { Observable } from 'rxjs';
import { TareaRequest } from '../models/tareas/tarea-request';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private tareasApi:string = "http://localhost:8080/v1/api/tareas";
  //private tareasApi:string = "http://192.168.1.10:8080/v1/api/tareas";

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

  postTareas(tarea:TareaRequest):Observable<Response>{
    return this.http.post<Response>(`${this.tareasApi}/registrar`, tarea);
  }
}
