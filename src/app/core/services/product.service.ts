import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/ecommerce.models';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    private mockProducts: Product[] = [
        {
            id: 1,
            name: 'Ventilateur de Plafond Design - AeroFlow',
            description: 'Un ventilateur élégant et silencieux pour votre salon. Finition blanc mat avec 3 pales aérodynamiques.',
            purchasePriceHT: 120,
            profitMarginPercent: 25,
            vatPercent: 19,
            sellingPriceTTC: 178.50,
            characteristics: { 'Vitesse': '3 niveaux', 'Puissance': '60W', 'Couleur': 'Blanc' },
            imageUrls: ['https://images.unsplash.com/photo-1591199022663-df639535306d?q=80&w=600&auto=format&fit=crop'],
            active: true
        },
        {
            id: 2,
            name: 'Ventilateur Industriel sur Pied SkyVent',
            description: 'Puissance maximale pour les grands espaces. Idéal pour les ateliers et les salles de sport.',
            purchasePriceHT: 150,
            profitMarginPercent: 20,
            vatPercent: 19,
            sellingPriceTTC: 214.20,
            characteristics: { 'Diamètre': '50cm', 'Débit d\'air': '5000 m3/h', 'Poids': '8kg' },
            imageUrls: ['https://images.unsplash.com/photo-1549416194-d4f18ca47180?q=80&w=600&auto=format&fit=crop'],
            active: true
        },
        {
            id: 3,
            name: 'Extracteur d\'Air Mural Pro-Vent',
            description: 'Solution efficace pour l\'évacuation de l\'humidité et des odeurs en cuisine ou salle de bain.',
            purchasePriceHT: 45,
            profitMarginPercent: 30,
            vatPercent: 19,
            sellingPriceTTC: 69.60,
            characteristics: { 'Niveau sonore': '35dB', 'Consommation': '15W' },
            imageUrls: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=600&auto=format&fit=crop'],
            active: true
        }
    ];

    constructor(private http: HttpClient) { }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
            catchError(() => of(this.mockProducts.filter(p => p.active))),
            map(products => products.filter(p => p.active))
        );
    }

    getById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
            catchError(() => {
                const product = this.mockProducts.find(p => p.id === id);
                return product ? of(product) : of({} as Product);
            })
        );
    }
}
