import { Component, OnInit } from '@angular/core';
import { UsuariosResponse } from '../../../models/usuarios/usuarios-response';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Roles } from '../../../models/roles';
import { UsuariosRequest } from '../../../models/usuarios/usuarios-request';

@Component({
  selector: 'app-register-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent implements OnInit{
[x: string]: any;

  usuarioResponse!: UsuariosResponse[];
  usuarioRequest:UsuariosRequest = new UsuariosRequest();
  roles = Object.values(Roles);

  constructor(private usuariosService:UsuariosService){}

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(){
    this.usuariosService.getUsuarios().subscribe(
      response => this.usuarioResponse = response
    )
  }

  onSelectChange(event:any){
    const eventValue = event.target.value
    console.log(eventValue)
  }

  onUserRegister(){
    
    this.usuariosService.postUsuarios(this.usuarioRequest).subscribe(
      () => console.log("Usuario registrado")
    )
  }
}
