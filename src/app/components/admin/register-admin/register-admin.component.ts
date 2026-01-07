import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuariosResponse } from '../../../models/usuarios/usuarios-response';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Roles } from '../../../models/roles';
import { UsuariosRequest } from '../../../models/usuarios/usuarios-request';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LucideAngularModule } from 'lucide-angular';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-admin',
  imports: [CommonModule, FormsModule, LucideAngularModule, FaIconComponent],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent implements OnInit {
  [x: string]: any;

  readonly faPenToSquare: any = faPenToSquare
  readonly faTrash: any = faTrash

  usuariosResponse!: UsuariosResponse[];
  usuarioResponse: UsuariosRequest = new UsuariosRequest;
  idUsuario?:number;
  usuarioRequest: UsuariosRequest = new UsuariosRequest();
  roles = Object.values(Roles);
  checkPassword: boolean = false;

  usuariosPagination: UsuariosResponse[] = [];
  page = 1;
  pageSize = 8;
  totalPages = 0;

  @ViewChild('modalRegistro') modalRegistro!: ElementRef<HTMLDialogElement>;

  constructor(private usuariosService: UsuariosService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.usuariosService.getUsuarios().subscribe({
      next: data => {
        this.usuariosResponse = data;
        this.totalPages = Math.max(1, Math.ceil(this.usuariosResponse.length / this.pageSize));
        // this.page = 1;
        this.updatePage()
      }
    })
  }

  enablePassword(){
    this.checkPassword = !this.checkPassword
  }

  updatePage(): void{
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.usuariosPagination = this.usuariosResponse.slice(start, end);
  }

  prev(): void {
    if (this.page > 1){
      this.page--;
      this.updatePage();
    }
  }

  next():void{
    if(this.page < this.totalPages){
      this.page++;
      this.updatePage();
    }
  }

  goTo(p: number):void {
    if(p >= 1 && p <= this.totalPages){
      this.page = p;
      this.updatePage();
    }
  }

  get pages():number[]{
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  onSelectChange(event: any) {
    const eventValue = event.target.value
    console.log(eventValue)
  }

  onUserRegister() {
    this.usuariosService.postUsuarios(this.usuarioRequest).subscribe(
      () => {
        this.getUserList()
        this.usuarioRequest = new UsuariosRequest()
        this.toastr.success('Nuevo usuario registrado', '')
      }
    )
  }

  onUserFind(idUsuario:number){
    this.idUsuario = idUsuario;
    return this.usuariosService.getUsuarioId(idUsuario).subscribe(
      data => {
        this.usuarioResponse = data;
      }
    )
  }

  onUserUpdate(){
    if(this.usuarioResponse.password == null){
      this.usuarioResponse.password = ""
    }
    this.usuariosService.putUsuarios(this.idUsuario!, this.usuarioResponse).subscribe(
      () => {
        console.log("Usuario actualzado");
        this.getUserList();
        this.closeModal();
      }
    )
  }

  onUserDelete(idUsuario:number){
    this.usuariosService.deleteUsuarios(idUsuario).subscribe(
      () => {
        this.getUserList();
        this.toastr.success('Usuario eliminado', '');
      }
    )
  }

  limpiarFormulario(){
    this.usuarioRequest = new UsuariosRequest;
    
  }

  closeModal(){
    this.modalRegistro.nativeElement.close();
    this.usuarioRequest = new UsuariosRequest();
    this.checkPassword = false;
  }
}
