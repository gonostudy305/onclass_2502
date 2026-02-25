import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private productService: ProductService) { }

  getProducts() {
    this.loading.set(true);
    this.error.set(null);
    
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load products');
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}
