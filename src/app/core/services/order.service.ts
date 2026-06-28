import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckoutRequest, Order } from '../models/ecommerce.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) { }

    checkout(request: CheckoutRequest): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/checkout`, request);
    }
}
