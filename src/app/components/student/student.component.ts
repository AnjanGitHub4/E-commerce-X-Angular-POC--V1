import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {
  // gets data from parent
  @Input() users!: any;
  // send data to parent 
  @Output() studentSelected = new EventEmitter<number>();

  constructor(){
    
  }
  
  // get selected user -> id
  viewStudentData(sid:number){
    this.studentSelected.emit(sid);
  }
  
}
