import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]
})
export class LoginComponent {
  loginUserInfo: User[] = [];
  user: { username: string, password: string } = { username: '', password: '' }
  errorMsg!: string;
  isError:boolean = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }
  
  ngOnInit(){
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/home'])
    }
  }

  login(userInfo: any) {
    this.authService.login(userInfo).subscribe({
      next: (user) => {
        // console.log(JSON.stringify(user))
        this.loginUserInfo = [user];
        // save user data and redirect to the home page
        this.authService.saveOnUserData(user);
        this.router.navigateByUrl('/home')
      },
      error: (error) => {
        // console.log("error ---> ",error.message)
        this.errorMsg = error?.message;
        this.isError = true;
      }
    });
  }


  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    // console.log("User Form: ", JSON.stringify(this.user));
    this.login(JSON.stringify(this.user));
    this.isError = false;
  }

}
