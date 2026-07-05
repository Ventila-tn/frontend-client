import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { LogService } from '../../core/services/log.service';
import { SettingService } from '../../core/services/setting.service';
import { CheckoutRequest } from '../../core/models/ecommerce.models';

@Component({
    selector: 'cli-checkout',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterModule],
    template: `
        <div class="checkout-page">
            <div class="container">
                <!-- Breadcrumb -->
                <nav class="breadcrumb" aria-label="Fil d'Ariane">
                    <ol class="breadcrumb__list">
                        <li class="breadcrumb__item">
                            <a routerLink="/" class="breadcrumb__link">Accueil</a>
                        </li>
                        <li class="breadcrumb__item">
                            <a routerLink="/cart" class="breadcrumb__link">Panier</a>
                        </li>
                        <li class="breadcrumb__item breadcrumb__item--current">
                            <span class="breadcrumb__text">Paiement</span>
                        </li>
                    </ol>
                </nav>

                <!-- Page Header -->
                <div class="checkout-page__header">
                    <h1 class="checkout-page__title">Finaliser votre commande</h1>
                </div>

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
                            <h2 class="summary-card__title">Récapitulatif</h2>
                            
                            <div class="summary-items">
                                @for (item of cart.items(); track item.product.id) {
                                    <div class="summary-item">
                                        <div class="summary-item__info">
                                            <span class="summary-item__name">{{ item.product.name }}</span>
                                            <div class="summary-item__qty-controls">
                                                <div class="quantity-selector">
                                                    <button 
                                                        class="quantity-selector__btn" 
                                                        (click)="updateQty(item.product.id, item.quantity - 1)" 
                                                        [disabled]="item.quantity <= 1"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                                            <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"></line>
                                                        </svg>
                                                    </button>
                                                    <span class="quantity-selector__value">{{ item.quantity }}</span>
                                                    <button 
                                                        class="quantity-selector__btn" 
                                                        (click)="updateQty(item.product.id, item.quantity + 1)"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                                            <line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round"></line>
                                                            <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"></line>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <span class="summary-item__price">{{ (item.product.sellingPriceTTC * item.quantity).toFixed(2) }} TND</span>
                                    </div>
                                }
                            </div>

                            <div class="summary-totals">
                                <div class="summary-total">
                                    <span class="summary-total__label">Sous-total</span>
                                    <span class="summary-total__value">{{ cart.subtotal().toFixed(2) }} TND</span>
                                </div>
                                <div class="summary-total">
                                    <span class="summary-total__label">Livraison</span>
                                    <span class="summary-total__value">{{ deliveryFee().toFixed(2) }} TND</span>
                                </div>
                                <div class="summary-total summary-total--final">
                                    <span class="summary-total__label">Total</span>
                                    <span class="summary-total__value">{{ (cart.subtotal() + deliveryFee()).toFixed(2) }} TND</span>
                                </div>
                            </div>

                            <!-- Trust Badges -->
                            <div class="trust-badges">
                                <div class="trust-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    <span>Paiement sécurisé</span>
                                </div>
                                <div class="trust-badge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span>Livraison rapide</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CTA bouton — TOUJOURS EN DERNIER, après le formulaire -->
                <div class="checkout-cta">
                    @if (submitError) {
                        <p class="checkout-cta__error">{{ submitError }}</p>
                    }
                    <button 
                        type="button"
                        (click)="onSubmit()"
                        class="btn btn--primary btn--large btn--full"
                        [disabled]="isLoading || !deliveryFeeLoaded() || checkoutForm.invalid"
                    >
                        @if (isLoading) {
                            <span class="spinner"></span>
                            Traitement en cours...
                        } @else if (!deliveryFeeLoaded()) {
                            <span class="spinner"></span>
                            Chargement des frais...
                        } @else {
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            Confirmer la commande
                        }
                    </button>
                    <p class="checkout-cta__hint">En cliquant, vous acceptez nos conditions de vente.</p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        /* Checkout Page */
        .checkout-page {
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

        /* Page Header */
        .checkout-page__header {
            margin-bottom: 2.5rem;
        }

        .checkout-page__title {
            font-size: 2.25rem;
            font-weight: 600;
            margin: 0;
            color: var(--color-base-text);
        }

        /* Checkout Layout */
        .checkout-layout {
            display: grid;
            grid-template-columns: 1.2fr 420px;
            gap: 3rem;
        }

        /* Form Section */
        .form-section {
            background: var(--color-base-background-1);
            padding: 2.25rem;
            border-radius: 20px;
            border: 1px solid var(--color-base-border);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .form-section__title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--color-base-text);
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
            color: var(--color-gray-700);
        }

        .field__input {
            width: 100%;
            padding: 0.875rem 1rem;
            font-size: 1rem;
            border: 1px solid var(--color-base-border);
            border-radius: 12px;
            background: var(--color-base-background-1);
            color: var(--color-base-text);
            transition: all var(--transition-base);
            font-family: inherit;
        }

        .field__input:focus {
            outline: none;
            border-color: var(--color-base-text);
            box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }

        select.field__input {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111111' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            background-size: 1.25rem;
            padding-right: 2.5rem;
            cursor: pointer;
        }

        .field__input::placeholder {
            color: var(--color-gray-400);
        }

        .field__input--textarea {
            resize: vertical;
            min-height: 80px;
        }

        .field__error {
            font-size: 0.8125rem;
            color: var(--color-error);
            margin: 0;
        }

        /* Form Actions */
        .form-actions {
            margin-top: 0.5rem;
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

        .btn--primary:hover:not(:disabled) {
            background: var(--color-gray-700);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }

        .checkout-cta .btn--primary:disabled,
        .btn.btn--primary:disabled {
            background: #d1d5db !important;
            color: #6b7280 !important;
            cursor: not-allowed !important;
            box-shadow: none !important;
            transform: none !important;
            pointer-events: none !important;
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
            top: 6.5rem;
            align-self: start;
        }

        .summary-card {
            background: var(--color-base-background-1);
            padding: 2rem;
            border-radius: 20px;
            border: 1px solid var(--color-base-border);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        .summary-card__title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 1.5rem;
            color: var(--color-base-text);
        }

        .summary-items {
            border-bottom: 1px solid var(--color-base-border);
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
            border-bottom: 1px solid var(--color-base-border);
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
            color: var(--color-base-text);
            font-weight: 500;
            font-size: 0.9375rem;
            line-height: 1.4;
        }

        .summary-item__qty-controls {
            display: flex;
            align-items: center;
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

        .quantity-selector__btn {
            width: 32px;
            height: 32px;
            border: none;
            background: var(--color-base-background-1);
            color: var(--color-base-text);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-base);
        }

        .quantity-selector__btn:hover:not(:disabled) {
            background: var(--color-gray-100);
        }

        .quantity-selector__btn:active:not(:disabled) {
            transform: scale(0.95);
        }

        .quantity-selector__btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .quantity-selector__value {
            font-weight: 600;
            font-size: 0.875rem;
            min-width: 32px;
            text-align: center;
            padding: 0 0.5rem;
            color: var(--color-base-text);
        }

        .summary-item__price {
            color: var(--color-base-text);
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
            color: var(--color-gray-600);
            font-size: 0.9375rem;
        }

        .summary-total__label {
            font-weight: 500;
        }

        .summary-total__value {
            font-weight: 600;
            color: var(--color-base-text);
        }

        .summary-total--final {
            color: var(--color-base-text);
            font-size: 1.25rem;
            font-weight: 700;
            padding-top: 1rem;
            border-top: 1px solid var(--color-base-border);
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
            border-top: 1px solid var(--color-base-border);
            margin-top: 1.5rem;
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

        /* ==============================
           RESPONSIVE — Mobile First
           ============================== */

        /* Tablet landscape (≤1024px) */
        @media (max-width: 1024px) {
            .checkout-layout {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            .checkout-summary {
                position: static;
                order: -1; /* summary above the form */
            }
        }

        /* Mobile (≤768px) */
        @media (max-width: 768px) {
            .checkout-page {
                padding: 1rem 0 3rem;
            }

            .breadcrumb {
                margin-bottom: 1.25rem;
            }

            .checkout-page__header {
                margin-bottom: 1.5rem;
            }

            .checkout-page__title {
                font-size: 1.5rem;
            }

            /* All form rows collapse to single column */
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

            /* Larger touch targets for inputs */
            .field__input {
                padding: 0.9375rem 1rem;
                font-size: 1rem; /* prevents iOS auto-zoom */
                border-radius: 10px;
            }

            .field__label {
                font-size: 0.875rem;
            }

            /* Summary card compact */
            .summary-card {
                padding: 1.25rem;
                border-radius: 16px;
            }

            .summary-card__title {
                font-size: 1.1rem;
                margin-bottom: 1.25rem;
            }

            /* Trust badges: side by side on mobile */
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

            /* Submit button: full-width, tall for thumb tap */
            .btn--large {
                padding: 1rem 1.5rem;
                min-height: 52px;
                font-size: 1rem;
            }

            /* Quantity selector in cart */
            .quantity-selector {
                border-radius: 10px;
            }

            .quantity-selector__btn {
                width: 36px;
                height: 36px;
            }

            /* Checkout layout gap */
            .checkout-layout {
                gap: 1rem;
            }

            /* Summary totals slightly smaller */
            .summary-total {
                font-size: 0.875rem;
            }

            .summary-total--final {
                font-size: 1.125rem;
            }
        }

        /* Small phones (≤480px) */
        @media (max-width: 480px) {
            .checkout-page__title {
                font-size: 1.25rem;
            }

            .form-section {
                padding: 1rem;
                border-radius: 12px;
            }

            .summary-card {
                padding: 1rem;
                border-radius: 12px;
            }

            .btn--large {
                font-size: 0.9375rem;
            }

            .quantity-selector__btn {
                width: 32px;
                height: 32px;
            }

            .quantity-selector__value {
                min-width: 28px;
                font-size: 0.875rem;
            }
        }

        /* Very small phones (≤380px) */
        @media (max-width: 380px) {
            .checkout-page__title {
                font-size: 1.125rem;
            }

            .form-section__title {
                font-size: 1rem;
            }
        }

        /* Loading spinner */
        .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.4);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            margin-right: 6px;
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
        }
    `]
})
export class CheckoutComponent implements OnInit {
    checkoutForm!: FormGroup;
    isLoading = false;
    submitError: string | null = null;
    deliveryFee = signal<number>(7); // valeur par défaut
    deliveryFeeLoaded = signal<boolean>(false); // nouveau: suivi du chargement

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

