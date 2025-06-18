import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CombineService } from '../../services/combine/combine.service';
import { CommonModule } from '@angular/common';
import { StudentComponent } from "../student/student.component";


@Component({
  selector: 'app-home',
  imports: [NavbarComponent, CommonModule, StudentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username!: string;
  userImg!: string;
  closeInfo!: boolean;
  // users data
  users: any = [];
  filterUser: any = []
  studentSelected: number = -1;

  constructor(private authService: AuthService, private combineService: CombineService) { }

  getStudCustData() {
    this.combineService.getStudCust().subscribe({
      next: (users) => { 
        // console.log(users)
        this.users = users
      },
      error: (error) => console.log('student error', error?.message)
    });
  }


  handleStudentSelection(sid: number) {
    // console.log('Selected Student ID:', sid);
    this.studentSelected = sid;
    this.filterStudents()
    this.closeInfo = false;
  }

  filterStudents(): void {
    if (this.studentSelected !== -1) {
      // console.log(this.studentSelected)
      this.filterUser = this.users.filter((s: any) => s.id === this.studentSelected);
    }
  }

  closeDetails(): void {
    this.closeInfo = true;
    console.log('closeDetails called', this.closeInfo);
  }

  ngOnInit(): void {
    const authUser = this.authService.getAuthUser();
    if (authUser) {
      this.username = authUser.username;
      this.userImg = authUser.image;
    }
    this.getStudCustData()
  }





}
