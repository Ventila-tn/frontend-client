import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'cli-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    @if (product(); as p) {
      <div class="back-button">
        <a routerLink="/" class="back-link">← Retour</a>
      </div>

      <div class="detail-container">
        <div class="image-section">
          <div class="main-image" (click)="openLightbox(selectedImage)">
            @if (p.imageUrls && p.imageUrls.length > 0) {
              <img [src]="selectedImage" [alt]="p.name">
            }
          </div>
          
          @if (p.imageUrls && p.imageUrls.length > 1) {
            <div class="thumbnails">
              @for (img of p.imageUrls; track img; let i = $index) {
                <div 
                  class="thumbnail" 
                  [class.active]="selectedImage === img"
                  (click)="selectedImage = img"
                >
                  <img [src]="img" [alt]="p.name + ' - ' + (i + 1)">
                </div>
              }
            </div>
          }
        </div>
        
        <div class="info-section">
          <h1>{{ p.name }}</h1>
          <p class="description">{{ p.description }}</p>
          
          @if (hasCharacteristics(p)) {
            <div class="characteristics">
              <h3>Caractéristiques</h3>
              <div class="specs">
                @for (char of p.characteristics | keyvalue; track char.key) {
                  <div class="spec">
                    <span class="spec-label">{{ char.key }}</span>
                    <span class="spec-value">{{ char.value }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <div class="price-section">
            <span class="price">{{ p.sellingPriceTTC | currency:'EUR' }}</span>
            <button class="add-to-cart" (click)="addToCart(p)">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      @if (isLightboxOpen) {
        <div class="lightbox" (click)="closeLightbox()">
          <div class="lightbox-content" (click)="$event.stopPropagation()">
            <button class="lightbox-close" (click)="closeLightbox()">×</button>
            
            <div class="lightbox-nav">
              @if (hasPreviousImage()) {
                <button class="nav-btn" (click)="navigateImage(-1)">‹</button>
              }
              
              <img [src]="lightboxImage" [alt]="p.name">
              
              @if (hasNextImage()) {
                <button class="nav-btn" (click)="navigateImage(1)">›</button>
              }
            </div>
            
            @if (p.imageUrls && p.imageUrls.length > 1) {
              <div class="lightbox-counter">
                {{ currentImageIndex + 1 }} / {{ p.imageUrls.length }}
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .back-button {
      margin-bottom: 32px;
    }
    
    .back-link {
      color: #6b7280;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .back-link:hover {
      color: #111827;
    }
    
    .detail-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }
    
    .image-section {
      position: sticky;
      top: 100px;
      align-self: start;
    }
    
    .main-image {
      aspect-ratio: 1;
      background: #f9fafb;
      border-radius: 12px;
      overflow: hidden;
      cursor: zoom-in;
    }
    
    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .thumbnails {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      overflow-x: auto;
    }
    
    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid transparent;
      cursor: pointer;
      flex-shrink: 0;
      background: #f9fafb;
    }
    
    .thumbnail:hover {
      border-color: #d1d5db;
    }
    
    .thumbnail.active {
      border-color: #111827;
    }
    
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .info-section {
      padding-top: 8px;
    }
    
    .info-section h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin-bottom: 16px;
      line-height: 1.2;
    }
    
    .description {
      color: #6b7280;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    
    .characteristics {
      margin-bottom: 32px;
    }
    
    .characteristics h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 16px;
    }
    
    .specs {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .spec {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .spec:last-child {
      border-bottom: none;
    }
    
    .spec-label {
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .spec-value {
      color: #111827;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .price-section {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    
    .price {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
    }
    
    .add-to-cart {
      flex: 1;
      background: #111827;
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .add-to-cart:hover {
      background: #374151;
    }
    
    /* Lightbox */
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
    }
    
    .lightbox-close {
      position: absolute;
      top: -48px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .lightbox-nav {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    
    .nav-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      font-size: 2rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }
    
    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .lightbox-nav img {
      max-width: 80vw;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .lightbox-counter {
      text-align: center;
      color: white;
      margin-top: 16px;
      font-size: 0.875rem;
      opacity: 0.7;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .detail-container {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      
      .image-section {
        position: static;
      }
      
      .info-section h1 {
        font-size: 1.5rem;
      }
      
      .price {
        font-size: 1.5rem;
      }
      
      .price-section {
        flex-direction: column;
        align-items: stretch;
      }
    }
    
    @media (max-width: 480px) {
      .thumbnail {
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  selectedImage = '';
  isLightboxOpen = false;
  lightboxImage = '';
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.productService.getById(id).subscribe(res => {
      if (res.active === false) {
        this.router.navigate(['/']);
        return;
      }
      this.product.set(res);
      if (res.imageUrls && res.imageUrls.length > 0) {
        this.selectedImage = res.imageUrls[0];
      }
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  openLightbox(imageUrl: string) {
    const p = this.product();
    if (!p?.imageUrls || p.imageUrls.length === 0) return;
    
    this.currentImageIndex = p.imageUrls.indexOf(imageUrl);
    if (this.currentImageIndex === -1) {
      this.currentImageIndex = 0;
    }
    this.lightboxImage = imageUrl;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    this.lightboxImage = '';
    document.body.style.overflow = '';
  }

  navigateImage(direction: number) {
    const p = this.product();
    if (!p?.imageUrls || p.imageUrls.length === 0) return;
    
    let newIndex = this.currentImageIndex + direction;
    if (newIndex < 0) newIndex = p.imageUrls.length - 1;
    if (newIndex >= p.imageUrls.length) newIndex = 0;
    
    this.currentImageIndex = newIndex;
    this.lightboxImage = p.imageUrls[newIndex];
    this.selectedImage = p.imageUrls[newIndex];
  }

  hasPreviousImage(): boolean {
    return this.currentImageIndex > 0;
  }

  hasNextImage(): boolean {
    const p = this.product();
    if (!p?.imageUrls) return false;
    return this.currentImageIndex < p.imageUrls.length - 1;
  }

  hasCharacteristics(p: Product): boolean {
    return p.characteristics && Object.keys(p.characteristics).length > 0;
  }
}
