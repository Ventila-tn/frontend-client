import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'cli-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="top-bar">
      <div class="top-bar-content">
        <span>🚚 Livraison rapide sur toute la Tunisie</span>
        <span class="separator">|</span>
        <span>✅ Garantie de fonctionnement</span>
        <span class="separator">|</span>
        <span>📞 Service client 7j/7</span>
      </div>
    </div>

    <header class="main-nav">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <img src="assets/images/logo.png" alt="Ventila.tn" class="logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div class="logo-fallback" style="display: none;">
            <span class="logo-icon">💨</span>
            Ventila.tn
          </div>
        </a>
        
        <div class="nav-actions">
          <a routerLink="/cart" class="cart-btn">
            <svg class="cart-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H21L19 14H8M8 14L6 4H3M8 14L5 20H19M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM18 20C18 20.5523 18.4477 21 19 21C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19C18.4477 19 18 19.4477 18 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            @if (cart.count() > 0) {
              <span class="cart-count">{{ cart.count() }}</span>
            }
          </a>
        </div>
      </div>
    </header>

    <main class="page-content">
      <router-outlet></router-outlet>
    </main>

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>Ventila.tn</h3>
            <p>Votre expert en ventilation et confort thermique.</p>
          </div>
          <div class="footer-contact">
            <h4>Contact</h4>
            <p>Email: contact&#64;ventila.tn</p>
            <p>Tél: +216 71 000 000</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 Ventila.tn. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .top-bar {
      background: var(--primary-dark);
      color: white;
      padding: 8px 0;
      font-size: 0.8rem;
      font-weight: 500;
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 101;
    }
    
    .top-bar-content {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 0 24px;
    }

    .separator {
      opacity: 0.3;
    }

    .main-nav {
      position: fixed;
      top: 36px;
      left: 0;
      right: 0;
      height: 72px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      z-index: 100;
      transition: all 0.3s ease;
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
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-img {
      height: 180px;
      width: auto;
      object-fit: contain;
      margin: -60px 0; /* To compensate for the white space around the logo */
      transform: scale(1.2);
    }

    .logo-fallback {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-dark);
      letter-spacing: -0.025em;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 1.8rem;
    }
    
    .nav-actions {
      display: flex;
      gap: 12px;
    }

    .cart-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      color: var(--text-main);
      background: var(--bg);
      transition: all 0.2s ease;
      border: 1px solid var(--border);
    }
    
    .cart-btn:hover {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary-dark);
      transform: translateY(-2px);
    }
    
    .cart-count {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--accent);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      padding: 0 4px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(46, 204, 113, 0.3);
    }
    
    .page-content {
      max-width: 1200px;
      margin: 140px auto 80px;
      padding: 0 24px;
      min-height: calc(100vh - 400px);
    }
    
    .site-footer {
      background: white;
      border-top: 1px solid var(--border);
      padding: 64px 24px 32px;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 48px;
      margin-bottom: 48px;
    }

    .footer-brand h3 {
      font-size: 1.5rem;
      margin-bottom: 16px;
      color: var(--primary-dark);
    }

    .footer-brand p {
      color: var(--text-muted);
      max-width: 400px;
    }

    .footer-contact h4 {
      margin-bottom: 16px;
    }

    .footer-contact p {
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    
    .footer-bottom {
      border-top: 1px solid var(--border);
      padding-top: 32px;
      text-align: center;
    }
    
    .footer-bottom p {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .top-bar {
        font-size: 0.65rem;
        padding: 0;
        height: 36px;
        display: flex;
        align-items: center;
      }
      
      .top-bar-content {
        gap: 16px;
        padding: 0 16px;
        justify-content: flex-start;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
      }

      .main-nav {
        top: 36px;
        height: 60px;
      }

      .logo-img {
        height: 80px;
        margin: -25px 0;
      }

      .page-content {
        margin-top: 140px;
        padding: 0 16px;
      }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
  `]
})
export class AppComponent {
  constructor(public cart: CartService) { }
}
