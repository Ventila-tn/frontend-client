import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingService {
    private apiUrl = `${environment.apiUrl}/settings`;

    constructor(private http: HttpClient) {}

    getDeliveryFee(): Observable<number> {
        console.log('🌐 Appel API:', `${this.apiUrl}/delivery-fee`);
        return this.http.get<number>(`${this.apiUrl}/delivery-fee`);
    }
}
