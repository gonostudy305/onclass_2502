import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

const baseUrl = "http://localhost:3000";

export interface Product {
  productCode: number;
  productName: string;
  productPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = baseUrl + '/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  addProduct(data: { name: string; price: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, data: { name: string; price: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}