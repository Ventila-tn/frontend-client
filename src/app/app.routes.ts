import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './features/catalog/product-catalog.component';
import { ProductDetailComponent } from './features/catalog/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { OrderSuccessComponent } from './features/order-success/order-success.component';

export const routes: Routes = [
    { path: '', component: ProductCatalogComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'order-success', component: OrderSuccessComponent },
    { path: '**', redirectTo: '' }
];
