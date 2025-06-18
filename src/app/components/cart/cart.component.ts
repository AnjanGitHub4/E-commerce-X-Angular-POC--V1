import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ButtonModule, RatingModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  value: number = 4;
  // primeng icon color customization
  iconColor = {
    iconColor: '#ffbf5c',
    iconHoverColor: '#ffbf5c',
    iconActiveColor: '#ffbf5c',
  };
  //  product services
  productService: ProductService = inject(ProductService);
  // inject router
  router: Router = inject(Router);
  // get cart product details
  cartArr: any[] = [];

  ngOnInit() {
    this.getCartProducts();
  }

  //  get products from the cart
  getCartProducts(): void {
    const cartData = this.productService.getCart() || [];
    this.cartArr = cartData;
  }

  removeCartProduct(orderIdx: number, productIdx: number): void {
    const cart = this.productService.getCart() || [];
    // Remove product by index
    if (cart[orderIdx]) {
      cart[orderIdx].products.splice(productIdx, 1);

      // Remove the order if no products remain
      if (cart[orderIdx].products.length === 0) {
        cart.splice(orderIdx, 1);
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    this.getCartProducts(); // Refresh UI
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
