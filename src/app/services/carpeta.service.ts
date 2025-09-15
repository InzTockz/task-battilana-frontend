import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarpetaRequest } from '../models/carpetas/carpeta-request';
import { CarpetaResponse } from '../models/carpetas/carpeta-response';

@Injectable({
  providedIn: 'root'
})
export class CarpetaService {

  private carpetaApi:string = 'http://localhost:8080/v1/api/carpetas';

  constructor(private http:HttpClient) { }

  postCarpeta(carpeta:CarpetaRequest):Observable<CarpetaResponse>{
    return this.http.post<CarpetaResponse>(`${this.carpetaApi}/registrar`, carpeta);
  }

  getCarpetas(idUsuario:number):Observable<CarpetaResponse[]>{
    return this.http.get<CarpetaResponse[]>(`${this.carpetaApi}/buscar/${idUsuario}`);
  }
}
