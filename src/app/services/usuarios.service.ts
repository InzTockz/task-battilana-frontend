import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuariosResponse } from '../models/usuarios/usuarios-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuarioApi:string = "http://192.168.1.10:8080/v1/api/usuario";

  constructor(private http:HttpClient) { }

  getUsuarios():Observable<UsuariosResponse[]>{
    return this.http.get<UsuariosResponse[]>(`${this.usuarioApi}/listar`);
  }
}
