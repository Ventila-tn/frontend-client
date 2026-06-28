import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/ecommerce.models';
import { LogService } from './log.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private _items = signal<CartItem[]>([]);

    // Computed signals
    public items = computed(() => this._items());
    public count = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));
    public subtotal = computed(() => this._items().reduce((acc, item) => acc + (item.product.sellingPriceTTC * item.quantity), 0));
    public tax = computed(() => this.subtotal() * 0.2);
    public total = computed(() => this.subtotal());

    constructor(private logService: LogService) { }

    addToCart(product: Product) {
        this._items.update(items => {
            const existing = items.find(i => i.product.id === product.id);
            if (existing) {
                return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...items, { product, quantity: 1 }];
        });
        this.logService.log('ADD_TO_CART', `Produit ajouté au panier: ${product.name}`, product);
    }

    removeFromCart(productId: number) {
        this._items.update(items => items.filter(i => i.product.id !== productId));
    }

    updateQuantity(productId: number, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        this._items.update(items => items.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }

    clear() {
        this._items.set([]);
    }
}
