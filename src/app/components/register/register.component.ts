import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuariosRequest } from '../../models/usuarios/usuarios-request';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  usuarioRequest: UsuariosRequest = new UsuariosRequest();

  constructor(private usuarioService: UsuariosService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {

  }

  postRegistro(): void {
    this.usuarioService.postUsuarios(this.usuarioRequest).subscribe(
      response => {

        if (response.registerStatus != 'user_registered') {
          this.router.navigate(['/login'])
          this.toastr.success('Tu registro ha sido completo, puedes iniciar sesión', 'Registrado')
        } else {
          this.router.navigate(['/register'])
          this.toastr.warning('El usuario se encuentra registrado', 'Mensaje informativo')
        }
      }
    )
  }
}
