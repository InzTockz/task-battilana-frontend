import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private login:LoginService) { }

  getHeader(){
    const token = this.login.getToken('userToken').token;

    return new HttpHeaders({
      'Authorization': `${token}`
    })
  }
}
