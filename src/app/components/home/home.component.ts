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
  usuarios: UsuariosResponse[] = [];
  contadorPendiente!: number;
  contadorTerminado!: number;
  tarea: TareaRequest = new TareaRequest;
  fechaInicio: string = "";
  fechaFin: string = "";

  constructor(private tareasService: TareasService, private usuariosService: UsuariosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.listarTareas();
    this.listarContadorPendiente();
    this.listarContadorTerminado();
    this.usuariosService.getUsuarios().subscribe(response => this.usuarios = response);
  }

  listarTareas(): void {
    this.tareasService.getTareas().subscribe(response => this.tareas = response)
  }

  listarContadorPendiente(): void {
    this.tareasService.getContadorPendiente().subscribe(response => this.contadorPendiente = response);
  }

  listarContadorTerminado(): void {
    this.tareasService.getContadorTerminado().subscribe(response => this.contadorTerminado = response);
  }

  registrarTarea(): void {
    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.listarTareas()
        this.listarContadorPendiente();
        this.listarContadorTerminado();
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
            this.listarContadorPendiente();
            this.listarContadorTerminado();
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
            this.listarContadorPendiente();
            this.listarContadorTerminado();
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
