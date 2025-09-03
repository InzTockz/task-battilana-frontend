import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, FileIcon, PanelLeft, Plus, Clock, ChartColumn, Search, CircleCheck, Check, Trash2 } from 'lucide-angular';
import { TareaResponse } from '../../models/tareas/tarea-response';
import { UsuariosResponse } from '../../models/usuarios/usuarios-response';
import { TareaRequest } from '../../models/tareas/tarea-request';
import { TareasService } from '../../services/tareas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent implements OnInit {

  readonly icons = {
    fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
    stadistic: ChartColumn, search: Search, trash: Trash2
  }

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

  constructor(private tareasService: TareasService, private usuariosService: UsuariosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    
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

  trueDesign(estadoBol: string): boolean {
    if (estadoBol === 'TERMINADO') {
      return true;
    } else {
      return false;
    }
  }

}
