import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuariosResponse } from '../models/usuarios/usuarios-response';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuarioApi:string = "http://localhost:8080/v1/api/usuario";

  constructor(private http:HttpClient) { }

  getUsuarios():Observable<UsuariosResponse[]>{
    return this.http.get<UsuariosResponse[]>(`${this.usuarioApi}/listar`);
  }
}
