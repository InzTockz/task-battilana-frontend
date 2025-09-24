import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LucideAngularModule, FileIcon, PanelLeft, Plus, Clock, ChartColumn, Search, CircleCheck, Check, Trash2, MessageSquareWarning } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LoginService } from '../../../services/login.service';
import { TareasService } from '../../../services/tareas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { TareaResponse } from '../../../models/tareas/tarea-response';
import { UsuariosResponse } from '../../../models/usuarios/usuarios-response';
import { TareaRequest } from '../../../models/tareas/tarea-request';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CarpetaResponse } from '../../../models/carpetas/carpeta-response';
import { CarpetaService } from '../../../services/carpeta.service';
import { Estados } from '../../../models/tareas/estados';



@Component({
  selector: 'app-task',
  imports: [LucideAngularModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  readonly icons = {
    fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
    stadistic: ChartColumn, search: Search, trash: Trash2, messageWarning: MessageSquareWarning
  }

  @ViewChild('modalRegistro') modalRegistro!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalCompletarTarea') modalComentarioYEstado!: ElementRef<HTMLDialogElement>;

  tareas: TareaResponse[] = [];
  tareasFiltradas: TareaResponse[] = [];
  tareaResponse: TareaResponse = new TareaResponse();
  busquedaInput: string = "";
  tareaEstado: string = "";
  usuarios: UsuariosResponse[] = [];
  contadorPendiente!: number;
  contadorTerminado!: number;
  contadorTotales!: number;
  comentario!: string;

  tarea: TareaRequest = new TareaRequest;

  fechaInicio: string = "";
  fechaFin: string = "";

  showTaskLogin: any = "0";
  carpeta: CarpetaResponse = new CarpetaResponse();

  constructor(private tareasService: TareasService, private usuariosService: UsuariosService, private toastr: ToastrService,
    private loginService: LoginService, private carpetaService: CarpetaService
  ) { }

  ngOnInit(): void {
    this.listarPendientes();
    this.contadorPorCarpetaPendiente();
    this.contadorPorCarpetaTerminado();
    this.contadorPorCarpetaTotal();
    this.buscarCarpeta();
  }

  buscarCarpeta() {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.carpetaService.getCarpeta(Number(idCarpeta)).subscribe(
      response => this.carpeta = response
    )
  }

  buscarTarea(): void {
    const termino = this.busquedaInput.toLowerCase();
    this.tareasFiltradas = this.tareas.filter(
      response => response.nombreTarea.toLowerCase().includes(termino)
    )
  }

  //SECCION DE LISTADO//
  listarPendientes(): void {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.tareasService.getListadoTareasPorCarpetaYEstado(Number(idCarpeta), Estados.PENDIENTE).subscribe(
      response => {
        this.tareas = response;
        this.tareaEstado = "pendiente";
        this.tareasFiltradas = this.tareas;
      }
    )
  }
  listarTerminado(): void {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.tareasService.getListadoTareasPorCarpetaYEstado(Number(idCarpeta), Estados.TERMINADO).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "terminado"
        this.tareasFiltradas = this.tareas;
      }
    )
  }
  listarTotal(): void {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.tareasService.getListadoTareasPorCarpetaYEstado(Number(idCarpeta)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "tarea"
        this.tareasFiltradas = this.tareas;
      }
    )
  }
  /////////////////////

  //SECCION DE CONTADORES
  contadorPorCarpetaPendiente(): void {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.tareasService.getContadorPorCarpetaYEstado(Number(idCarpeta), Estados.PENDIENTE).subscribe(
      pendiente => this.contadorPendiente = pendiente
    )
  }

  contadorPorCarpetaTerminado(): void {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.tareasService.getContadorPorCarpetaYEstado(Number(idCarpeta), Estados.TERMINADO).subscribe(
      completado => this.contadorTerminado = completado
    )
  }

  contadorPorCarpetaTotal(): void {
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();
    this.tareasService.getContadorPorCarpetaYEstado(Number(idCarpeta)).subscribe(
      total => this.contadorTotales = total
    )
  }
  //////////////////////////

  //SECCION DE CRUD
  registrarTarea(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    const idCarpeta = localStorage.getItem('idCarpeta')?.toString();

    this.tarea.idUsuariosEntity = idUsuario;
    this.tarea.idCarpeta = Number(idCarpeta);

    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.listarPendientes();
        this.contadorPorCarpetaPendiente();
        this.contadorPorCarpetaTerminado();
        this.contadorPorCarpetaTotal();
        this.modalRegistro.nativeElement.close();
        this.tarea = new TareaRequest();
        this.toastr.success('Tarea registrada');
      }
    )
  }

  actualizarEstadoYComentario(): void {
    //console.log(this.tareaResponse.idTarea)
    this.tareasService.updateStatusAndComment(this.tareaResponse.idTarea, this.tareaResponse.comentario).subscribe(
      () => {
        this.listarPendientes();
        this.contadorPorCarpetaPendiente();
        this.contadorPorCarpetaTerminado();
        this.contadorPorCarpetaTotal();
        this.closeModalComentario();
        Swal.fire({
          title: 'TAREA COMPLETADA',
          icon: 'success'
        });
      }
    )
  }

  getTareaPorId(idTarea: number): void {
    this.tareasService.getTareaPorId(idTarea).subscribe(
      response => {
        this.tareaResponse = response
      }
    )
  }

  actualizarEstado(idTarea: number): void {
    Swal.fire({
      title: "Desea marcar como culminada?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si.",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareasService.updateStatus(idTarea).subscribe(
          () => {
            this.toastr.success('Tarea actualizada');
            this.listarPendientes()
            this.contadorPorCarpetaPendiente();
            this.contadorPorCarpetaTerminado();
          }
        )
      }
    });
  }

  eliminarTarea(idTarea: number): void {
    Swal.fire({
      title: "Estas seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, estoy seguro.",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tareasService.deleteTarea(idTarea).subscribe(
          () => {
            this.listarPendientes();
            this.contadorPorCarpetaPendiente();
            this.contadorPorCarpetaTerminado();
            Swal.fire({
              title: "Eliminado!",
              text: "La tarea ha sido eliminada.",
              icon: "success"
            });
          }
        );
      }
    });
  }
  ///////////////////

  closeModal() {
    this.modalRegistro.nativeElement.close();
    this.tarea = new TareaRequest();
  }

  closeModalComentario() {
    this.modalComentarioYEstado.nativeElement.close();
    this.comentario = "";
  }

  trueDesign(estadoBol: string): boolean {
    if (estadoBol === 'TERMINADO') {
      return true;
    } else {
      return false;
    }
  }
}
