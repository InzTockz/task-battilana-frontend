import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuariosResponse } from '../models/usuarios/usuarios-response';
import { Observable } from 'rxjs';
import { UsuariosRequest } from '../models/usuarios/usuarios-request';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //private usuarioApi:string = "http://192.168.1.10:8080/v1/api/usuario";
  private usuarioApi:string = "http://192.168.1.139:8080/v1/api/usuario";

  constructor(private http:HttpClient, private header:HeaderService) { }

  getUsuarios():Observable<UsuariosResponse[]>{
    return this.http.get<UsuariosResponse[]>(`${this.usuarioApi}/listar`, {headers: this.header.getHeader()});
  }

  postUsuarios(usuario:UsuariosRequest):Observable<UsuariosResponse>{
    return this.http.post<UsuariosResponse>(`${this.usuarioApi}/registrar`, usuario, {headers: this.header.getHeader()})
  }
}
