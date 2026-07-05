import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { LogService } from './core/services/log.service';

@Component({
  selector: 'cli-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Main Content -->
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="footer no-print">
      <div class="footer__inner">
        <div class="footer__simple">
          <div class="footer__logo">
            <span class="logo-icon">🌬️</span>
            <span class="logo-text">Ventila<span class="logo-highlight">.tn</span></span>
          </div>
          <div class="footer__support">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22 6 12 13 2 6"></polyline>
            </svg>
            <a href="mailto:support&#64;ventila.tn" class="footer__support-link">
              support&#64;ventila.tn
            </a>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__copyright">&copy; 2026 Ventila.tn - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Announcement Bar */
    .announcement-bar {
      background-color: var(--color-base-text);
      color: var(--color-primary-contrast);
      padding: 0.75rem 1rem;
      text-align: center;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .announcement-bar__content p {
      margin: 0;
    }

    /* Header */
    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background-color: var(--color-base-background-1);
      border-bottom: 1px solid var(--color-base-border);
      transition: box-shadow var(--transition-base);
    }

    .header__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .header__logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-base-text);
      font-weight: 700;
      font-size: 1.5rem;
      letter-spacing: -0.02em;
      transition: transform var(--transition-base);
    }

    .header__logo:hover {
      transform: scale(1.02);
    }

    .logo-icon {
      font-size: 1.75rem;
    }

    .logo-text {
      font-family: var(--font-heading);
      font-weight: 700;
    }

    .logo-highlight {
      color: var(--color-accent);
    }

    .header__navigation {
      display: flex;
      gap: 2rem;
      flex: 1;
      justify-content: center;
    }

    .header__link {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-gray-600);
      text-decoration: none;
      padding: 0.5rem 0;
      position: relative;
      transition: color var(--transition-base);
    }

    .header__link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--color-base-text);
      transition: width var(--transition-base);
    }

    .header__link:hover {
      color: var(--color-base-text);
    }

    .header__link:hover::after,
    .header__link--active::after {
      width: 100%;
    }

    .header__link--active {
      color: var(--color-base-text);
    }

    .header__actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .header__action {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      color: var(--color-base-text);
      transition: all var(--transition-base);
    }

    .header__action:hover {
      background-color: var(--color-gray-100);
    }

    .header__cart {
      position: relative;
    }

    .header__cart-count {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background-color: var(--color-accent);
      color: var(--color-accent-contrast);
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Main Content */
    .main-content {
      min-height: calc(100vh - 200px);
      overflow-x: hidden; /* Évite le scroll horizontal sur mobile */
    }

    /* Footer */
    .footer {
      background-color: var(--color-gray-900);
      color: var(--color-gray-300);
      margin-top: 4rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem 1.5rem;
    }

    .footer__simple {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer__logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      color: var(--color-primary-contrast);
      font-weight: 700;
    }

    .logo-text {
      font-family: var(--font-heading);
    }

    .logo-highlight {
      color: #b08d6a;
    }

    .footer__support {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      transition: all 0.2s;
    }

    .footer__support:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #b08d6a;
    }

    .footer__support svg {
      color: #b08d6a;
      flex-shrink: 0;
    }

    .footer__support-link {
      color: var(--color-primary-contrast);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9375rem;
      transition: color 0.2s;
    }

    .footer__support-link:hover {
      color: #b08d6a;
    }

    .footer__bottom {
      text-align: center;
    }

    .footer__copyright {
      font-size: 0.875rem;
      color: var(--color-gray-500);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header__inner {
        height: 70px;
        padding: 0 1rem;
      }

      .header__navigation {
        display: none;
      }

      .header__logo {
        font-size: 1.25rem;
      }

      .footer__simple {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .footer__support {
        width: 100%;
        max-width: 300px;
        justify-content: center;
      }
    }

    /* Masquer éléments à l'impression */
    @media print {
      .no-print {
        display: none !important;
      }
    }
  `]
})
export class AppComponent {
  constructor(public cart: CartService, private logService: LogService) { }
}
