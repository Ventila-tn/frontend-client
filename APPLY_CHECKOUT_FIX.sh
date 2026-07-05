#!/bin/bash
# Script pour appliquer les modifications au checkout.component.ts

FILE="src/app/features/checkout/checkout.component.ts"

echo "Application des modifications au fichier $FILE..."

# 1. Ajouter l'import de SettingService après LogService
sed -i "/import { LogService }/a import { SettingService } from '../../core/services/setting.service';" "$FILE"

# 2. Ajouter signal import
sed -i "s/import { Component, OnInit }/import { Component, OnInit, signal }/" "$FILE"

# 3. Ajouter la propriété deliveryFee après isLoading
sed -i "/isLoading = false;/a \    deliveryFee = signal<number>(7); // valeur par défaut" "$FILE"

# 4. Ajouter SettingService au constructor
sed -i "s/private logService: LogService/private logService: LogService,\n        private settingService: SettingService/" "$FILE"

# 5. Remplacer 8.00 par deliveryFee() dans le template (2 occurrences)
sed -i "s/<span class=\"summary-total__value\">8\.00 TND<\/span>/<span class=\"summary-total__value\">{{ deliveryFee().toFixed(2) }} TND<\/span>/" "$FILE"
sed -i "s/{{ (cart\.subtotal() + 8)\.toFixed(2) }}/{{ (cart.subtotal() + deliveryFee()).toFixed(2) }}/" "$FILE"

echo "Modifications appliquées avec succès!"
echo "Vérifiez le fichier et testez l'application."
