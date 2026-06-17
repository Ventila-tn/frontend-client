import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'cli-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="main-nav">
      <div class="nav-container">
        <a routerLink="/" class="logo">Ventila.tn</a>
        
        <a routerLink="/cart" class="cart-btn">
          <svg class="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H21L19 14H8M8 14L6 4H3M8 14L5 20H19M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM18 20C18 20.5523 18.4477 21 19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          @if (cart.count() > 0) {
            <span class="cart-count">{{ cart.count() }}</span>
          }
        </a>
      </div>
    </header>

    <main class="page-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <p>© 2026 Ventila.tn. Tous droits réservés.</p>
      </div>
    </footer>
  `,
  styles: [`
    .main-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      z-index: 100;
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
      text-decoration: none;
      letter-spacing: -0.025em;
    }
    
    .cart-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      color: #111827;
      transition: background 0.2s ease;
    }
    
    .cart-btn:hover {
      background: #f3f4f6;
    }
    
    .cart-count {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #111827;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .page-content {
      max-width: 1200px;
      margin: 120px auto 80px;
      padding: 0 24px;
      min-height: calc(100vh - 300px);
    }
    
    .site-footer {
      border-top: 1px solid #e5e7eb;
      padding: 32px 24px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    
    .footer-content p {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .nav-container {
        padding: 0 16px;
      }
      
      .page-content {
        padding: 0 16px;
        margin: 100px auto 60px;
      }
    }
  `]
})
export class AppComponent {
  constructor(public cart: CartService) { }
}
