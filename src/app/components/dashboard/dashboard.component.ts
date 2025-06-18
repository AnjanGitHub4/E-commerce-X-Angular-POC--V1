import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { ProductsComponent } from "../products/products.component";

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, ProductsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  username!: string;
  userImg!: string;
  constructor(private authService: AuthService) {}

  getUser() {
    const authUser = this.authService.getAuthUser();
    if (authUser) {
      this.username = authUser.username;
      this.userImg = authUser.image;
    }
  }

  ngOnInit() {
    this.getUser();
  }
}
