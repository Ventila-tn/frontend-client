# Modifications à Appliquer au checkout.component.ts

## Fichier: `src/app/features/checkout/checkout.component.ts`

### 1. Modifier les imports (ligne ~1-9)

**REMPLACER:**
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { LogService } from '../../core/services/log.service';
import { CheckoutRequest } from '../../core/models/ecommerce.models';
```

**PAR:**
```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { LogService } from '../../core/services/log.service';
import { SettingService } from '../../core/services/setting.service';
import { CheckoutRequest } from '../../core/models/ecommerce.models';
```

**Changements:**
- Ajouté `, signal` dans l'import de `@angular/core`
- Ajouté l'import de `SettingService`

---

### 2. Ajouter la propriété deliveryFee (après ligne ~866)

**TROUVER:**
```typescript
export class CheckoutComponent implements OnInit {
    checkoutForm!: FormGroup;
    isLoading = false;
    submitError: string | null = null;
```

**AJOUTER APRÈS `submitError`:**
```typescript
    deliveryFee = signal<number>(7); // valeur par défaut
```

**RÉSULTAT:**
```typescript
export class CheckoutComponent implements OnInit {
    checkoutForm!: FormGroup;
    isLoading = false;
    submitError: string | null = null;
    deliveryFee = signal<number>(7); // valeur par défaut
```

---

### 3. Modifier le constructor (ligne ~903)

**REMPLACER:**
```typescript
    constructor(
        private fb: FormBuilder,
        public cart: CartService,
        private orderService: OrderService,
        private router: Router,
        private logService: LogService
    ) { }
```

**PAR:**
```typescript
    constructor(
        private fb: FormBuilder,
        public cart: CartService,
        private orderService: OrderService,
        private router: Router,
        private logService: LogService,
        private settingService: SettingService
    ) { }
```

**Changement:**
- Ajouté `, private settingService: SettingService` avant la fermeture

---

### 4. Charger le delivery fee dans ngOnInit (ligne ~908-926)

**À LA FIN de la méthode `ngOnInit()`, AJOUTER:**
```typescript
        // Charger le prix de livraison depuis l'API
        this.settingService.getDeliveryFee().subscribe({
            next: (fee) => this.deliveryFee.set(fee),
            error: () => this.deliveryFee.set(7) // fallback sur valeur par défaut
        });
```

**RÉSULTAT de ngOnInit():**
```typescript
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
        this.settingService.getDeliveryFee().subscribe({
            next: (fee) => this.deliveryFee.set(fee),
            error: () => this.deliveryFee.set(7) // fallback sur valeur par défaut
        });
    }
```

---

### 5. Modifier le template - Affichage du delivery fee (ligne ~914)

**TROUVER (dans le template):**
```html
<div class="summary-total">
    <span class="summary-total__label">Livraison</span>
    <span class="summary-total__value">8.00 TND</span>
</div>
```

**REMPLACER PAR:**
```html
<div class="summary-total">
    <span class="summary-total__label">Livraison</span>
    <span class="summary-total__value">{{ deliveryFee().toFixed(2) }} TND</span>
</div>
```

---

### 6. Modifier le template - Total avec delivery fee (ligne ~917)

**TROUVER (dans le template):**
```html
<div class="summary-total summary-total--final">
    <span class="summary-total__label">Total</span>
    <span class="summary-total__value">{{ (cart.subtotal() + 8).toFixed(2) }} TND</span>
</div>
```

**REMPLACER PAR:**
```html
<div class="summary-total summary-total--final">
    <span class="summary-total__label">Total</span>
    <span class="summary-total__value">{{ (cart.subtotal() + deliveryFee()).toFixed(2) }} TND</span>
</div>
```

---

### 7. Envoyer delivery fee dans le checkout (ligne ~939)

**TROUVER dans la méthode `onSubmit()`:**
```typescript
        const request: CheckoutRequest = {
            firstName: formVal.firstName,
            lastName: formVal.lastName,
            address: formVal.address,
            city: formVal.ville,
            governorate: formVal.gouvernorat,
            phone: formVal.phone,
            email: formVal.email || undefined,
            items
        };
```

**REMPLACER PAR:**
```typescript
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
```

**Changement:**
- Ajouté `, deliveryFee: this.deliveryFee()` avant la fermeture de l'objet

---

## Vérification

Après avoir fait ces modifications:

1. **Compiler**: `npm run build` (devrait compiler sans erreurs)
2. **Tester**:
   - Aller sur http://localhost:4200/checkout
   - Le prix de livraison devrait se charger depuis l'API
   - Lors du checkout, le delivery fee sera envoyé au backend
   - La page de confirmation affichera le bon prix de livraison

## Résumé des Changements

- ✅ Import de `signal` et `SettingService`
- ✅ Propriété `deliveryFee` avec signal
- ✅ Injection de `SettingService` dans le constructor
- ✅ Chargement du delivery fee dans `ngOnInit()`
- ✅ Affichage dynamique dans le template (2 endroits)
- ✅ Envoi du delivery fee dans le `CheckoutRequest`
