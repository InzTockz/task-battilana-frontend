import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TareasService } from '../../services/tareas.service';
import { LoginService } from '../../services/login.service';
import { LucideAngularModule, FileIcon, PanelLeft, Plus, Clock, ChartColumn, Search, CircleCheck, Check, Trash2, HomeIcon, Bell, X } from 'lucide-angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TareaRequest } from '../../models/tareas/tarea-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarpetaService } from '../../services/carpeta.service';
import { CarpetaRequest } from '../../models/carpetas/carpeta-request';
import { CarpetaResponse } from '../../models/carpetas/carpeta-response';
import { ToastrService } from 'ngx-toastr';
import { Estados } from '../../models/tareas/estados';
import { TareaResponse } from '../../models/tareas/tarea-response';


@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  readonly icons = {
    fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
    stadistic: ChartColumn, search: Search, trash: Trash2, home: HomeIcon, bell: Bell, close: X
  }

  contadorPendiente!: number;
  contadorTerminado!: number;
  contadorTotales!: number;
  tarea: TareaRequest = new TareaRequest();
  tareaSinCarpeta: TareaResponse[] = [];
  fechaInicio?: Date;
  fechaFin?: Date;
  // idCarpeta: number = -1;

  selected: { [idTarea:number]: number} = {};

  @ViewChild('modalTarea') modalRegistro!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalCarpeta') modalCarpetaDialog!: ElementRef<HTMLDialogElement>;

  //SECCION DE LA CARPETA
  carpetaRequest: CarpetaRequest = new CarpetaRequest();
  carpetaResponse: CarpetaResponse[] = [];
  contadorTareaPorCarpetaPendiente = new Map<number, number>();

  constructor(private tareasService: TareasService, private loginService: LoginService, private carpetaService: CarpetaService,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorPendientePorUsuario();
    this.listarContadorTotalPorUsuario();
    this.listadoTareasSinCarpeta();

    //SECCION CARPETAS
    this.getCarpetasId();

  }

  listadoTareasSinCarpeta() {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.getTareasPorUsuarioSinCarpeta(idUsuario).subscribe(
      response => {
        this.tareaSinCarpeta = response
      }
    )
  }

  agregarCarpetaDeTareas(idTarea: number, idCarpeta?:number) {
    const elegido = idCarpeta ?? this.selected[idTarea];
    if(elegido == null || elegido < 0 ) return;
    this.tareasService.postTareaPorCarpeta(idTarea, elegido).subscribe(
      () => {
        this.listadoTareasSinCarpeta();
      }
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

  getCarpetasId() {
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.carpetaService.getCarpetas(idUsuario).subscribe(
      response => {
        this.carpetaResponse = response;

        this.carpetaResponse.forEach(c => {
          this.tareasService.getContadorPorCarpetaYEstado(c.idCarpeta, Estados.PENDIENTE).subscribe(
            pendiente => {
              this.contadorTareaPorCarpetaPendiente.set(c.idCarpeta, pendiente)
            }
          )
        })

      }
    )
  }

  filtradoPorFechas() {
    console.log(this.fechaInicio)
    console.log(this.fechaFin)
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;

    if (this.fechaInicio != null && String(this.fechaInicio) != null && this.fechaFin != null && String(this.fechaFin) != '') {
      this.carpetaService.getCarpetaPorUsuarioFechaYEstado(idUsuario, this.fechaInicio, this.fechaFin).subscribe(
        response => this.carpetaResponse = response
      )
    } else {
      this.getCarpetasId();
    }
  }

  addTarea() {
    this.tarea.idUsuariosEntity = this.loginService.getToken('userToken').idUsuarios;
    this.tareasService.postTareas(this.tarea).subscribe(
      () => {
        this.getCarpetasId();
        this.listarContadorPendientePorUsuario();
        this.listarContadorCompletadoPorUsuario();
        this.listarContadorTotalPorUsuario();
        this.closeModalTarea();
        this.toastService.success('Tarea agregada', '')
      }
    )
  }

  addCarpeta(): void {
    this.carpetaRequest.idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.carpetaService.postCarpeta(this.carpetaRequest).subscribe(
      () => {
        this.getCarpetasId();
        this.listarContadorPendientePorUsuario();
        this.listarContadorCompletadoPorUsuario();
        this.listarContadorTotalPorUsuario();
        this.closeModalCarpeta();
        this.toastService.success('Carpeta agregada', '')
      }
    )
  }

  setIdCarpeta(idCarpeta: number) {
    localStorage.setItem('idCarpeta', String(idCarpeta));
  }

  closeModalTarea(): void {
    this.modalRegistro.nativeElement.close();
    this.tarea = new TareaRequest();
  }

  closeModalCarpeta(): void {
    this.modalCarpetaDialog.nativeElement.close();
    this.carpetaRequest = new CarpetaRequest();
  }
}
