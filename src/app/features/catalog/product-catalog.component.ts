import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, effect, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, KeyValuePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { LogService } from '../../core/services/log.service';
import { SettingService } from '../../core/services/setting.service';
import { Product, CheckoutRequest } from '../../core/models/ecommerce.models';

@Component({
  selector: 'cli-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, KeyValuePipe, ReactiveFormsModule],
  template: `
    @if (pageLoading()) {
      <div class="ventila-splash">
        <div class="ventila-splash__logo">ventila<span>tn</span></div>
        <div class="ventila-splash__bar">
          <div class="ventila-splash__bar-inner"></div>
        </div>
      </div>
    }
    <div class="collection" [class.hidden]="pageLoading()">
      <div class="collection__header">
        <div class="collection__hero">
                <video #heroVideo autoplay muted loop playsinline class="collection__hero-video">
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
                {{ products()[0].sellingPriceTTC.toFixed(2) }} TND
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

                    <!-- Characteristics -->
                    @if (hasCharacteristics(products()[0])) {
                      <div class="product__section">
                        <div class="product__section-header">
                          <h3 class="product__section-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="3"></circle>
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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

                <!-- Wide Divider -->
                <div class="product__divider product__divider--wide"></div>

                <!-- Checkout Layout -->
                <div class="checkout-layout">
                      <!-- Checkout Form -->
                      <div class="checkout-form">
                        <div class="form-section">
                          <h2 class="form-section__title">Informations de livraison</h2>
                          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="form">
                            <div class="form-row">
                              <div class="field">
                                <label class="field__label" for="firstName">Prénom *</label>
                                <input 
                                  type="text" 
                                  id="firstName"
                                  formControlName="firstName" 
                                  class="field__input"
                                  placeholder="Votre prénom"
                                >
                                @if (checkoutForm.get('firstName')?.invalid && (checkoutForm.get('firstName')?.dirty || checkoutForm.get('firstName')?.touched)) {
                                  <p class="field__error">Prénom requis</p>
                                }
                              </div>
                              <div class="field">
                                <label class="field__label" for="lastName">Nom *</label>
                                <input 
                                  type="text" 
                                  id="lastName"
                                  formControlName="lastName" 
                                  class="field__input"
                                  placeholder="Votre nom"
                                >
                                @if (checkoutForm.get('lastName')?.invalid && (checkoutForm.get('lastName')?.dirty || checkoutForm.get('lastName')?.touched)) {
                                  <p class="field__error">Nom requis</p>
                                }
                              </div>
                            </div>

                            <div class="form-row">
                              <div class="field">
                                <label class="field__label" for="gouvernorat">Gouvernorat *</label>
                                <select 
                                  id="gouvernorat"
                                  formControlName="gouvernorat" 
                                  class="field__input"
                                >
                                  <option value="">Sélectionnez un gouvernorat</option>
                                  @for (gouv of gouvernorats; track gouv) {
                                    <option [value]="gouv">{{ gouv }}</option>
                                  }
                                </select>
                                @if (checkoutForm.get('gouvernorat')?.invalid && (checkoutForm.get('gouvernorat')?.dirty || checkoutForm.get('gouvernorat')?.touched)) {
                                  <p class="field__error">Gouvernorat requis</p>
                                }
                              </div>
                              <div class="field">
                                <label class="field__label" for="ville">Ville *</label>
                                <select 
                                  id="ville"
                                  formControlName="ville" 
                                  class="field__input"
                                >
                                  <option value="">Sélectionnez une ville</option>
                                  @for (ville of villes; track ville) {
                                    <option [value]="ville">{{ ville }}</option>
                                  }
                                </select>
                                @if (checkoutForm.get('ville')?.invalid && (checkoutForm.get('ville')?.dirty || checkoutForm.get('ville')?.touched)) {
                                  <p class="field__error">Ville requise</p>
                                }
                              </div>
                            </div>

                            <div class="form-row">
                                <div class="field">
                                    <label class="field__label" for="codePostal">Code Postal *</label>
                                    <input 
                                        type="text" 
                                        id="codePostal"
                                        formControlName="codePostal" 
                                        class="field__input"
                                        placeholder="Code postal"
                                    >
                                    @if (checkoutForm.get('codePostal')?.invalid && (checkoutForm.get('codePostal')?.dirty || checkoutForm.get('codePostal')?.touched)) {
                                        <p class="field__error">Code postal requis</p>
                                    }
                                </div>
                                <div class="field">
                                    <label class="field__label" for="phone">Téléphone *</label>
                                    <input 
                                        type="tel" 
                                        id="phone"
                                        formControlName="phone" 
                                        class="field__input"
                                        placeholder="Numéro de téléphone (8 chiffres)"
                                    >
                                    @if (checkoutForm.get('phone')?.invalid && (checkoutForm.get('phone')?.dirty || checkoutForm.get('phone')?.touched)) {
                                        @if (checkoutForm.get('phone')?.hasError('required')) {
                                            <p class="field__error">Téléphone requis</p>
                                        }
                                        @if (checkoutForm.get('phone')?.hasError('pattern')) {
                                            <p class="field__error">Numéro de téléphone doit comporter exactement 8 chiffres</p>
                                        }
                                    }
                                </div>
                            </div>

                            <div class="field">
                              <label class="field__label" for="address">Adresse *</label>
                              <textarea 
                                id="address"
                                formControlName="address" 
                                rows="3" 
                                class="field__input field__input--textarea"
                                placeholder="Votre adresse complète"
                              ></textarea>
                              @if (checkoutForm.get('address')?.invalid && (checkoutForm.get('address')?.dirty || checkoutForm.get('address')?.touched)) {
                                <p class="field__error">Adresse requise</p>
                              }
                            </div>

                            <div class="field">
                              <label class="field__label" for="email">Email (optionnel)</label>
                              <input 
                                type="email" 
                                id="email"
                                formControlName="email" 
                                class="field__input"
                                placeholder="votre@email.com"
                              >
                            </div>
                          </form>
                        </div>
                      </div>

                      <!-- Order Summary -->
                      <div class="checkout-summary">
                        <div class="summary-card">                          
                          <div class="summary-items">
                            <div class="summary-item">
                              <div class="summary-item__info">                                <div class="product__quantity">
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
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"></line>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="summary-totals">
            <div class="summary-total">
              <span class="summary-total__label">Sous-total</span>
              <span class="summary-total__value">{{ subtotal.toFixed(2) }} TND</span>
            </div>
            <div class="summary-total">
              <span class="summary-total__label">Livraison</span>
              <span class="summary-total__value">{{ deliveryFee.toFixed(2) }} TND</span>
            </div>
            <div class="summary-total summary-total--final">
              <span class="summary-total__label">Total</span>
              <span class="summary-total__value">{{ total.toFixed(2) }} TND</span>
            </div>
          </div>

                          <!-- Trust Badges -->
                          
                        </div>
                      </div>
                    </div>

                    <!-- ✅ CTA bouton — toujours EN DERNIER, après la summary et le formulaire -->
                    <div class="checkout-cta">
                        @if (submitError) {
                            <p class="checkout-cta__error">{{ submitError }}</p>
                        }
                        <button 
                            type="button"
                            (click)="onSubmit()"
                            class="btn btn--primary btn--large btn--full"
                            [disabled]="isLoading || checkoutForm.invalid"
                        >
                            @if (isLoading) {
                                <span class="spinner"></span>
                                Traitement en cours...
                            } @else {
                                Valider ma commande
                            }
                        </button>
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
                        <span class="price">{{ product.sellingPriceTTC.toFixed(2) }} TND</span>
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
    /* Splash screen */
    .ventila-splash {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      z-index: 9999;
      gap: 28px;
    }
    .ventila-splash__logo {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #111111;
    }
    .ventila-splash__logo span { color: #b08d6a; }
    .ventila-splash__bar {
      width: 160px;
      height: 3px;
      background: #f0ede8;
      border-radius: 99px;
      overflow: hidden;
    }
    .ventila-splash__bar-inner {
      height: 100%;
      width: 40%;
      background: #b08d6a;
      border-radius: 99px;
      animation: splash-slide 1.2s ease-in-out infinite;
    }
    @keyframes splash-slide {
      0%   { transform: translateX(-100%); }
      50%  { transform: translateX(250%); }
      100% { transform: translateX(250%); }
    }
    .hidden { visibility: hidden; }

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
      overflow: hidden;
      border-radius: 0;
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

    .btn--primary:hover:not(:disabled) {
      background: #374151;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(17, 24, 39, 0.25);
    }

    .btn--primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn--primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      opacity: 0.6;
      box-shadow: none;
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
      position: fixed;
      top: 1rem;
      right: 1rem;
      width: 48px;
      height: 48px;
      border: none;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
      z-index: 1001;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .lightbox__close:hover {
      background: rgba(239, 68, 68, 1);
      transform: scale(1.1);
    }

    .lightbox__close:active {
      transform: scale(0.95);
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

    /* Checkout Layout */
    .checkout-layout {
      display: grid;
      grid-template-columns: 1.2fr 420px;
      gap: 3rem;
      margin-top: 1rem;
    }

    .product__divider--wide {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb 10%, #e5e7eb 90%, transparent);
      margin: 1.5rem 0;
    }

    /* Form Section */
    .form-section {
      background: #ffffff;
      padding: 2.25rem;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .form-section__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1.75rem;
    }

    /* Form */
    .form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    /* Field */
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .field__label {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #374151;
    }

    .field__input {
      width: 100%;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #ffffff;
      color: #111827;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
    }

    .field__input:focus {
      outline: none;
      border-color: #111827;
      box-shadow: 0 0 0 4px rgba(17, 24, 39, 0.08);
    }

    select.field__input {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1.25rem;
      padding-right: 2.5rem;
      cursor: pointer;
    }

    .field__input::placeholder {
      color: #9ca3af;
    }

    .field__input--textarea {
      resize: vertical;
      min-height: 80px;
    }

    .field__error {
      font-size: 0.8125rem;
      color: #dc2626;
      margin: 0;
    }

    /* Form Actions */
    .form-actions {
      margin-top: 1.5rem;
    }

    .btn--large {
      padding: 1.125rem 2.5rem;
      font-size: 1.0625rem;
    }

    .btn--full {
      width: 100%;
    }

    /* Spinner */
    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Checkout Summary */
    .checkout-summary {
      position: sticky;
      top: 5rem;
      align-self: start;
    }

    .summary-card {
      background: #ffffff;
      padding: 2rem;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    .summary-card__title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1.5rem;
      color: #111827;
    }

    .summary-items {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .summary-item__info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .summary-item__name {
      color: #111827;
      font-weight: 500;
      font-size: 0.9375rem;
      line-height: 1.4;
    }

    .summary-item__price {
      color: #111827;
      font-weight: 600;
      font-size: 0.9375rem;
    }

    .summary-totals {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      color: #6b7280;
      font-size: 0.9375rem;
    }

    .summary-total__label {
      font-weight: 500;
    }

    .summary-total__value {
      font-weight: 600;
      color: #111827;
    }

    .summary-total--final {
      color: #111827;
      font-size: 1.25rem;
      font-weight: 700;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
      margin-top: 0.25rem;
    }

    .summary-total--final .summary-total__value {
      font-weight: 700;
    }

    /* Trust Badges */
    .trust-badges {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      margin-top: 1.5rem;
    }

    .trust-badge {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .trust-badge svg {
      color: #22c55e;
      flex-shrink: 0;
    }

    /* ==============================
       RESPONSIVE — Mobile First
       ============================== */

    /* Tablet landscape (≤1200px) */
    @media (max-width: 1200px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      /* Collapse checkout to full-width column */
      .checkout-layout {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .checkout-summary {
        position: static;
        order: -1; /* summary card appears above the form */
      }
    }

    /* Tablet portrait (≤1024px) */
    @media (max-width: 1024px) {
      .product__grid {
        gap: 2rem;
      }
      .collection__content {
        padding: 2rem 0;
      }
    }

    /* Small tablet / large phone (≤900px) */
    @media (max-width: 900px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
      }

      .collection__title {
        font-size: 2rem;
      }

      .collection__hero {
        height: 380px;
      }

      /* Stack product image + info vertically */
      .product__grid {
        grid-template-columns: 1fr;
        gap: 1.75rem;
      }

      .product__media {
        position: static;
      }

      .product__features {
        grid-template-columns: 1fr;
      }

      /* Checkout layout already 1-col from 1200px,
         but make summary non-sticky on tablet too */
      .checkout-summary {
        position: static;
        order: -1;
      }
    }

    /* Mobile (≤768px) */
    @media (max-width: 768px) {
      /* Container padding tighter on mobile */
      .container {
        padding: 0 1rem;
      }

      /* Hero */
      .collection__hero {
        height: 320px;
      }

      /* Lightbox close button - bigger and more visible on mobile */
      .lightbox__close {
        top: 1.5rem;
        right: 1.5rem;
        width: 56px;
        height: 56px;
      }

      .lightbox__close svg {
        width: 28px;
        height: 28px;
      }

      /* Product page top padding */
      .product-page {
        padding: 0 0 2.5rem;
      }

      /* Title + price scale down */
      .product__title {
        font-size: 1.625rem;
        margin-bottom: 0.75rem;
      }

      .product__price {
        font-size: 1.625rem;
      }

      /* Image area */
      .product__media-main {
        padding: 1.25rem;
        border-radius: 16px;
      }

      .product__media-thumbnails {
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .product__media-thumbnail {
        width: 58px;
        height: 58px;
        border-radius: 10px;
        padding: 0.4rem;
      }

      /* Specs table readable on narrow screen */
      .product-specs {
        padding: 0.875rem 1rem;
      }

      .product-specs__row {
        grid-template-columns: 1fr;
        gap: 0.25rem;
        padding: 0.625rem 0;
      }

      .product-specs__value {
        text-align: left;
        font-weight: 700;
      }

      /* Action row — stack qty + button */
      .product__action-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
      }

      .product__quantity {
        width: 100%;
      }

      .quantity-selector {
        width: 100%;
        justify-content: space-between;
        border-radius: 12px;
      }

      .quantity-selector__btn {
        width: 52px;
        height: 52px;
      }

      .quantity-selector__value {
        flex: 1;
        font-size: 1.125rem;
      }

      /* Add-to-cart / submit button full width + taller for tap */
      .btn--primary {
        width: 100%;
        min-height: 52px;
        font-size: 1rem;
      }

      /* Checkout form: all rows become single column */
      .form-row {
        grid-template-columns: 1fr;
        gap: 0.875rem;
      }

      .form-section {
        padding: 1.25rem;
        border-radius: 16px;
      }

      .form-section__title {
        font-size: 1.1rem;
        margin-bottom: 1.25rem;
      }

      /* Inputs larger touch targets */
      .field__input {
        padding: 0.9375rem 1rem;
        font-size: 1rem; /* prevent iOS zoom */
        border-radius: 10px;
      }

      .field__label {
        font-size: 0.875rem;
      }

      /* Summary card */
      .summary-card {
        padding: 1.25rem;
        border-radius: 16px;
      }

      .summary-card__title {
        font-size: 1.1rem;
      }

      /* Trust badges: horizontal on mobile */
      .trust-badges {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.625rem;
        padding-top: 1rem;
        margin-top: 1rem;
      }

      .trust-badge {
        font-size: 0.8125rem;
      }

      /* Submit button in summary card */
      .form-actions {
        margin-top: 1rem;
      }

      /* Product card: hide overlay button on touch */
      .product-card__actions {
        display: none;
      }

      /* Divider wide: less vertical space */
      .product__divider--wide {
        margin: 2rem 0;
      }

      /* Checkout layout gap */
      .checkout-layout {
        gap: 1rem;
      }
    }

    /* Checkout CTA button area */
    .checkout-cta {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
    }

    .checkout-cta .btn--large {
      width: 100%;
      max-width: 500px;
      padding: 1.25rem 3rem;
      font-size: 1.125rem;
    }

    /* Small phones (≤480px) */
    @media (max-width: 480px) {
      .collection__hero {
        height: 240px;
      }

      .collection__title {
        font-size: 1.625rem;
      }

      /* 2-col grid compressed for tiny phones */
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .product-card__title {
        font-size: 0.875rem;
      }

      .product-card__price .price {
        font-size: 1rem;
      }

      .product__title {
        font-size: 1.375rem;
      }

      .product__price {
        font-size: 1.5rem;
      }

      /* Full bleed image on tiny screens */
      .product__media-main {
        border-radius: 12px;
        padding: 1rem;
      }

      .product__media-thumbnail {
        width: 52px;
        height: 52px;
      }

      /* Form: comfortable on tiny screen */
      .form-section {
        padding: 1rem;
        border-radius: 12px;
      }

      .summary-card {
        padding: 1rem;
        border-radius: 12px;
      }

      /* Bigger tap area for quantity buttons */
      .quantity-selector__btn {
        width: 48px;
        height: 48px;
      }

      /* Collection content less padding */
      .collection__content {
        padding: 1.5rem 0;
      }
    }

    /* Spinner */
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-right: 6px;
      vertical-align: middle;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .checkout-cta__error {
      color: #c62828;
      background: #ffebee;
      border: 1px solid #ef9a9a;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.875rem;
      margin-bottom: 12px;
      text-align: center;
      width: 100%;
      max-width: 500px;
    }
  `]
})
export class ProductCatalogComponent implements OnInit, AfterViewInit {
  products = signal<Product[]>([]);
  selectedImage = '';
  quantity = signal(1);
  isLightboxOpen = false;
  lightboxImage = '';
  currentImageIndex = 0;
  checkoutForm!: FormGroup;

