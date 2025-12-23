import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarpetaRequest } from '../models/carpetas/carpeta-request';
import { CarpetaResponse } from '../models/carpetas/carpeta-response';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class CarpetaService {

  private carpetaApi: string = 'http://192.168.1.139:8080/v1/api/carpetas';
  //private carpetaApi: string = 'http://192.168.1.10:8080/v1/api/carpetas';

  constructor(private http: HttpClient, private header:HeaderService) { }

  postCarpeta(carpeta: CarpetaRequest): Observable<CarpetaResponse> {
    return this.http.post<CarpetaResponse>(`${this.carpetaApi}/registrar`, carpeta, {headers: this.header.getHeader()});
  }

  getCarpetas(idUsuario: number): Observable<CarpetaResponse[]> {
    return this.http.get<CarpetaResponse[]>(`${this.carpetaApi}/buscar/${idUsuario}`, {headers: this.header.getHeader()});
  }

  getCarpeta(idUsuario: number): Observable<CarpetaResponse> {
    return this.http.get<CarpetaResponse>(`${this.carpetaApi}/buscar/carpeta/${idUsuario}`, {headers: this.header.getHeader()});
  }

  getCarpetaPorUsuarioFechaYEstado(idUsuario: number, firstDate?: Date, lastDate?: Date): Observable<CarpetaResponse[]> {
    let params = new HttpParams().set('idUsuario', idUsuario)
                                  .set('firstDate', firstDate!.toString())
                                  .set('lastDate', lastDate!.toString());
    return this.http.get<CarpetaResponse[]>(`${this.carpetaApi}/buscar/carpeta/fecha/estados`, { params, headers: this.header.getHeader() });
  }

}
