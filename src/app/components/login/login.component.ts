import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { UsuariosRequest } from '../../models/usuarios/usuarios-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { LoginRequest } from '../../models/login/login-request';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginRequest:LoginRequest = new LoginRequest();

  constructor(private loginService:LoginService, private route:Router, private toastr:ToastrService){}

  ngOnInit(): void {
    
  }

  onLogin(){
    this.loginService.postLogin(this.loginRequest).subscribe(
      response => {
        if(response.statusResponse == 'success'){
          this.loginService.setToken('userToken', response);
          this.route.navigate(['/']);
          this.toastr.success('', 'Bienvenido');
        } else if(response.statusResponse == 'invalid_credentials'){
          this.toastr.error('Credenciales incorrectas', 'Acceso denegado');
          this.loginRequest.password = '';
        }
      }
    )
  }


}