  // Liste des gouvernorats tunisiens avec leurs villes
  gouvernoratsVilles: { [key: string]: string[] } = {
    'Ariana': ['Ariana', 'La Soukra', 'Raoued', 'Ettadhamen', 'Mnihla'],
    'Béja': ['Béja', 'Medjez El Bab', 'Téboursouk', 'Testour', 'Amdoun'],
    'Ben Arous': ['Ben Arous', 'Hammam Chott', 'Fouchana', 'Mornag', 'Rades'],
    'Bizerte': ['Bizerte', 'Mateur', 'Menzel Bourguiba', 'Jendouba', 'El Alia'],
    'Gabès': ['Gabès', 'Mareth', 'Matmata', 'El Hamma', 'Oudhref'],
    'Gafsa': ['Gafsa', 'Tozeur', 'Metlaoui', 'Sidi Bouzid', 'Ksar'],
    'Jendouba': ['Jendouba', 'Béja', 'Tabarka', 'Ain Draham', 'Fernana'],
    'Kairouan': ['Kairouan', 'Sousse', 'Sidi Bouzid', 'Haffouz', 'Alaa'],
    'Kasserine': ['Kasserine', 'Sidi Bouzid', 'Feriana', 'Thala', 'Hassi El Ferid'],
    'Kebili': ['Kebili', 'Douz', 'El Oued', 'Nefza', 'Tolga'],
    'Kef': ['Le Kef', 'Kalaat Khasba', 'Jendouba', 'Sers', 'Nebeur'],
    'Mahdia': ['Mahdia', 'Sousse', 'Monastir', 'Ksar Hellal', 'Ouled Chamekh'],
    'Manouba': ['Manouba', 'La Manouba', 'Oued Ellil', 'Mornaguia', 'Borj El Amri'],
    'Médenine': ['Médenine', 'Djerba', 'Zarzis', 'Ben Gardane', 'Tataouine'],
    'Monastir': ['Monastir', 'Sousse', 'Mahdia', 'Ksar Hellal', 'Moknine'],
    'Nabeul': ['Nabeul', 'Hammamet', 'Kelibia', 'Menzel Bourguiba', 'Bizerte'],
    'Sfax': ['Sfax', 'Sakiet Eddaïer', 'El Hamma', 'Kerkennah', 'Menzel Chaker'],
    'Sidi Bouzid': ['Sidi Bouzid', 'Kasserine', 'Sbeitla', 'Regueb', 'Menzel Bouzaiane'],
    'Siliana': ['Siliana', 'Le Kef', 'Maktar', 'Bou Arada', 'El Aroussa'],
    'Sousse': ['Sousse', 'Monastir', 'Mahdia', 'Hammam Sousse', 'Akouda'],
    'Tataouine': ['Tataouine', 'Djerba', 'Médenine', 'Chenini', 'Tamezret'],
    'Tozeur': ['Tozeur', 'Nefta', 'Gafsa', 'Tamerza', 'Midès'],
    'Tunis': ['Tunis', 'Ariana', 'Ben Arous', 'La Marsa', 'Carthage'],
    'Zaghouan': ['Zaghouan', 'Nabeul', 'Mateur', 'Bir Mchergua', 'El Fahs']
  };

