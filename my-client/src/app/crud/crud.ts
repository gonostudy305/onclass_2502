import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-crud',
  imports: [CommonModule, FormsModule],
  templateUrl: './crud.html',
  styleUrl: './crud.css',
})
export class Crud implements OnInit {
  products: any[] = [];       // dữ liệu gốc từ API
  filteredProducts: any[] = []; // dữ liệu sau khi lọc + sắp xếp
  name: string = '';
  price: number = 0;
  editId: string = '';
  errMsg: string = '';

  // Filter & Sort
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOrder: string = 'none'; // 'none' | 'asc' | 'desc'

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
        this.applyFilterSort();
      },
      error: (err: any) => {
        this.errMsg = err.message;
      },
    });
  }

  applyFilterSort() {
    let result = [...this.products];

    // Lọc theo khoảng giá
    if (this.minPrice !== null && this.minPrice > 0) {
      result = result.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null && this.maxPrice > 0) {
      result = result.filter(p => p.price <= this.maxPrice!);
    }

    // Sắp xếp theo giá
    if (this.sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    this.filteredProducts = result;
  }

  onResetFilter() {
    this.minPrice = null;
    this.maxPrice = null;
    this.sortOrder = 'none';
    this.applyFilterSort();
  }

  onSubmit() {
    if (!this.name.trim()) return;

    const action = this.editId ? 'update' : 'add';
    if (!confirm(`Are you sure you want to ${action} this product?`)) return;

    if (this.editId) {
      // Update
      this.productService.updateProduct(this.editId, { name: this.name, price: this.price }).subscribe({
        next: () => {
          this.loadProducts();
          this.onReset();
        },
        error: (err: any) => {
          this.errMsg = err.message;
        },
      });
    } else {
      // Create
      this.productService.addProduct({ name: this.name, price: this.price }).subscribe({
        next: () => {
          this.loadProducts();
          this.onReset();
        },
        error: (err: any) => {
          this.errMsg = err.message;
        },
      });
    }
  }

  onEdit(product: any) {
    this.editId = product._id;
    this.name = product.name;
    this.price = product.price;
  }

  onDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err: any) => {
        this.errMsg = err.message;
      },
    });
  }

  onReset() {
    this.name = '';
    this.price = 0;
    this.editId = '';
  }
}
