import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, retry, throwError } from 'rxjs';

import { Environments } from '../../environments/environments';
import { config } from '../../../config';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http: HttpClient = inject(HttpClient);
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getProducts() {
    return this.http.get(Environments.apiBaseUrl + config.carts).pipe(
      retry(1),
      catchError((error) => {
        console.error('Error:', error);
        return throwError(() =>new Error(error.error?.message || 'Error occurred while fetching products.')
        );
      })
    );
  }

  addToCartProduct(product: any) {
    return this.http.post(Environments.apiBaseUrl + config.addToCard, product, { headers: this.headers, }).pipe(
        retry(1),
        catchError((error) => {
          console.error('Error:', error);
          return throwError(() => new Error(error.error?.message || 'Error occurred while add to cart products.')
        );
        })
      );
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  saveToCart(product: any): void {
    if (!this.isBrowser()) return;
    const existingCart = JSON.parse(localStorage.getItem('cart') || 'null');
    // If cart data exists, store it as an array of objects
    if (existingCart) {
      const cartArray = Array.isArray(existingCart) ? existingCart : [existingCart];
      cartArray.push(product);
      localStorage.setItem('cart', JSON.stringify(cartArray));
    } else {
      localStorage.setItem('cart', JSON.stringify(product));
    }
  }

  getCart(): any[] | null {
    if (!this.isBrowser()) return null;
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || 'null');
      return Array.isArray(cart) ? cart : cart ? [cart] : null;
    } catch {
      console.error('Error parsing cart data.');
      return null;
    }
  }

  getCartCount(): number {
    const cart = this.getCart();
    return cart ? cart.length : 0;
  }
  
  clearCart(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem('cart');
  }
}
