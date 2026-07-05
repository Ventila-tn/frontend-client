import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Order } from '../../core/models/ecommerce.models';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
    private labels: { [key: string]: string } = {
        PENDING_CONFIRMATION: 'En attente de confirmation',
        CONFIRMED: 'Confirmée',
        SHIPPED: 'Expédiée',
        DELIVERED: 'Livrée',
        PAID: 'Payée',
        CANCELLED: 'Annulée'
    };
    transform(value: string): string {
        return this.labels[value] ?? value;
    }
}

@Component({
    selector: 'app-order-success',
    standalone: true,
    imports: [CommonModule, StatusLabelPipe],
    template: `
    <div class="page">
      <!-- Logo et titre pour le PDF uniquement -->
      <div class="pdf-header">
        <h1 class="pdf-company-name">Ventila.tn</h1>
        <p class="pdf-subtitle">Confirmation de commande</p>
      </div>

      <!-- Bouton retour accueil -->
      <button class="back-btn no-print" (click)="goHome()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Accueil
      </button>

      <div class="container" *ngIf="order; else noOrder">
        <!-- En-tête succès -->
        <div class="success-header">
          <div class="check-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Commande confirmée</h1>
          <div class="reference-badge">Réf. {{ order.reference }}</div>
          <p class="thank-you">Merci {{ order.firstName }} {{ order.lastName }}, votre commande a bien été reçue.</p>
          
          <!-- Bouton télécharger PDF -->
          <button class="download-pdf-btn no-print" (click)="downloadPDF()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Télécharger en PDF
          </button>
        </div>

        <!-- Résumé livraison + articles -->
        <div class="summary-grid">
          <!-- Infos livraison -->
          <div class="card">
            <h2>Informations de livraison</h2>
            <div class="info-row"><span>Référence</span><span class="ref-value">{{ order.reference }}</span></div>
            <div class="info-row"><span>Nom</span><span>{{ order.firstName }} {{ order.lastName }}</span></div>
            <div class="info-row"><span>Adresse</span><span>{{ order.address }}</span></div>
            <div class="info-row" *ngIf="order.city"><span>Ville</span><span>{{ order.city }}</span></div>
            <div class="info-row" *ngIf="order.governorate"><span>Gouvernorat</span><span>{{ order.governorate }}</span></div>
            <div class="info-row"><span>Téléphone</span><span>{{ order.phone }}</span></div>
            <div class="info-row" *ngIf="order.email"><span>Email</span><span>{{ order.email }}</span></div>
          </div>

          <!-- Articles commandés -->
          <div class="card">
            <h2>Articles commandés</h2>
            <div class="item-row" *ngFor="let item of order.items">
              <div class="item-info">
                <img *ngIf="item.product.imageUrls?.length" [src]="item.product.imageUrls[0]" [alt]="item.product.name" class="item-img" />
                <div class="item-img placeholder" *ngIf="!item.product.imageUrls?.length"></div>
                <div>
                  <p class="item-name">{{ item.product.name }}</p>
                  <p class="item-qty">Qté : {{ item.quantity }}</p>
                </div>
              </div>
              <span class="item-price">{{ item.totalPrice | number:'1.2-2' }} TND</span>
            </div>

            <div class="total-row subtotal-row">
              <span>Sous-total</span>
              <span>{{ (order.totalAmount - order.deliveryFee) | number:'1.2-2' }} TND</span>
            </div>
            <div class="total-row subtotal-row">
              <span>Livraison</span>
              <span>{{ order.deliveryFee | number:'1.2-2' }} TND</span>
            </div>
            <div class="total-row">
              <span>Total</span>
              <strong>{{ order.totalAmount | number:'1.2-2' }} TND</strong>
            </div>
          </div>
        </div>

        <!-- Footer pour PDF uniquement -->
        <div class="pdf-footer">
          <p>Merci de votre confiance !</p>
        </div>
      </div>

      <!-- Fallback si pas de données -->
      <ng-template #noOrder>
        <div class="container no-order">
          <p>Aucune commande à afficher.</p>
          <button class="home-btn" (click)="goHome()">Retour à l'accueil</button>
        </div>
      </ng-template>
    </div>
  `,
    styles: [`
    .page {
      min-height: 100vh;
      background: #f8f8f6;
      padding: 24px 16px 48px;
      font-family: inherit;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
      cursor: pointer;
      margin-bottom: 32px;
      transition: background 0.2s;
    }
    .back-btn:hover { background: #f0f0f0; }

    .container {
      max-width: 860px;
      margin: 0 auto;
    }

    .success-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .check-icon {
      width: 72px;
      height: 72px;
      background: #4caf50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    h1 {
      font-size: 26px;
      font-weight: 700;
      margin: 0 0 8px;
      color: #1a1a1a;
    }

    .order-id {
      font-size: 15px;
      color: #666;
      margin: 0 0 6px;
    }

    .thank-you {
      font-size: 15px;
      color: #444;
      margin: 0;
    }

    .reference-badge {
      display: inline-block;
      background: #f0f4ff;
      border: 1.5px solid #c7d7fd;
      color: #1a3a8f;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.04em;
      padding: 6px 18px;
      border-radius: 20px;
      margin: 8px 0 12px;
    }

    .ref-value {
      font-weight: 700;
      color: #1a3a8f;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 640px) {
      .summary-grid { grid-template-columns: 1fr; }
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: #1a1a1a;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 8px 0;
      border-bottom: 1px solid #f7f7f7;
      gap: 12px;
    }
    .info-row span:first-child { color: #888; flex-shrink: 0; }
    .info-row span:last-child { text-align: right; color: #1a1a1a; font-weight: 500; }

    .status-badge {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 12px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f7f7f7;
      gap: 12px;
    }

    .item-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .item-img {
      width: 52px;
      height: 52px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .item-img.placeholder {
      background: #f0f0f0;
    }

    .item-name {
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 4px;
      color: #1a1a1a;
    }

    .item-qty {
      font-size: 13px;
      color: #888;
      margin: 0;
    }

    .item-price {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      white-space: nowrap;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      font-size: 16px;
      color: #1a1a1a;
    }

    .subtotal-row {
      font-size: 14px;
      color: #666;
      padding-top: 10px;
      border-top: 1px solid #f7f7f7;
      font-weight: 400;
    }

    .no-order {
      text-align: center;
      padding: 60px 0;
      color: #666;
    }

    .home-btn {
      margin-top: 16px;
      background: #1a1a1a;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      font-size: 14px;
      cursor: pointer;
    }

    .download-pdf-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1a3a8f;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(26, 58, 143, 0.2);
    }

    .download-pdf-btn:hover {
      background: #2451b3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 58, 143, 0.3);
    }

    .download-pdf-btn:active {
      transform: translateY(0);
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      .download-pdf-btn {
        width: 100%;
        max-width: 320px;
        justify-content: center;
      }
    }

    /* En-tête et pied de page PDF - cachés à l'écran */
    .pdf-header,
    .pdf-footer {
      display: none;
    }

    /* Styles d'impression pour PDF */
    @media print {
      .no-print {
        display: none !important;
      }

      .page {
        background: white;
        padding: 20px;
      }

      .container {
        max-width: 100%;
      }

      /* Afficher l'en-tête PDF */
      .pdf-header {
        display: block;
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid #1a3a8f;
      }

      .pdf-company-name {
        font-size: 32px;
        font-weight: 700;
        color: #1a3a8f;
        margin: 0 0 8px;
        letter-spacing: -0.02em;
      }

      .pdf-subtitle {
        font-size: 16px;
        color: #666;
        margin: 0;
      }

      /* Afficher le pied de page PDF */
      .pdf-footer {
        display: block;
        text-align: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
        font-size: 12px;
        color: #666;
      }

      .pdf-footer p {
        margin: 4px 0;
      }

      .pdf-contact {
        font-weight: 600;
        color: #1a3a8f;
      }

      .success-header {
        margin-bottom: 30px;
        page-break-after: avoid;
      }

      .check-icon {
        width: 60px;
        height: 60px;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .reference-badge {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .summary-grid {
        display: block;
      }

      .card {
        margin-bottom: 20px;
        page-break-inside: avoid;
        box-shadow: none;
        border: 1px solid #e0e0e0;
      }

      .item-img {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      /* Titre du document */
      @page {
        margin: 1.5cm;
      }
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
    order: Order | null = null;

    constructor(private router: Router) { }

    ngOnInit() {
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras?.state as { order: Order } | undefined;
        if (state?.order) {
            this.order = state.order;
        } else {
            // Fallback: récupérer depuis history.state si arrivée directe
            const historyState = history.state as { order: Order };
            this.order = historyState?.order ?? null;
        }
    }

    goHome() {
        this.router.navigate(['/']);
    }

    downloadPDF() {
        // Utiliser l'API d'impression du navigateur
        // Sur mobile et desktop, cela permet de sauvegarder en PDF
        window.print();
    }
}
