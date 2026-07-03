import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { CheckoutRequest, Order } from '../models/ecommerce.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    checkout(request: CheckoutRequest): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/checkout`, request).pipe(
            timeout(10000), // 10 secondes timeout maximum
            catchError((error) => {
                if (error instanceof TimeoutError) {
                    console.error('La requête a pris trop de temps');
                    return throwError(() => new Error('Temps d\'attente dépassé'));
                }
                return throwError(() => error);
            })
        );
    }
}
