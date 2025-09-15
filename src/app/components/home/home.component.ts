import { Component, OnInit } from '@angular/core';
import { TareasService } from '../../services/tareas.service';
import { LoginService } from '../../services/login.service';
import { LucideAngularModule, FileIcon, PanelLeft, Plus, Clock, ChartColumn, Search, CircleCheck, Check, Trash2 } from 'lucide-angular';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TareaRequest } from '../../models/tareas/tarea-request';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarpetaService } from '../../services/carpeta.service';
import { CarpetaRequest } from '../../models/carpetas/carpeta-request';
import { CarpetaResponse } from '../../models/carpetas/carpeta-response';


@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  readonly icons = {
      fileIcon: FileIcon, panelLeft: PanelLeft, plus: Plus, clock: Clock, circleCheck: CircleCheck,
      stadistic: ChartColumn, search: Search, trash: Trash2
    }

  contadorPendiente!: number;
  contadorTerminado!: number;
  contadorTotales!: number;
  tarea:TareaRequest = new TareaRequest();

  //SECCION DE LA CARPETA
  carpetaRequest:CarpetaRequest = new CarpetaRequest();
  carpetaResponse:CarpetaResponse[] = [];

  constructor(private tareasService: TareasService, private loginService: LoginService, private carpetaService:CarpetaService) { }

  ngOnInit(): void {
    this.listarContadorCompletadoPorUsuario();
    this.listarContadorPendientePorUsuario();
    this.listarContadorTotalPorUsuario();

    //SECCION CARPETAS
    this.getCarpetasId();

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

  getCarpetasId(){
    const idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.carpetaService.getCarpetas(idUsuario).subscribe(
      response => this.carpetaResponse = response
    )
  }

  addTask():void{
    this.carpetaRequest.idUsuario = this.loginService.getToken('userToken').idUsuarios;
    this.carpetaService.postCarpeta(this.carpetaRequest).subscribe(
      () => {
        console.log("Carpeta registrada")
        this.getCarpetasId();
        this.listarContadorPendientePorUsuario();
        this.listarContadorCompletadoPorUsuario();
        this.listarContadorTotalPorUsuario();
      }
    )
  }

  closeModal():void{

  }
}