  // Villes du gouvernorat sélectionné
  villes: string[] = [];

  // Liste des gouvernorats pour le template
  get gouvernorats(): string[] {
    return Object.keys(this.gouvernoratsVilles);
  }

  get subtotal(): number {
    if (this.products().length === 0) return 0;
    return this.products()[0].sellingPriceTTC * this.quantity();
  }

  get deliveryFee(): number {
    return this._deliveryFee;
  }

  get total(): number {
    return this.subtotal + this.deliveryFee;
  }

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private logService: LogService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private settingService: SettingService
  ) {
    effect(() => {
      if (this.products().length === 1) {
        const p = this.products()[0];
        if (p.imageUrls && p.imageUrls.length > 0) {
          this.selectedImage = p.imageUrls[0];
        }
      }
    });
  }

  ngAfterViewInit() {
    // Force muted sur la vidéo (certains navigateurs ignorent l'attribut HTML)
    if (this.heroVideoRef?.nativeElement) {
      const video = this.heroVideoRef.nativeElement;
      video.muted = true;
      video.play().catch(() => {});
    }
  }

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gouvernorat: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email: ['']
    });

    // Écouter les changements du gouvernorat pour mettre à jour les villes
    this.checkoutForm.get('gouvernorat')?.valueChanges.subscribe((selectedGouvernorat) => {
      this.villes = this.gouvernoratsVilles[selectedGouvernorat] || [];
      this.checkoutForm.get('ville')?.setValue('');
    });

    this.productService.getAll().subscribe({
      next: (res) => {
        const activeProducts = res.filter(p => p.active !== false);
        this.products.set(activeProducts);
        this.pageLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.pageLoading.set(false);
      }
    });

    this.settingService.getDeliveryFee().subscribe({
      next: (fee) => this._deliveryFee = fee,
      error: () => {} // garde la valeur par défaut (8)
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

  isLoading = false;
  submitError: string | null = null;
  private _deliveryFee = 8;
  pageLoading = signal(true);

  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  onSubmit() {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.submitError = null;

        const formVal = this.checkoutForm.value;

        const items: { [key: number]: number } = {};
        if (this.products().length > 0) {
            items[this.products()[0].id] = this.quantity();
        }

        const request: CheckoutRequest = {
            firstName: formVal.firstName,
            lastName: formVal.lastName,
            address: formVal.address,
            city: formVal.ville,
            governorate: formVal.gouvernorat,
            phone: formVal.phone,
            email: formVal.email || undefined,
            items
        };

        this.orderService.checkout(request).subscribe({
            next: (order) => {
                this.logService.log('CHECKOUT', 'Order placed successfully', { orderId: order.id });
                this.cartService.clear();
                this.router.navigate(['/order-success'], { state: { order } });
            },
            error: (err) => {
                this.isLoading = false;
                this.submitError = 'Une erreur est survenue. Veuillez réessayer.';
                console.error('Checkout error:', err);
                this.logService.log('ERROR', `Checkout failed: ${err.message}`, err);
            }
        });
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
