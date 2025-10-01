import { Component, ElementRef, ViewChild } from '@angular/core';
import { TareaRequest } from '../../../models/tareas/tarea-request';
import Swal from 'sweetalert2';
import { TareasService } from '../../../services/tareas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { ChartColumn, CircleCheck, Clock, FileIcon, PanelLeft, Plus, Search, Trash2, LucideAngularModule } from 'lucide-angular';
import { TareaResponse } from '../../../models/tareas/tarea-response';
import { UsuariosResponse } from '../../../models/usuarios/usuarios-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-user',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './task-user.component.html',
  styleUrl: './task-user.component.css'
})
export class TaskUserComponent {


  readonly icons = {
    fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
    stadistic: ChartColumn, search: Search, trash: Trash2
  }

  tareas: TareaResponse[] = [];
  tareasFiltradas: TareaResponse[] = [];
  busquedaInput: string = "";
  tareaEstado: string = "";
  usuarios: UsuariosResponse[] = [];
  contadorPendiente!: number;
  contadorTerminado!: number;
  contadorTotales!: number;
  tarea: TareaRequest = new TareaRequest;
  fechaInicio: string = "";
  fechaFin: string = "";

  showTaskLogin: any = "0";
  idUsuarioSession: string = localStorage.getItem("idUsuario")!;

  @ViewChild('modalRegistro') modalRegistro!: ElementRef<HTMLDialogElement>;

  constructor(private tareasService: TareasService, private usuariosService: UsuariosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.listarPendientePorUsuario()
    this.listarContadorPendientePorUsuario();
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorTotalPorUsuario();
    this.showTaskLogin = this.idUsuarioSession != null ? this.idUsuarioSession : 0;
    this.usuariosService.getUsuarios().subscribe(response => this.usuarios = response);
  }

  onUserSessionExists(): boolean {
    return this.idUsuarioSession != null ? true : false;
  }

  userChange(user: Event): void {
    const idUsuario = user.target as HTMLInputElement;
    localStorage.setItem("idUsuario", idUsuario.value);
    this.listarContadorPendientePorUsuario();
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorTotalPorUsuario();
    this.listarPendientePorUsuario()
  }

  buscarTarea(): void {
    const termino = this.busquedaInput.toLowerCase();
    this.tareasFiltradas = this.tareas.filter(
      response => response.nombreTarea.toLowerCase().includes(termino)
    )
  }

  listarPendientePorUsuario(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getPendientePorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response;
        this.tareaEstado = "pendiente";
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  listarTerminadoPorUsuario(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getTerminadoPorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "terminado"
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  listarTotalPorUsuario(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getTotalPorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "tarea"
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  listarContadorPendientePorUsuario(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getContadorPendientePorUsuario(Number(idUsuario)).subscribe(
      pendiente => this.contadorPendiente = pendiente
    )
  }
  listarContadorCompletadoPorUsuario(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getContadorCompletadoPorUsuario(Number(idUsuario)).subscribe(
      completado => this.contadorTerminado = completado
    )
  }

  listarContadorTotalPorUsuario(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getContadorTotalPorUsuario(Number(idUsuario)).subscribe(
      total => this.contadorTotales = total
    )
  }

  registrarTarea(): void {

    const idUsuario = localStorage.getItem("idUsuario");

    this.tarea.idUsuariosEntity = Number(idUsuario);
    this.tarea.idCarpeta = undefined;

    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.listarContadorPendientePorUsuario();
        this.listarContadorCompletadoPorUsuario();
        this.listarContadorTotalPorUsuario();
        this.modalRegistro.nativeElement.close();
        this.tarea = new TareaRequest();
        this.toastr.success('Tarea registrada');
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
            this.listarContadorPendientePorUsuario();
            this.listarContadorCompletadoPorUsuario();
            this.listarTotalPorUsuario();
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
            this.listarContadorPendientePorUsuario();
            this.listarContadorCompletadoPorUsuario();
            this.listarTotalPorUsuario();
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

  trueDesign(estadoBol: string): boolean {
    if (estadoBol === 'TERMINADO') {
      return true;
    } else {
      return false;
    }
  }

  closeModal() {
    this.modalRegistro.nativeElement.close();
    this.tarea = new TareaRequest();
  }
}
