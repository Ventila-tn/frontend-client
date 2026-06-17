import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'cli-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="catalog-header">
      <h1>Nos Ventilateurs</h1>
      <p>Découvrez notre sélection</p>
    </div>

    <div class="product-grid">
      @for (p of products(); track p.id) {
        <div class="product-card" [routerLink]="['/product', p.id]">
          <div class="image-container">
            @if (p.imageUrls && p.imageUrls.length > 0) {
              <img [src]="p.imageUrls[0]" [alt]="p.name" class="product-image">
            } @else {
              <div class="image-placeholder"></div>
            }
            
            @if (p.imageUrls && p.imageUrls.length > 1) {
              <div class="image-badge">{{ p.imageUrls.length }} photos</div>
            }
          </div>
          
          <div class="product-info">
            <h3>{{ p.name }}</h3>
            <p class="price">{{ p.sellingPriceTTC | currency:'EUR' }}</p>
          </div>
        </div>
      } @empty {
        <div class="empty-state">
          <p>Aucun produit disponible</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .catalog-header {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .catalog-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    
    .catalog-header p {
      color: #6b7280;
      font-size: 1rem;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 32px;
    }
    
    .product-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .product-card:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
    
    .image-container {
      aspect-ratio: 1;
      background: #f9fafb;
      position: relative;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .product-card:hover .product-image {
      transform: scale(1.03);
    }
    
    .image-placeholder {
      width: 100%;
      height: 100%;
      background: #f3f4f6;
    }
    
    .image-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.95);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #374151;
    }
    
    .product-info {
      padding: 20px;
    }
    
    .product-info h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 8px;
      line-height: 1.4;
    }
    
    .price {
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }
      
      .product-info {
        padding: 16px;
      }
      
      .product-info h3 {
        font-size: 0.875rem;
      }
      
      .price {
        font-size: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .catalog-header {
        margin-bottom: 32px;
      }
      
      .catalog-header h1 {
        font-size: 1.5rem;
      }
      
      .product-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class ProductCatalogComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (res) => {
        const activeProducts = res.filter(p => p.active !== false);
        this.products.set(activeProducts);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }
}
