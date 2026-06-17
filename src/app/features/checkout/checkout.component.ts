import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { CheckoutRequest } from '../../core/models/ecommerce.models';

@Component({
    selector: 'cli-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterModule],
    template: `
        <div class="checkout-container">
            <div class="back-button">
                <a routerLink="/cart" class="back-link">← Retour au panier</a>
            </div>

            <h1>Finaliser votre commande</h1>

            <div class="checkout-content">
                <div class="checkout-form">
                    <h2>Informations de livraison</h2>
                    <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Prénom *</label>
                                <input type="text" formControlName="firstName" required>
                            </div>
                            <div class="form-group">
                                <label>Nom *</label>
                                <input type="text" formControlName="lastName" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Adresse *</label>
                            <textarea formControlName="address" rows="3" required></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Téléphone *</label>
                                <input type="tel" formControlName="phone" required>
                            </div>
                            <div class="form-group">
                                <label>Email (optionnel)</label>
                                <input type="email" formControlName="email">
                            </div>
                        </div>

                        <button type="submit" class="submit-btn" [disabled]="checkoutForm.invalid || isSubmitting">
                            {{ isSubmitting ? 'Envoi en cours...' : 'Confirmer la commande' }}
                        </button>
                    </form>
                </div>

                <div class="order-summary">
                    <h2>Récapitulatif</h2>
                    <div class="cart-items">
                        @for (item of cart.items(); track item.product.id) {
                            <div class="summary-item">
                                <div class="item-info">
                                    <span class="item-name">{{ item.product.name }}</span>
                                    <span class="item-quantity">x{{ item.quantity }}</span>
                                </div>
                                <span class="item-price">{{ item.product.sellingPriceTTC * item.quantity | currency:'EUR' }}</span>
                            </div>
                        }
                    </div>
                    <div class="summary-totals">
                        <div class="total-row">
                            <span>Sous-total</span>
                            <span>{{ cart.subtotal() | currency:'EUR' }}</span>
                        </div>
                        <div class="total-row">
                            <span>TVA (20%)</span>
                            <span>{{ cart.tax() | currency:'EUR' }}</span>
                        </div>
                        <div class="total-row final">
                            <span>Total</span>
                            <span>{{ cart.total() | currency:'EUR' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .checkout-container {
            max-width: 1000px;
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

        h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 40px;
        }

        .checkout-content {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 40px;
        }

        .checkout-form h2,
        .order-summary h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 24px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
            font-size: 0.875rem;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #111827;
        }

        .submit-btn {
            width: 100%;
            background: #111827;
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease;
            margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
            background: #374151;
        }

        .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .order-summary {
            background: #f9fafb;
            border-radius: 12px;
            padding: 24px;
            height: fit-content;
        }

        .cart-items {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }

        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .item-info {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .item-name {
            color: #111827;
            font-weight: 500;
        }

        .item-quantity {
            color: #6b7280;
        }

        .item-price {
            color: #111827;
            font-weight: 600;
        }

        .summary-totals {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            color: #6b7280;
        }

        .total-row.final {
            color: #111827;
            font-size: 1.25rem;
            font-weight: 700;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 1024px) {
            .checkout-content {
                grid-template-columns: 1fr;
            }
            
            .order-summary {
                order: -1;
            }
        }

        @media (max-width: 640px) {
            .form-row {
                grid-template-columns: 1fr;
            }
        }
    `]
})
export class CheckoutComponent implements OnInit {
    checkoutForm!: FormGroup;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        public cart: CartService,
        private orderService: OrderService,
        private router: Router
    ) {}

    ngOnInit() {
        this.checkoutForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            address: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['']
        });

        if (this.cart.items().length === 0) {
            this.router.navigate(['/']);
        }
    }

    onSubmit() {
        if (this.checkoutForm.invalid) return;

        this.isSubmitting = true;

        const items: { [key: number]: number } = {};
        for (const item of this.cart.items()) {
            items[item.product.id] = item.quantity;
        }

        const request: CheckoutRequest = {
            ...this.checkoutForm.value,
            items
        };

        this.orderService.checkout(request).subscribe({
            next: () => {
                this.cart.clear();
                this.router.navigate(['/'], { queryParams: { orderSuccess: 'true' } });
            },
            error: (err) => {
                console.error('Checkout error:', err);
                this.isSubmitting = false;
            }
        });
    }
}
