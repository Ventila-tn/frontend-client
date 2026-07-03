import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'cli-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, CurrencyPipe],
    template: `
        <div class="cart-page">
            <div class="container">
                <!-- Breadcrumb -->
                <nav class="breadcrumb" aria-label="Fil d'Ariane">
                    <ol class="breadcrumb__list">
                        <li class="breadcrumb__item">
                            <a routerLink="/" class="breadcrumb__link">Accueil</a>
                        </li>
                        <li class="breadcrumb__item breadcrumb__item--current">
                            <span class="breadcrumb__text">Panier</span>
                        </li>
                    </ol>
                </nav>

                <!-- Order Success Banner -->
                @if (orderSuccess) {
                    <div class="alert alert--success">
                        <svg class="alert__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Commande confirmée avec succès !
                    </div>
                }

                <!-- Page Header -->
                <div class="cart-page__header">
                    <h1 class="cart-page__title">Votre panier</h1>
                    @if (cart.items().length > 0) {
                        <span class="cart-page__count">{{ cart.count() }} produit{{ cart.count() > 1 ? 's' : '' }}</span>
                    }
                </div>

                <!-- Cart Content -->
                @if (cart.items().length > 0) {
                    <div class="cart-layout">
                        <!-- Cart Items -->
                        <div class="cart-items">
                            @for (item of cart.items(); track item.product.id) {
                                <div class="cart-item">
                                    <div class="cart-item__image">
                                        @if (item.product.imageUrls && item.product.imageUrls.length > 0) {
                                            <img [src]="item.product.imageUrls[0]" [alt]="item.product.name">
                                        } @else {
                                            <div class="image-placeholder">
                                                <span class="placeholder-icon">🌬️</span>
                                            </div>
                                        }
                                    </div>
                                    
                                    <div class="cart-item__details">
                                        <div class="cart-item__info">
                                            <h3 class="cart-item__title">{{ item.product.name }}</h3>
                                            <p class="cart-item__price">{{ item.product.sellingPriceTTC | currency:'TND':'symbol':'1.2-2' }} TTC</p>
                                        </div>
                                        
                                        <div class="cart-item__actions">
                                            <div class="quantity-selector">
                                                <button 
                                                    class="quantity-selector__button" 
                                                    (click)="updateQty(item.product.id, item.quantity - 1)" 
                                                    [disabled]="item.quantity <= 1"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    </svg>
                                                </button>
                                                <span class="quantity-selector__value">{{ item.quantity }}</span>
                                                <button 
                                                    class="quantity-selector__button" 
                                                    (click)="updateQty(item.product.id, item.quantity + 1)"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                            <button class="cart-item__remove" (click)="remove(item.product.id)" aria-label="Supprimer l'article">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M19 7L18 19H6L5 7M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7M15.5 11H8.5M15.5 15H8.5"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="cart-item__total">
                                        <span class="cart-item__total-price">{{ (item.product.sellingPriceTTC * item.quantity) | currency:'TND':'symbol':'1.2-2' }}</span>
                                    </div>
                                </div>
                            }
                        </div>

                        <!-- Order Summary -->
                        <div class="cart-summary">
                            <div class="summary-card">
                                <h2 class="summary-card__title">Récapitulatif</h2>
                                
                                <div class="summary-lines">
                                    <div class="summary-line">
                                        <span class="summary-line__label">Sous-total</span>
                                        <span class="summary-line__value">{{ cart.subtotal() | currency:'TND':'symbol':'1.2-2' }}</span>
                                    </div>
                                    
                                    <div class="summary-line">
                                        <span class="summary-line__label">TVA</span>
                                        <span class="summary-line__value">{{ cart.tax() | currency:'TND':'symbol':'1.2-2' }}</span>
                                    </div>
                                    
                                    <div class="summary-line summary-line--total">
                                        <span class="summary-line__label">Total TTC</span>
                                        <span class="summary-line__value">{{ cart.total() | currency:'TND':'symbol':'1.2-2' }}</span>
                                    </div>
                                </div>

                                <div class="summary-actions">
                                    <a routerLink="/checkout" class="btn btn--primary btn--large btn--full">
                                        Procéder au paiement
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </a>

                                    <a routerLink="/" class="btn btn--outline btn--full">
                                        Continuer mes achats
                                    </a>
                                </div>

                                <!-- Trust Badges -->

                            </div>
                        </div>
                    </div>
                } @else {
                    <div class="empty-cart">
                        <div class="empty-cart__icon">🛒</div>
                        <h2 class="empty-cart__title">Votre panier est vide</h2>
                        <p class="empty-cart__text">Commencez vos achats et ajoutez des articles à votre panier.</p>
                        <a routerLink="/" class="btn btn--primary btn--large">
                            Commencer mes achats
                        </a>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        /* Cart Page */
        .cart-page {
            padding: 2rem 0 4rem;
        }

        .breadcrumb {
            margin-bottom: 2rem;
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
            font-size: 0.875rem;
        }

        .breadcrumb__item:not(:last-child)::after {
            content: '/';
            color: var(--color-gray-400);
        }

        .breadcrumb__link {
            color: var(--color-gray-600);
            text-decoration: none;
            transition: color var(--transition-base);
        }

        .breadcrumb__link:hover {
            color: var(--color-base-text);
        }

        .breadcrumb__text {
            color: var(--color-base-text);
            font-weight: 500;
        }

        /* Alert */
        .alert {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.25rem;
            border-radius: var(--radius-md);
            margin-bottom: 2rem;
        }

        .alert--success {
            background: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }

        .alert__icon {
            flex-shrink: 0;
            color: #059669;
        }

        /* Page Header */
        .cart-page__header {
            margin-bottom: 2.5rem;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 1rem;
        }

        .cart-page__title {
            font-size: 2.25rem;
            font-weight: 600;
            margin: 0;
            color: var(--color-base-text);
        }

        .cart-page__count {
            color: var(--color-gray-600);
            font-weight: 500;
            font-size: 0.875rem;
        }

        /* Cart Layout */
        .cart-layout {
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 3rem;
        }

        /* Cart Items */
        .cart-items {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .cart-item {
            background: var(--color-base-background-1);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-base-border);
            display: flex;
            gap: 1.25rem;
            align-items: flex-start;
        }

        .cart-item__image {
            width: 120px;
            height: 120px;
            background: var(--color-gray-100);
            border-radius: var(--radius-md);
            overflow: hidden;
            flex-shrink: 0;
        }

        .cart-item__image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .placeholder-icon {
            font-size: 2.5rem;
            opacity: 0.3;
        }

        .cart-item__details {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 1.5rem;
        }

        .cart-item__info {
            flex: 1;
        }

        .cart-item__title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--color-base-text);
            margin: 0 0 0.5rem;
            line-height: 1.4;
        }

        .cart-item__price {
            color: var(--color-gray-600);
            font-weight: 500;
            font-size: 0.875rem;
            margin: 0;
        }

        .cart-item__actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        /* Quantity Selector */
        .quantity-selector {
            display: flex;
            align-items: center;
            gap: 0;
            border: 1px solid var(--color-base-border);
            border-radius: var(--radius-md);
            overflow: hidden;
        }

        .quantity-selector__button {
            width: 40px;
            height: 40px;
            border: none;
            background: var(--color-base-background-1);
            color: var(--color-base-text);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-base);
        }

        .quantity-selector__button:hover:not(:disabled) {
            background: var(--color-gray-100);
        }

        .quantity-selector__button:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .quantity-selector__value {
            font-weight: 600;
            font-size: 1rem;
            min-width: 36px;
            text-align: center;
            padding: 0 0.5rem;
        }

        .cart-item__remove {
            background: #fef2f2;
            border: none;
            padding: 0.625rem;
            border-radius: var(--radius-md);
            cursor: pointer;
            color: #ef4444;
            transition: all var(--transition-base);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cart-item__remove:hover {
            background: #fee2e2;
        }

        .cart-item__total {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            padding-top: 0.25rem;
        }

        .cart-item__total-price {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--color-base-text);
        }

        /* Cart Summary */
        .cart-summary {
            position: sticky;
            top: 6.5rem;
            align-self: start;
        }

        .summary-card {
            background: var(--color-base-background-1);
            padding: 1.75rem;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-base-border);
        }

        .summary-card__title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: var(--color-base-text);
        }

        .summary-lines {
            margin-bottom: 1.5rem;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-size: 0.9375rem;
            color: var(--color-gray-600);
        }

        .summary-line__label {
            font-weight: 500;
        }

        .summary-line__value {
            font-weight: 600;
            color: var(--color-base-text);
        }

        .summary-line--total {
            border-top: 1px solid var(--color-base-border);
            padding-top: 1rem;
            margin-top: 0.5rem;
            margin-bottom: 0;
            font-size: 1.25rem;
            color: var(--color-base-text);
        }

        .summary-line--total .summary-line__value {
            font-weight: 700;
        }

        .summary-actions {
            margin-bottom: 1.75rem;
        }

        .summary-actions .btn + .btn {
            margin-top: 0.75rem;
        }

        /* Trust Badges */
        .trust-badges {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--color-base-border);
        }

        .trust-badge {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            font-size: 0.875rem;
            color: var(--color-gray-600);
        }

        .trust-badge svg {
            color: var(--color-accent);
            flex-shrink: 0;
        }

        /* Empty Cart */
        .empty-cart {
            text-align: center;
            padding: 5rem 1.5rem;
            max-width: 500px;
            margin: 0 auto;
        }

        .empty-cart__icon {
            font-size: 5rem;
            margin-bottom: 1.5rem;
            opacity: 0.3;
        }

        .empty-cart__title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: var(--color-base-text);
        }

        .empty-cart__text {
            color: var(--color-gray-600);
            font-size: 1rem;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        /* Button Component */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-family: inherit;
            font-weight: 600;
            font-size: 1rem;
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            border: none;
            cursor: pointer;
            transition: all var(--transition-base);
            text-decoration: none;
        }

        .btn--primary {
            background: var(--color-base-text);
            color: var(--color-primary-contrast);
        }

        .btn--primary:hover {
            background: var(--color-gray-700);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .btn--outline {
            background: transparent;
            color: var(--color-base-text);
            border: 1px solid var(--color-base-border);
        }

        .btn--outline:hover {
            border-color: var(--color-base-text);
            background: var(--color-gray-50);
        }

        .btn--large {
            padding: 1.125rem 2.5rem;
            font-size: 1.0625rem;
        }

        .btn--full {
            width: 100%;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .cart-layout {
                grid-template-columns: 1fr;
            }
            
            .cart-summary {
                position: static;
                order: -1;
            }
        }

        @media (max-width: 768px) {
            .cart-page {
                padding: 1rem 0 3rem;
            }

            .breadcrumb {
                margin-bottom: 1.5rem;
            }

            .cart-page__header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25rem;
                margin-bottom: 1.75rem;
            }
            
            .cart-page__title {
                font-size: 1.75rem;
            }
            
            .cart-item {
                padding: 1.25rem;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .cart-item__image {
                width: 90px;
                height: 90px;
            }
            
            .cart-item__details {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .cart-item__actions {
                width: 100%;
                justify-content: space-between;
            }
            
            .cart-item__total {
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding-top: 1rem;
                border-top: 1px solid var(--color-base-border);
            }
            
            .summary-card {
                padding: 1.5rem;
            }
            
            .empty-cart {
                padding: 3.5rem 1rem;
            }
            
            .empty-cart__icon {
                font-size: 3.5rem;
            }
            
            .empty-cart__title {
                font-size: 1.25rem;
            }
        }
    `]
})
export class CartComponent implements OnInit {
    orderSuccess = false;

    constructor(public cart: CartService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['orderSuccess'] === 'true') {
                this.orderSuccess = true;
            }
        });
    }

    updateQty(productId: number, qty: number) {
        if (qty < 1) return;
        this.cart.updateQuantity(productId, qty);
    }

    remove(productId: number) {
        this.cart.removeFromCart(productId);
    }
}
