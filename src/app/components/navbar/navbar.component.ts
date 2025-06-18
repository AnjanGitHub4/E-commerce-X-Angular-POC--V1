import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/products.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() username!: string;
  @Input() userImg!: string;
  isLoggedIn!: boolean;
  cartCount: number = 0;

  // inject product service
  productService: ProductService = inject(ProductService);

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit(): void {
    console.log(this.userImg)
    this.cartCount = this.productService.getCartCount();
    this.isLoggedIn = this.authService.isLoggedIn()
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/');
  }
}
