import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login/login-request';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login/login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //private loginApi:string = "http://192.168.1.10:8080/v1/api/usuario";
  private loginApi:string = "http://192.168.1.139:8080/v1/api/usuario";

  constructor(private http:HttpClient) { }

  postLogin(login:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.loginApi}/login`, login)
  }

  setToken(key:string, value:any){
    localStorage.setItem(key, JSON.stringify(value))
  }

  getToken(key:string){
    const token = localStorage.getItem(key);

    if(token!=null){
      return JSON.parse(token);
    } else {
      return null;
    }
  }

  logout():void{
    localStorage.clear();
  }

  isTokenExpired():boolean{
    const token = this.getToken("userToken")
    if(!token){
      return true;
    }

    const payload = JSON.parse(atob(token.token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
}
