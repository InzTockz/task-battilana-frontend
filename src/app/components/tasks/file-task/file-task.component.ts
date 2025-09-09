import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export class Test{
  icon!:string;
  nombre!:string;
  modificado!:string;
  cantidad!:number;
}

@Component({
  selector: 'app-file-task',
  imports: [FormsModule, CommonModule],
  templateUrl: './file-task.component.html',
  styleUrl: './file-task.component.css'
})
export class FileTaskComponent {

  files:Test[] = [
    {icon: 'ic_carpeta.png', nombre: 'Router Entel', modificado: Date().toString(), cantidad: 20},
    {icon: 'ic_carpeta.png', nombre: 'Tesis', modificado: Date().toString(), cantidad: 1},
    {icon: 'ic_carpeta.png', nombre: 'Formularios de battilana', modificado: Date().toString(), cantidad: 5},
    {icon: 'ic_carpeta.png', nombre: 'Programacion java', modificado: Date().toString(), cantidad: 15},
    {icon: 'ic_carpeta.png', nombre: 'Formularios de battilana', modificado: Date().toString(), cantidad: 5},
    {icon: 'ic_carpeta.png', nombre: 'Programacion java', modificado: Date().toString(), cantidad: 15}
  ]
}
