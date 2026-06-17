import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
    selector: 'cli-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, CurrencyPipe],
    template: `
        <div class="cart-container">
            <div class="back-button">
                <a routerLink="/" class="back-link">← Retour</a>
            </div>

            <div class="cart-header">
                <h1>Panier</h1>
                @if (cart.items().length > 0) {
                    <span class="item-count">{{ cart.count() }} produit{{ cart.count() > 1 ? 's' : '' }}</span>
                }
            </div>

            @if (orderSuccess) {
                <div class="success-banner">
                    <p>✓ Commande confirmée avec succès !</p>
                </div>
            }

            @if (cart.items().length > 0) {
                <div class="cart-content">
                    <div class="cart-items">
                        @for (item of cart.items(); track item.product.id) {
                            <div class="cart-item">
                                <div class="item-image">
                                    @if (item.product.imageUrls && item.product.imageUrls.length > 0) {
                                        <img [src]="item.product.imageUrls[0]" [alt]="item.product.name">
                                    }
                                </div>
                                
                                <div class="item-details">
                                    <div class="item-info">
                                        <h3>{{ item.product.name }}</h3>
                                        <p class="price">{{ item.product.sellingPriceTTC | currency:'EUR' }} TTC</p>
                                    </div>
                                    
                                    <div class="item-actions">
                                        <div class="qty-controls">
                                            <button class="qty-btn" (click)="updateQty(item.product.id, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                                            <span class="qty-display">{{ item.quantity }}</span>
                                            <button class="qty-btn" (click)="updateQty(item.product.id, item.quantity + 1)">+</button>
                                        </div>
                                        <button class="remove-btn" (click)="remove(item.product.id)">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19 7L18 19H6L5 7M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7M15.5 11H8.5M15.5 15H8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="item-total">
                                    <span class="total-price">{{ (item.product.sellingPriceTTC * item.quantity) | currency:'EUR' }}</span>
                                </div>
                            </div>
                        }
                    </div>

                    <div class="cart-sidebar">
                        <div class="summary-card">
                            <h2>Récapitulatif</h2>
                            
                            <div class="summary-line">
                                <span class="label">Sous-total</span>
                                <span class="value">{{ cart.subtotal() | currency:'EUR' }}</span>
                            </div>
                            
                            <div class="summary-line">
                                <span class="label">TVA (20%)</span>
                                <span class="value">{{ cart.tax() | currency:'EUR' }}</span>
                            </div>
                            
                            <div class="summary-line total">
                                <span class="label">Total TTC</span>
                                <span class="value">{{ cart.total() | currency:'EUR' }}</span>
                            </div>

                            <a routerLink="/checkout" class="checkout-btn">
                                Procéder au paiement
                                <span class="btn-arrow">→</span>
                            </a>

                            <a routerLink="/" class="continue-btn">Continuer mes achats</a>
                        </div>
                    </div>
                </div>
            } @else {
                <div class="empty-state">
                    <div class="empty-icon">🛒</div>
                    <h2>Votre panier est vide</h2>
                    <p>Commencez vos achats et ajoutez des articles à votre panier.</p>
                    <a routerLink="/" class="start-btn">Commencer mes achats</a>
                </div>
            }
        </div>
    `,
    styles: [`
        .cart-container {
            max-width: 1200px;
        }

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

        .cart-header {
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .cart-header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #111827;
        }

        .item-count {
            color: #6b7280;
            font-weight: 500;
            font-size: 0.875rem;
        }

        .success-banner {
            margin-bottom: 32px;
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            padding: 16px 24px;
            border-radius: 8px;
        }

        .success-banner p {
            color: #059669;
            font-weight: 600;
            text-align: center;
            margin: 0;
        }

        .cart-content {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 40px;
        }

        .cart-items {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .cart-item {
            background: white;
            padding: 20px;
            border-radius: 12px;
            display: flex;
            gap: 20px;
            align-items: center;
            border: 1px solid #e5e7eb;
        }

        .item-image {
            width: 100px;
            height: 100px;
            background: #f9fafb;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
        }

        .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .item-details {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
        }

        .item-info h3 {
            font-size: 1rem;
            font-weight: 600;
            color: #111827;
            margin: 0 0 4px 0;
        }

        .item-info .price {
            color: #6b7280;
            font-weight: 500;
            font-size: 0.875rem;
            margin: 0;
        }

        .item-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .qty-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .qty-btn {
            width: 36px;
            height: 36px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            background: white;
            font-weight: 600;
            font-size: 1.125rem;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #111827;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .qty-btn:hover:not(:disabled) {
            border-color: #d1d5db;
            background: #f9fafb;
        }

        .qty-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .qty-display {
            font-weight: 600;
            font-size: 1rem;
            min-width: 24px;
            text-align: center;
        }

        .remove-btn {
            background: #fef2f2;
            border: none;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            color: #ef4444;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .remove-btn:hover {
            background: #fee2e2;
        }

        .item-total {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .total-price {
            font-size: 1.125rem;
            font-weight: 700;
            color: #111827;
        }

        .cart-sidebar {
            position: sticky;
            top: 120px;
            align-self: start;
        }

        .summary-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }

        .summary-card h2 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #111827;
        }

        .summary-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 0.875rem;
            color: #6b7280;
        }

        .summary-line .label {
            font-weight: 500;
        }

        .summary-line .value {
            font-weight: 600;
            color: #111827;
        }

        .summary-line.total {
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            margin-top: 8px;
            font-size: 1.125rem;
            color: #111827;
        }

        .summary-line.total .value {
            font-weight: 700;
        }

        .checkout-btn {
            width: 100%;
            margin-top: 24px;
            padding: 14px 24px;
            border-radius: 8px;
            border: none;
            background: #111827;
            color: white;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
        }

        .checkout-btn:hover {
            background: #374151;
        }

        .continue-btn {
            display: block;
            width: 100%;
            margin-top: 12px;
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            background: white;
            color: #111827;
            font-weight: 500;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s ease;
            font-size: 0.875rem;
        }

        .continue-btn:hover {
            border-color: #d1d5db;
            background: #f9fafb;
        }

        .empty-state {
            text-align: center;
            padding: 80px 40px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 24px;
            opacity: 0.3;
        }

        .empty-state h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            color: #111827;
        }

        .empty-state p {
            color: #6b7280;
            font-size: 1rem;
            margin-bottom: 32px;
        }

        .start-btn {
            display: inline-block;
            background: #111827;
            color: white;
            padding: 12px 28px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        .start-btn:hover {
            background: #374151;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .cart-content {
                grid-template-columns: 1fr;
            }
            
            .cart-sidebar {
                position: static;
                order: -1;
            }
        }

        @media (max-width: 640px) {
            .cart-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
                margin-bottom: 24px;
            }
            
            .cart-header h1 {
                font-size: 1.5rem;
            }
            
            .cart-item {
                padding: 16px;
                gap: 12px;
                flex-wrap: wrap;
            }
            
            .item-image {
                width: 80px;
                height: 80px;
            }
            
            .item-details {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            
            .item-actions {
                width: 100%;
                justify-content: space-between;
            }
            
            .item-total {
                width: 100%;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding-top: 12px;
                border-top: 1px solid #e5e7eb;
            }
            
            .summary-card {
                padding: 20px;
            }
            
            .empty-state {
                padding: 60px 20px;
            }
            
            .empty-icon {
                font-size: 3rem;
            }
            
            .empty-state h2 {
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
