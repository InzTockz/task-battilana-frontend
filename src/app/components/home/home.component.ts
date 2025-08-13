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
import { Estados } from '../../models/tareas/estados';
import Swal from 'sweetalert2';

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
  tareasFiltradas!: TareaResponse[];
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

  constructor(private tareasService: TareasService, private usuariosService: UsuariosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.listarTareas();
    // this.listarContadorPendiente();
    // this.listarContadorTerminado();
    // this.listarContadorTotales();
    this.listarContadorPendientePorUsuario();
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorTotalPorUsuario();
    this.usuariosService.getUsuarios().subscribe(response => this.usuarios = response);
    this.showTaskLogin = localStorage.getItem("idUsuario") != null ? localStorage.getItem("idUsuario") : "0";
  }

  userChange(user: Event): void {
    const idUsuario = user.target as HTMLInputElement;
    localStorage.setItem("idUsuario", idUsuario.value);
    this.listarTareas();
    this.listarContadorPendientePorUsuario();
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorTotalPorUsuario();
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

  listarTerminado(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getTerminadoPorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "terminado"
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  listarTotal(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getTotalPorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response
        this.tareaEstado = "tarea"
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

  // listarTerminado(): void {
  //   this.tareasService.getTerminado().subscribe(
  //     response => {
  //       this.tareas = response
  //       this.tareaEstado = "terminado"
  //       this.tareasFiltradas = this.tareas;
  //     }
  //   )
  // }

  // listarPendientes(): void {
  //   this.tareasService.getPendiente().subscribe(
  //     response => {
  //       this.tareas = response;
  //       this.tareaEstado = "pendiente"
  //       this.tareasFiltradas = this.tareas;
  //     }
  //   )
  // }

  // listarTotal(): void {
  //   this.tareasService.getTareas().subscribe(
  //     response => {
  //       this.tareas = response
  //       this.tareaEstado = "tarea"
  //       this.tareasFiltradas = this.tareas;
  //     }
  //   )
  // }

  listarTareas(): void {
    const idUsuario = localStorage.getItem("idUsuario");
    this.tareasService.getPendientePorUsuario(Number(idUsuario)).subscribe(
      response => {
        this.tareas = response;
        this.tareaEstado = "pendiente";
        this.tareasFiltradas = this.tareas;
      }
    )
  }

  // listarContadorPendiente(): void {
  //   this.tareasService.getContadorPendiente().subscribe(response => this.contadorPendiente = response);
  // }

  // listarContadorTerminado(): void {
  //   this.tareasService.getContadorTerminado().subscribe(response => this.contadorTerminado = response);
  // }

  // listarContadorTotales(): void {
  //   this.tareasService.getContadorTotales().subscribe(response => this.contadorTotales = response);
  // }

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
    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.listarTareas()
        // this.listarContadorPendiente();
        // this.listarContadorTerminado();
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
