# Fix Checkout - Dynamic Delivery Fee

## Problème
Le checkout affiche `8.00 TND` en dur pour la livraison au lieu de charger dynamiquement depuis l'API settings.

## Solution

### Fichiers Modifiés
1. ✅ `src/app/core/services/setting.service.ts` - Créé
2. ✅ `src/app/core/models/ecommerce.models.ts` - Ajout de `deliveryFee?` à `CheckoutRequest`
3. ⚠️ `src/app/features/checkout/checkout.component.ts` - À modifier

### Modifications à faire dans checkout.component.ts

#### 1. Ajouter l'import du SettingService
```typescript
import { SettingService } from '../../core/services/setting.service';
```

#### 2. Ajouter une propriété pour le delivery fee
Dans la classe `CheckoutComponent`, ajouter:
```typescript
deliveryFee = signal<number>(7); // valeur par défaut
```

#### 3. Injecter le service dans le constructor
```typescript
constructor(
    private fb: FormBuilder,
    public cart: CartService,
    private orderService: OrderService,
    private router: Router,
    private logService: LogService,
    private settingService: SettingService  // AJOUTER CETTE LIGNE
) { }
```

#### 4. Charger le delivery fee dans ngOnInit
Ajouter à la fin de `ngOnInit()`:
```typescript
// Charger le prix de livraison
this.settingService.getDeliveryFee().subscribe({
    next: (fee) => this.deliveryFee.set(fee),
    error: () => this.deliveryFee.set(7) // fallback
});
```

#### 5. Modifier le template pour utiliser deliveryFee()
Remplacer dans le template (ligne ~914):
```typescript
// AVANT:
<span class="summary-total__value">8.00 TND</span>

// APRÈS:
<span class="summary-total__value">{{ deliveryFee().toFixed(2) }} TND</span>
```

Et le total (ligne ~917):
```typescript
// AVANT:
<span class="summary-total__value">{{ (cart.subtotal() + 8).toFixed(2) }} TND</span>

// APRÈS:
<span class="summary-total__value">{{ (cart.subtotal() + deliveryFee()).toFixed(2) }} TND</span>
```

#### 6. Envoyer delivery fee dans le checkout request
Dans la méthode `onSubmit()`, modifier (ligne ~939):
```typescript
// AVANT:
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

// APRÈS:
const request: CheckoutRequest = {
    firstName: formVal.firstName,
    lastName: formVal.lastName,
    address: formVal.address,
    city: formVal.ville,
    governorate: formVal.gouvernorat,
    phone: formVal.phone,
    email: formVal.email || undefined,
    items,
    deliveryFee: this.deliveryFee()  // AJOUTER CETTE LIGNE
};
```

## Résultat
Après ces modifications:
- ✅ Le prix de livraison sera chargé depuis l'API
- ✅ Il s'affichera dynamiquement dans le récapitulatif
- ✅ Il sera envoyé au backend lors du checkout
- ✅ Il s'affichera correctement dans la page order-success

## Note
La même modification devra être faite dans `product-catalog.component.ts` qui a aussi un checkout inline.
