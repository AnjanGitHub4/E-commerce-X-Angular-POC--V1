import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/products.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    ButtonModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  // rating value
  value: number = 4;
  // product services
  productService: ProductService = inject(ProductService);
  // auth services
  authService: AuthService = inject(AuthService);
  // inject router
  router: Router = inject(Router);
  alert: boolean = false;

  // current products list
  products: any[] = [];
  // search term
  searchProd: string = '';

  // primeng icon color customization
  iconColor = {
    iconColor: '#ffbf5c',
    iconHoverColor: '#ffbf5c',
    iconActiveColor: '#ffbf5c',
  };
  primaryBackground = {
    primaryBackground: '#6366f1',
    primaryHoverBackground: '#3730a3',
  };
  successBackground = {
    successBackground: '#14b8a6',
    successHoverBackground: '#075985',
  };

  // addToCart product objcet array
  cart: { id: number; quantity: number }[] = [];
  userId!: number;
  timerId!: any;

  ngOnInit() {
    this.getProducts();
    this.transformData();
    this.userId = this.authService.getAuthUser()?.id ?? 0;
  }

  // get all products
  getProducts() {
    this.productService.getProducts().subscribe((product: any) => {
      this.products = product.carts;
    });
  }

  // search product
  transformData(searchTerm: string = '') {
    if (searchTerm.trim() === '') return this.products;
    return this.products.filter((prod) =>
      prod.products.some(
        (product: { title: string; price: number }) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.price.toString().includes(searchTerm)
      )
    );
  }

  // add to cart
  addToCart(productId: number) {
    this.alert = true;
    this.cart = [...this.cart, { id: productId, quantity: 1 }];
    console.log(this.cart);

    // Clear previous timeout
    if (this.timerId) clearTimeout(this.timerId);
    // this.postCart();
    // call the service to add to cart
    this.timerId = setTimeout(() => {
      this.postCart();
      this.alert = false;
    }, 3000);
  }

  // post cart to the API
  postCart() {
    const payload = { userId: this.userId, products: this.cart };
    console.log('POST: ', payload);
    this.productService.addToCartProduct(JSON.stringify(payload)).subscribe({
      next: (res) => {
        console.log(res);
        this.productService.saveToCart(res);
        this.cart = [];
        clearTimeout(this.timerId);
        this.router.navigateByUrl('/carts');
      },
      error: (err) => {
        console.error('Error while posting cart:', err);
        clearTimeout(this.timerId);
      },
    });
  }


  buyProd(productId: number): void {
    console.log(productId);
  }
}
