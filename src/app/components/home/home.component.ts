import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LucideAngularModule, FileIcon, PanelLeft, Plus, Clock, ChartColumn, Search, CircleCheck, Check, Trash2 } from 'lucide-angular';
import { TareaResponse } from '../../models/tareas/tarea-response';
import { UsuariosResponse } from '../../models/usuarios/usuarios-response';
import { TareaRequest } from '../../models/tareas/tarea-request';
import { CommonModule } from '@angular/common';
import { TareasService } from '../../services/tareas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms'
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  readonly icons = {
    fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
    stadistic: ChartColumn, search: Search, trash: Trash2
  }

  @ViewChild('modalRegistro') modalRegistro!: ElementRef<HTMLDialogElement>;

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

  constructor(private tareasService: TareasService, private usuariosService: UsuariosService, private toastr: ToastrService,
    private loginService:LoginService
  ) { }

  ngOnInit(): void {
    this.listarTareas();
    this.listarContadorPendientePorUsuario();
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorTotalPorUsuario();
  }

  listarPendientePorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getPendientePorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response;
        this.tareaEstado = "pendiente";
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  listarTerminado(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getTerminadoPorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "terminado"
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  listarTotal(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getTotalPorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "tarea"
        this.tareasFiltradas = this.tareas;
      }
    )
  }

    listarTareas(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getPendientePorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response;
        this.tareaEstado = "pendiente";
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  buscarTarea(): void {
    const termino = this.busquedaInput.toLowerCase();
    this.tareasFiltradas = this.tareas.filter(
      response => response.nombreTarea.toLowerCase().includes(termino)
    )
  }


  listarContadorPendientePorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getContadorPendientePorUsuario(Number(idUsuario)).subscribe(
      pendiente => this.contadorPendiente = pendiente
    )
  }

  listarContadorCompletadoPorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getContadorCompletadoPorUsuario(Number(idUsuario)).subscribe(
      completado => this.contadorTerminado = completado
    )
  }

  listarContadorTotalPorUsuario(): void {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getContadorTotalPorUsuario(Number(idUsuario)).subscribe(
      total => this.contadorTotales = total
    )
  }

  registrarTarea(): void {

    const idUsuario = this.loginService.getToken('userToken').idUsuarios;

    this.tarea.idUsuariosEntity = idUsuario;

    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.listarTareas()
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
            this.listarTareas()
            this.listarContadorPendientePorUsuario();
            this.listarContadorCompletadoPorUsuario();
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
            this.listarTareas();
            this.listarContadorPendientePorUsuario();
            this.listarContadorCompletadoPorUsuario();
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

  closeModal() {
    this.modalRegistro.nativeElement.close();
    this.tarea = new TareaRequest();
  }

  trueDesign(estadoBol: string): boolean {
    if (estadoBol === 'TERMINADO') {
      return true;
    } else {
      return false;
    }
  }

}