    constructor(
        private fb: FormBuilder,
        public cart: CartService,
        private orderService: OrderService,
        private router: Router,
        private logService: LogService,
        private settingService: SettingService
    ) { }

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

        if (this.cart.items().length === 0) {
            this.router.navigate(['/']);
        }

        // Charger le prix de livraison depuis l'API
        console.log('🚚 Chargement des frais de livraison...');
        this.settingService.getDeliveryFee().subscribe({
            next: (fee) => {
                console.log('✅ Frais de livraison reçus:', fee, typeof fee);
                this.deliveryFee.set(fee);
                this.deliveryFeeLoaded.set(true);
            },
            error: (err) => {
                console.error('❌ Erreur lors du chargement des frais de livraison:', err);
                console.log('🔄 Utilisation de la valeur par défaut: 7 TND');
                this.deliveryFee.set(7); // fallback sur valeur par défaut
                this.deliveryFeeLoaded.set(true);
            }
        });
    }

    updateQty(productId: number, qty: number) {
        if (qty < 1) return;
        this.cart.updateQuantity(productId, qty);
    }

    onSubmit() {
        if (this.checkoutForm.invalid) {
            this.checkoutForm.markAllAsTouched();
            return;
        }

        // Vérifier que les frais de livraison sont bien chargés
        if (!this.deliveryFeeLoaded()) {
            console.warn('⚠️ Frais de livraison pas encore chargés, tentative de rechargement...');
            this.settingService.getDeliveryFee().subscribe({
                next: (fee) => {
                    this.deliveryFee.set(fee);
                    this.deliveryFeeLoaded.set(true);
                    this.proceedWithSubmit();
                },
                error: () => {
                    this.deliveryFee.set(7);
                    this.deliveryFeeLoaded.set(true);
                    this.proceedWithSubmit();
                }
            });
            return;
        }

        this.proceedWithSubmit();
    }

    private proceedWithSubmit() {
        console.log('🛒 Soumission commande - Frais de livraison actuels:', this.deliveryFee());

        this.isLoading = true;
        this.submitError = null;

        const formVal = this.checkoutForm.value;

        const items: { [key: number]: number } = {};
        for (const item of this.cart.items()) {
            items[item.product.id] = item.quantity;
        }

        const request: CheckoutRequest = {
            firstName: formVal.firstName,
            lastName: formVal.lastName,
            address: formVal.address,
            city: formVal.ville,
            governorate: formVal.gouvernorat,
            phone: formVal.phone,
            email: formVal.email || undefined,
            items,
            deliveryFee: this.deliveryFee()
        };

        console.log('📦 Requête checkout envoyée:', { ...request, deliveryFee: request.deliveryFee });

        this.orderService.checkout(request).subscribe({
            next: (order) => {
                console.log('✅ Commande créée:', order);
                this.logService.log('CHECKOUT', 'Order placed successfully', { orderId: order.id });
                this.cart.clear();
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
}
