import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, KeyValuePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { LogService } from '../../core/services/log.service';
import { Product } from '../../core/models/ecommerce.models';

@Component({
  selector: 'cli-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, KeyValuePipe],
  template: `
    <div class="collection">
      <div class="collection__header">
        <div class="collection__hero">
                <video autoplay muted loop playsinline class="collection__hero-video">
                    <source src="assets/videos/ventila.mp4" type="video/mp4">
                </video>
                <div class="collection__hero-overlay"></div>
              <!--  <div class="container collection__hero-content">
                    <h1 class="collection__title">Ventila tn</h1>
                </div> -->
            </div>
      </div>

      <div class="collection__content">
        <div class="container">
          @if (products().length === 0) {
            <div class="collection__empty">
              <div class="empty-state">
                <div class="empty-state__icon">🌬️</div>
                <h3 class="empty-state__title">Aucun produit trouvé</h3>
                <p class="empty-state__text">Nous mettons à jour notre catalogue. Revenez bientôt !</p>
              </div>
            </div>
          } @else if (products().length === 1) {
            <div class="product-page">
              <!-- Product Content -->
              <div class="product">
                <div class="product__grid">
                  <!-- Product Media -->
                  <div class="product__media">
                    <div class="product__media-gallery">
                      <div class="product__media-main">
                        @if (products()[0].imageUrls && products()[0].imageUrls.length > 0) {
                          <img 
                            [src]="selectedImage" 
                            [alt]="products()[0].name" 
                            class="product__media-image"
                            (click)="openLightbox(selectedImage)"
                          >
                        } @else {
                          <div class="product__media-placeholder">
                            <span class="placeholder-icon">🌬️</span>
                          </div>
                        }
                      </div>

                      @if (products()[0].imageUrls && products()[0].imageUrls.length > 1) {
                        <div class="product__media-thumbnails">
                          @for (img of products()[0].imageUrls; track img; let i = $index) {
                            <button
                              class="product__media-thumbnail"
                              [class.product__media-thumbnail--active]="selectedImage === img"
                              (click)="selectedImage = img"
                              [attr.aria-label]="'Image ' + (i + 1)"
                            >
                              <img [src]="img" [alt]="products()[0].name + ' - Vue ' + (i + 1)">
                            </button>
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div class="product__info">
                    <!-- Title -->
                    <h1 class="product__title">{{ products()[0].name }}</h1>

                    <!-- Price -->
                    <div class="product__price-wrapper">
                      <span class="product__price">
                        {{ products()[0].sellingPriceTTC | currency:'TND':'symbol':'1.2-2' }}
                      </span>
                      <span class="product__price-tax">TTC</span>
                    </div>

                    <!-- Description -->
                    @if (products()[0].description) {
                      <div class="product__description">
                        <p>{{ products()[0].description }}</p>
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

                      <button class="btn btn--primary btn--add-to-cart" (click)="addToCart(products()[0])">
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
                    @if (hasCharacteristics(products()[0])) {
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
                          @for (char of products()[0].characteristics | keyvalue; track char.key) {
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
                      <img [src]="lightboxImage" [alt]="products()[0].name" class="lightbox__image">
                    </div>

                    @if (hasNextImage()) {
                      <button class="lightbox__nav-button lightbox__nav-button--next" (click)="navigateImage(1)" aria-label="Image suivante">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    }
                  </div>

                  @if (products()[0].imageUrls && products()[0].imageUrls.length > 1) {
                    <div class="lightbox__counter">
                      {{ currentImageIndex + 1 }} / {{ products()[0].imageUrls.length }}
                    </div>
                  }
                </div>
              </div>
            }
          } @else {
            <div class="collection__toolbar">
              <p class="collection__count">{{ products().length }} produits</p>
              <div class="collection__filters">
                <!-- Filters will go here -->
              </div>
            </div>

            <div class="product-grid">
              @for (product of products(); track product.id) {
                <div class="product-card">
                  <a [routerLink]="['/product', product.id]" class="product-card__link">
                    <div class="product-card__media">
                      @if (product.imageUrls && product.imageUrls.length > 0) {
                        <img [src]="product.imageUrls[0]" [alt]="product.name" class="product-card__image">
                      } @else {
                        <div class="product-card__placeholder">
                          <span class="placeholder-icon">🌬️</span>
                        </div>
                      }
                      <div class="product-card__badge">
                        <span class="badge badge--success">En stock</span>
                      </div>
                      <div class="product-card__actions">
                        <button class="product-card__quick-add" (click)="quickAdd($event, product)">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                          Ajouter
                        </button>
                      </div>
                    </div>

                    <div class="product-card__info">
                      <div class="product-card__vendor">Ventila.tn</div>
                      <h3 class="product-card__title">{{ product.name }}</h3>
                      <div class="product-card__price">
                        <span class="price">{{ product.sellingPriceTTC | currency:'TND':'symbol':'1.2-2' }}</span>
                      </div>
                    </div>
                  </a>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Collection Header */
        .collection__header {
            padding: 0;
        }

        .collection__hero {
            position: relative;
            height: 500px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .collection__hero-video {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            object-fit: cover;
        }

        .collection__hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
        }

        .collection__hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            color: white;
        }

        .collection__title-wrapper {
            max-width: 600px;
            margin: 0 auto;
        }

    .collection__title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: white;
      line-height: 1.2;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .collection__description {
      font-size: 1.125rem;
      color: rgba(255,255,255,0.9);
      line-height: 1.7;
      margin: 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    /* Collection Content */
    .collection__content {
      padding: 3rem 0;
    }

    .collection__toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-base-border);
    }

    .collection__count {
      font-size: 0.9375rem;
      color: var(--color-gray-600);
      margin: 0;
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    /* Product Card */
    .product-card {
      position: relative;
      background: var(--color-base-background-1);
    }

    .product-card__link {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .product-card__media {
      position: relative;
      aspect-ratio: 1;
      background: var(--color-gray-100);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .product-card__image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform var(--transition-slow);
    }

    .product-card:hover .product-card__image {
      transform: scale(1.05);
    }

    .product-card__placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-gray-100);
    }

    .placeholder-icon {
      font-size: 4rem;
      opacity: 0.3;
    }

    .product-card__badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 2;
    }

    .product-card__actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      transform: translateY(100%);
      opacity: 0;
      transition: all var(--transition-base);
    }

    .product-card:hover .product-card__actions {
      transform: translateY(0);
      opacity: 1;
    }

    .product-card__quick-add {
      width: 100%;
      padding: 0.875rem 1rem;
      background: var(--color-base-background-1);
      color: var(--color-base-text);
      border: none;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .product-card__quick-add:hover {
      background: var(--color-base-text);
      color: var(--color-primary-contrast);
    }

    .product-card__info {
      padding: 0 0.25rem;
    }

    .product-card__vendor {
      font-size: 0.75rem;
      color: var(--color-gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .product-card__title {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-base-text);
      margin: 0 0 0.5rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 2.8em;
    }

    .product-card__price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--color-base-text);
    }

    /* Empty State */
    .collection__empty {
      grid-column: 1 / -1;
      padding: 4rem 0;
    }

    .empty-state {
      text-align: center;
      max-width: 400px;
      margin: 0 auto;
    }

    .empty-state__icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-state__title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      color: var(--color-base-text);
    }

    .empty-state__text {
      font-size: 1rem;
      color: var(--color-gray-600);
      line-height: 1.6;
      margin: 0;
    }

    /* Product Page Styles (for single product view) */
    .product-page {
      padding: 0 0 5rem;
    }

    .product__grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 5rem;
    }

    .product__media {
      position: sticky;
      top: 5rem;
      align-self: start;
    }

    .product__media-main {
      aspect-ratio: 1;
      background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 24px;
      overflow: hidden;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }

    .product__media-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      cursor: zoom-in;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

    .product__media-thumbnails {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .product__media-thumbnail {
      flex-shrink: 0;
      width: 88px;
      height: 88px;
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid transparent;
      background: #f8f9fa;
      cursor: pointer;
      padding: 0.75rem;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .product__media-thumbnail:hover {
      border-color: #d1d5db;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

    .product__info {
      padding-top: 0.25rem;
    }

    .product__meta {
      margin-bottom: 1.5rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.875rem;
      border-radius: 100px;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .badge--success {
      background: #dcfce7;
      color: #166534;
    }

    .badge__dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .product__title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1.25rem;
      line-height: 1.15;
      letter-spacing: -0.02em;
    }

    .product__price-wrapper {
      display: flex;
      align-items: baseline;
      gap: 0.625rem;
      margin-bottom: 1.75rem;
    }

    .product__price {
      font-size: 2.5rem;
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .product__price-tax {
      font-size: 0.9375rem;
      color: #6b7280;
      font-weight: 500;
    }

    .product__description {
      margin-bottom: 2.25rem;
    }

    .product__description p {
      font-size: 1rem;
      line-height: 1.8;
      color: #4b5563;
      margin: 0;
    }

    .product__divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 2rem 0;
    }

    .product__action-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }

    .product__quantity {
      flex-shrink: 0;
    }

    .product__quantity-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .quantity-selector {
      display: inline-flex;
      align-items: center;
      border: 2px solid #e5e7eb;
      border-radius: 14px;
      overflow: hidden;
      background: #ffffff;
    }

    .quantity-selector__btn {
      width: 52px;
      height: 52px;
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
      width: 64px;
      text-align: center;
      font-size: 1.125rem;
      font-weight: 700;
      color: #111827;
      background: transparent;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      font-family: inherit;
      font-weight: 600;
      font-size: 1rem;
      padding: 1rem 2rem;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      text-decoration: none;
    }

    .btn--primary {
      background: #111827;
      color: #ffffff;
      flex: 1;
      height: 52px;
      box-shadow: 0 4px 12px rgba(17, 24, 39, 0.15);
    }

    .btn--primary:hover {
      background: #374151;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(17, 24, 39, 0.25);
    }

    .btn--primary:active {
      transform: translateY(0);
    }

    .product__section {
      margin-bottom: 2.5rem;
    }

    .product__section-header {
      margin-bottom: 1.25rem;
    }

    .product__section-title {
      font-family: var(--font-body);
      font-size: 0.9375rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.075em;
    }

    .product__section-title svg {
      color: #374151;
    }

    .product-specs {
      background: #f9fafb;
      border-radius: 16px;
      padding: 1.5rem;
      display: grid;
      gap: 0.875rem;
    }

    .product-specs__row {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 1rem;
      padding: 0.75rem 0;
    }

    .product-specs__row:not(:last-child) {
      border-bottom: 1px solid #e5e7eb;
    }

    .product-specs__label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .product-specs__value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      text-align: right;
    }

    .product__features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .feature-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.5rem 1rem;
      background: #ffffff;
      border: 1px solid #f3f4f6;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      border-color: #e5e7eb;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }

    .feature-card__icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: #374151;
    }

    .feature-card__title {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem;
    }

    .feature-card__desc {
      font-size: 0.75rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }

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
      top: -3rem;
      right: 0;
      width: 44px;
      height: 44px;
      border: none;
      background: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity var(--transition-base);
    }

    .lightbox__close:hover {
      opacity: 0.7;
    }

    .lightbox__navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 2rem;
    }

    .lightbox__nav-button {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
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
      border-radius: var(--radius-md);
    }

    .lightbox__counter {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      margin-top: 1.5rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 1024px) {
      .product__grid {
        gap: 2.5rem;
      }
    }

    @media (max-width: 900px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .collection__title {
        font-size: 2.25rem;
      }

      .collection__hero {
        height: 400px;
      }

      .product__grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .product__media {
        position: static;
      }

      .product__features {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .collection__hero {
        height: 300px;
      }

      .collection__title {
        font-size: 1.875rem;
      }

      .collection__description {
        font-size: 1rem;
      }

      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .product-card__actions {
        display: none;
      }

      .product-page {
        padding: 0 0 3rem;
      }

      .product__title {
        font-size: 1.75rem;
      }

      .product__price {
        font-size: 1.75rem;
      }

      .product__media-main {
        padding: 1.5rem;
      }

      .product__media-thumbnail {
        width: 64px;
        height: 64px;
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
  `]
})
export class ProductCatalogComponent implements OnInit {
  products = signal<Product[]>([]);
  selectedImage = '';
  quantity = signal(1);
  isLightboxOpen = false;
  lightboxImage = '';
  currentImageIndex = 0;

  constructor(private productService: ProductService, private cartService: CartService, private router: Router, private logService: LogService) {
    effect(() => {
      if (this.products().length === 1) {
        const p = this.products()[0];
        if (p.imageUrls && p.imageUrls.length > 0) {
          this.selectedImage = p.imageUrls[0];
        }
      }
    });
  }

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
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.logService.log('ADD_TO_CART', `Quick add: ${product.name} (qty: 1)`, JSON.stringify({ productId: product.id, quantity: 1 }));
    this.router.navigate(['/checkout']);
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
    this.logService.log('ADD_TO_CART', `Add to cart: ${product.name} (qty: ${this.quantity()})`, JSON.stringify({ productId: product.id, quantity: this.quantity() }));
    this.router.navigate(['/checkout']);
  }

  openLightbox(imageUrl: string) {
    const p = this.products()[0];
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
    const p = this.products()[0];
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
    const p = this.products()[0];
    if (!p?.imageUrls) return false;
    return this.currentImageIndex < p.imageUrls.length - 1;
  }

  hasCharacteristics(p: Product): boolean {
    return p.characteristics && Object.keys(p.characteristics).length > 0;
  }
}
