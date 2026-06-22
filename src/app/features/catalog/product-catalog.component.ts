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
      <span class="badge">Notre Sélection 2026</span>
      <h1>Vivez la Fraîcheur Ventila</h1>
      <p>Des solutions de ventilation performantes pour votre confort quotidien.</p>
    </div>

    <div class="product-grid">
      @for (p of products(); track p.id) {
        <div class="product-card" [routerLink]="['/product', p.id]">
          <div class="image-container">
            @if (p.imageUrls && p.imageUrls.length > 0) {
              <img [src]="p.imageUrls[0]" [alt]="p.name" class="product-image">
            } @else {
              <div class="image-placeholder">
                <span class="placeholder-icon">🌬️</span>
              </div>
            }
            
            <button class="add-to-cart-quick" (click)="quickAdd($event, p)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="product-info">
            <div class="category">Ventilation</div>
            <h3>{{ p.name }}</h3>
            <div class="price-row">
              <p class="price">{{ p.sellingPriceTTC | currency:'TND' }}</p>
              <span class="stock-badge">En stock</span>
            </div>
            <button class="btn-primary-sm btn-mint">
              Voir détails
            </button>
          </div>
        </div>
      } @empty {
        <div class="empty-state">
          <div class="empty-icon">🌬️</div>
          <p>Aucun produit disponible pour le moment.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .catalog-header {
      text-align: center;
      margin-bottom: 64px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: var(--primary-light);
      color: var(--primary-dark);
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    
    .catalog-header h1 {
      font-size: 3rem;
      font-weight: 900;
      color: var(--text-main);
      margin-bottom: 16px;
      line-height: 1.1;
    }
    
    .catalog-header p {
      color: var(--text-muted);
      font-size: 1.125rem;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 32px;
    }
    
    .product-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    
    .product-card:hover {
      border-color: var(--primary);
      box-shadow: 0 20px 40px rgba(0, 188, 212, 0.08);
      transform: translateY(-8px);
    }
    
    .image-container {
      aspect-ratio: 1;
      background: #fdfdfd;
      position: relative;
      overflow: hidden;
    }
    
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .product-card:hover .product-image {
      transform: scale(1.1);
    }
    
    .image-placeholder {
      width: 100%;
      height: 100%;
      background: var(--bg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-icon {
      font-size: 3rem;
      opacity: 0.3;
    }
    
    .add-to-cart-quick {
      position: absolute;
      bottom: 16px;
      right: 16px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
    }

    .product-card:hover .add-to-cart-quick {
      opacity: 1;
      transform: translateY(0);
    }

    .add-to-cart-quick:hover {
      background: var(--accent-hover);
      transform: scale(1.1);
    }
    
    .product-info {
      padding: 24px;
    }

    .category {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    
    .product-info h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 3.1rem;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
      margin: 0;
    }

    .stock-badge {
      font-size: 0.7rem;
      font-weight: 600;
      color: #059669;
      background: #ecfdf5;
      padding: 4px 8px;
      border-radius: 6px;
    }

    .btn-mint {
      width: 100%;
      background: var(--accent);
      color: white;
      padding: 12px;
      border-radius: 10px;
      border: none;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-mint:hover {
      background: var(--accent-hover);
    }
    
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 20px;
      color: var(--text-muted);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 24px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .catalog-header {
        margin-bottom: 40px;
      }

      .catalog-header h1 {
        font-size: 1.5rem;
      }

      .badge {
        font-size: 0.7rem;
        padding: 4px 12px;
      }

      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
      }
      
      .product-info {
        padding: 16px;
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

  quickAdd(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product);
  }
}
