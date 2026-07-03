import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { LogService } from '../../core/services/log.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'cli-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    @if (product(); as p) {
      <div class="product-page">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="breadcrumb" aria-label="Fil d'Ariane">
            <ol class="breadcrumb__list">
              <li class="breadcrumb__item">
                <a routerLink="/" class="breadcrumb__link">Accueil</a>
              </li>
              <li class="breadcrumb__item">
                <a routerLink="/" class="breadcrumb__link">Produits</a>
              </li>
              <li class="breadcrumb__item breadcrumb__item--current">
                <span class="breadcrumb__text">{{ p.name }}</span>
              </li>
            </ol>
          </nav>

          <!-- Product Content -->
          <div class="product">
            <div class="product__grid">
              <!-- Product Media -->
              <div class="product__media">
                <div class="product__media-gallery">
                  <div class="product__media-main">
                    @if (p.imageUrls && p.imageUrls.length > 0) {
                      <img 
                        [src]="selectedImage" 
                        [alt]="p.name" 
                        class="product__media-image"
                        (click)="openLightbox(selectedImage)"
                      >
                    } @else {
                      <div class="product__media-placeholder">
                        <span class="placeholder-icon">🌬️</span>
                      </div>
                    }
                  </div>

                  @if (p.imageUrls && p.imageUrls.length > 1) {
                    <div class="product__media-thumbnails">
                      @for (img of p.imageUrls; track img; let i = $index) {
                        <button
                          class="product__media-thumbnail"
                          [class.product__media-thumbnail--active]="selectedImage === img"
                          (click)="selectedImage = img"
                          [attr.aria-label]="'Image ' + (i + 1)"
                        >
                          <img [src]="img" [alt]="p.name + ' - Vue ' + (i + 1)">
                        </button>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Product Info -->
              <div class="product__info">
                <!-- Stock & Badge -->
                <div class="product__meta">
                  <span class="badge badge--success">
                    <span class="badge__dot"></span>
                    En stock & livraison rapide
                  </span>
                </div>

                <!-- Title -->
                <h1 class="product__title">{{ p.name }}</h1>

                <!-- Price -->
                <div class="product__price-wrapper">
                  <span class="product__price">
                    {{ p.sellingPriceTTC.toFixed(2) }} TND
                  </span>
                  <span class="product__price-tax">TTC</span>
                </div>

                <!-- Description -->
                @if (p.description) {
                  <div class="product__description">
                    <p>{{ p.description }}</p>
                  </div>
                }

                <!-- Divider -->
                <div class="product__divider"></div>

                <!-- Quantity & Add to Cart Row -->
                <div class="product__action-row">
                  <div class="product__quantity">
                    <label class="product__quantity-label">Quantité</label>
                    <div class="quantity-selector">
                      <button 
                        class="quantity-selector__btn quantity-selector__btn--decrease"
                        (click)="decreaseQuantity()"
                        [disabled]="quantity() <= 1"
                        type="button"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"></line>
                        </svg>
                      </button>
                      <span class="quantity-selector__value">{{ quantity() }}</span>
                      <button 
                        class="quantity-selector__btn quantity-selector__btn--increase"
                        (click)="increaseQuantity()"
                        type="button"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round"></line>
                          <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button class="btn btn--primary btn--add-to-cart" (click)="addToCart(p)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 6h15l-1.5 9h-12l-1.5-9z"></path>
                      <path d="M6 6l-1-4H2"></path>
                      <circle cx="10" cy="19" r="1"></circle>
                      <circle cx="17" cy="19" r="1"></circle>
                    </svg>
                    Ajouter au panier
                  </button>
                </div>

                <!-- Characteristics -->
                @if (hasCharacteristics(p)) {
                  <div class="product__section">
                    <div class="product__section-header">
                      <h3 class="product__section-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        Caractéristiques
                      </h3>
                    </div>
                    <div class="product-specs">
                      @for (char of p.characteristics | keyvalue; track char.key) {
                        <div class="product-specs__row">
                          <span class="product-specs__label">{{ char.key }}</span>
                          <span class="product-specs__value">{{ char.value }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      @if (isLightboxOpen) {
        <div class="lightbox" (click)="closeLightbox()">
          <div class="lightbox__content" (click)="$event.stopPropagation()">
            <button class="lightbox__close" (click)="closeLightbox()" aria-label="Fermer">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div class="lightbox__navigation">
              @if (hasPreviousImage()) {
                <button class="lightbox__nav-button lightbox__nav-button--prev" (click)="navigateImage(-1)" aria-label="Image précédente">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              }

              <div class="lightbox__image-wrapper">
                <img [src]="lightboxImage" [alt]="p.name" class="lightbox__image">
              </div>

              @if (hasNextImage()) {
                <button class="lightbox__nav-button lightbox__nav-button--next" (click)="navigateImage(1)" aria-label="Image suivante">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              }
            </div>

            @if (p.imageUrls && p.imageUrls.length > 1) {
              <div class="lightbox__counter">
                {{ currentImageIndex + 1 }} / {{ p.imageUrls.length }}
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    /* Product Page */
    .product-page {
      padding: 1.5rem 0 3rem;
    }

    /* Breadcrumb */
    .breadcrumb {
      margin-bottom: 1.25rem;
    }

    .breadcrumb__list {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
    }

    .breadcrumb__item:not(:last-child)::after {
      content: '/';
      color: #d1d5db;
    }

    .breadcrumb__link {
      color: #6b7280;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb__link:hover {
      color: #111827;
    }

    .breadcrumb__text {
      color: #111827;
      font-weight: 500;
    }

    /* Product Grid */
    .product__grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 3rem;
    }

    /* Product Media */
    .product__media {
      position: sticky;
      top: 5rem;
      align-self: start;
    }

    .product__media-main {
      aspect-ratio: 1;
      background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 20px;
      overflow: hidden;
      padding: 1.5rem;
    }

    .product__media-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: zoom-in;
      transition: transform 0.3s ease;
    }

    .product__media-main:hover .product__media-image {
      transform: scale(1.02);
    }

    .product__media-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-icon {
      font-size: 4rem;
      opacity: 0.2;
    }

    .product__media-thumbnails {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .product__media-thumbnail {
      flex-shrink: 0;
      width: 70px;
      height: 70px;
      border-radius: 14px;
      overflow: hidden;
      border: 2px solid transparent;
      background: #f8f9fa;
      cursor: pointer;
      padding: 0.5rem;
      transition: all 0.2s ease;
    }

    .product__media-thumbnail:hover {
      border-color: #d1d5db;
      transform: translateY(-1px);
    }

    .product__media-thumbnail--active {
      border-color: #111827;
      background: #f3f4f6;
    }

    .product__media-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    /* Product Info */
    .product__info {
      padding-top: 0;
    }

    .product__meta {
      margin-bottom: 0.75rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge--success {
      background: #dcfce7;
      color: #166534;
    }

    .badge__dot {
      width: 7px;
      height: 7px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .product__title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.75rem;
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    .product__price-wrapper {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .product__price {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .product__price-tax {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .product__description {
      margin-bottom: 1.25rem;
    }

    .product__description p {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: #4b5563;
      margin: 0;
    }

    .product__divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 1.25rem 0;
    }

    .product__action-row {
      display: flex;
      gap: 0.875rem;
      align-items: flex-end;
      margin-bottom: 1.5rem;
    }

    .product__quantity {
      flex-shrink: 0;
    }

    .product__quantity-label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.375rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .quantity-selector {
      display: inline-flex;
      align-items: center;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
    }

    .quantity-selector__btn {
      width: 40px;
      height: 40px;
      border: none;
      background: transparent;
      color: #374151;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .quantity-selector__btn:hover:not(:disabled) {
      background: #f3f4f6;
      color: #111827;
    }

    .quantity-selector__btn:active:not(:disabled) {
      transform: scale(0.95);
    }

    .quantity-selector__btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .quantity-selector__value {
      width: 50px;
      text-align: center;
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111827;
      background: transparent;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: inherit;
      font-weight: 600;
      font-size: 0.9375rem;
      padding: 0.875rem 1.75rem;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      text-decoration: none;
    }

    .btn--primary {
      background: #111827;
      color: #ffffff;
      flex: 1;
      height: 40px;
      box-shadow: 0 2px 8px rgba(17, 24, 39, 0.12);
    }

    .btn--primary:hover {
      background: #374151;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(17, 24, 39, 0.2);
    }

    .btn--primary:active {
      transform: translateY(0);
    }

    /* Product Section */
    .product__section {
      margin-bottom: 1.5rem;
    }

    .product__section-header {
      margin-bottom: 0.75rem;
    }

    .product__section-title {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.075em;
    }

    .product__section-title svg {
      color: #374151;
    }

    /* Product Specs */
    .product-specs {
      background: #f9fafb;
      border-radius: 14px;
      padding: 1rem 1.25rem;
      display: grid;
      gap: 0.5rem;
    }

    .product-specs__row {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }

    .product-specs__row:not(:last-child) {
      border-bottom: 1px solid #e5e7eb;
    }

    .product-specs__label {
      font-size: 0.8125rem;
      color: #6b7280;
      font-weight: 500;
    }

    .product-specs__value {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #111827;
      text-align: right;
    }

    /* Lightbox */
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .lightbox__content {
      position: relative;
      width: 90vw;
      max-width: 1200px;
      height: 90vh;
    }

    .lightbox__close {
      position: absolute;
      top: -2.5rem;
      right: 0;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease;
    }

    .lightbox__close:hover {
      opacity: 0.7;
    }

    .lightbox__navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 1.5rem;
    }

    .lightbox__nav-button {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .lightbox__nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .lightbox__image-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      max-height: 100%;
    }

    .lightbox__image {
      max-width: 100%;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 12px;
    }

    .lightbox__counter {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8125rem;
      margin-top: 1.25rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .product__grid {
        gap: 2rem;
      }
    }

    @media (max-width: 900px) {
      .product__grid {
        grid-template-columns: 1fr;
        gap: 1.75rem;
      }

      .product__media {
        position: static;
      }
    }

    @media (max-width: 600px) {
      .product-page {
        padding: 1rem 0 2.5rem;
      }

      .breadcrumb {
        margin-bottom: 1rem;
      }

      .product__title {
        font-size: 1.5rem;
      }

      .product__price {
        font-size: 1.5rem;
      }

      .product__media-main {
        padding: 1.25rem;
      }

      .product__media-thumbnail {
        width: 60px;
        height: 60px;
      }

      .product__action-row {
        flex-direction: column;
        align-items: stretch;
      }

      .product__quantity {
        width: 100%;
      }

      .quantity-selector {
        width: 100%;
        justify-content: space-between;
      }

      .quantity-selector__value {
        flex: 1;
      }

      .btn--primary {
        width: 100%;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  selectedImage = '';
  quantity = signal(1);
  isLightboxOpen = false;
  lightboxImage = '';
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private logService: LogService
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

  increaseQuantity() {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(product: Product) {
    for (let i = 0; i < this.quantity(); i++) {
      this.cartService.addToCart(product);
    }
    this.logService.log('ADD_TO_CART', `Add to cart from detail: ${product.name} (qty: ${this.quantity()})`, JSON.stringify({ productId: product.id, quantity: this.quantity() }));
    this.router.navigate(['/checkout']);
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
