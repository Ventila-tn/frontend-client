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
      min-height: calc(100vh - 400px);
    }

    /* Footer */
    .footer {
      background-color: var(--color-gray-900);
      color: var(--color-gray-300);
      margin-top: 4rem;
    }

    .footer__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 1.5rem 2rem;
    }

    .footer__grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer__logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: var(--color-primary-contrast);
    }

    .footer__description {
      font-size: 0.9375rem;
      line-height: 1.7;
      color: var(--color-gray-400);
      max-width: 340px;
    }

    .footer__heading {
      font-family: var(--font-body);
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-primary-contrast);
      margin-bottom: 1.25rem;
    }

    .footer__links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer__link {
      color: var(--color-gray-400);
      font-size: 0.9375rem;
      text-decoration: none;
      transition: color var(--transition-base);
    }

    .footer__link:hover {
      color: var(--color-primary-contrast);
    }

    .footer__contact {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .footer__contact li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9375rem;
      color: var(--color-gray-400);
    }

    .footer__contact svg {
      color: var(--color-accent);
      flex-shrink: 0;
    }

    .footer__bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer__copyright {
      font-size: 0.875rem;
      color: var(--color-gray-500);
      margin: 0;
    }

    .footer__payment {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--color-gray-500);
    }

    .payment-icons {
      display: flex;
      gap: 0.5rem;
    }

    .payment-icon {
      font-size: 1.5rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .footer__grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }

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

      .footer__grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer__bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class AppComponent {
  constructor(public cart: CartService, private logService: LogService) { }
}
