# 🔍 Diagnostic des Frais de Livraison - Frontend Client

## Problème
Les frais de livraison s'affichent à 0.00 TND au lieu de la valeur configurée (14 TND).

## ✅ Code Frontend Validé
- Le service SettingService est correctement implémenté
- Le composant checkout charge bien les frais via l'API
- Le signal deliveryFee est correctement utilisé dans le template
- La logique de fallback (7 TND) est présente

## 🔧 Debug ajouté temporairement
J'ai ajouté des console.log pour identifier le problème :
- `🚚 Chargement des frais de livraison...`
- `✅ Frais de livraison reçus:` + valeur + type
- `🌐 Appel API:` + URL complète
- `❌ Erreur lors du chargement des frais de livraison:` + détails

## 📋 Checklist de diagnostic

### Étape 1 - Vérifier l'API Backend
```bash
# Tester directement l'endpoint
curl https://backend-node-dun.vercel.app/api/settings/delivery-fee

# Résultat attendu: 14
# Résultat actuel: ? (à vérifier)
```

### Étape 2 - Vérifier la base de données
```sql
-- Dans PostgreSQL
SELECT key, value, typeof(value) FROM settings WHERE key = 'delivery_fee';
-- Doit retourner: delivery_fee | 14 | text
```

### Étape 3 - Tester avec le navigateur
1. Ouvrir la console développeur (F12)
2. Aller à la page checkout avec des produits
3. Observer les logs dans la console :
   - `🌐 Appel API: https://backend-node-dun.vercel.app/api/settings/delivery-fee`
   - `🚚 Chargement des frais de livraison...`
   - `✅ Frais de livraison reçus: [VALEUR] [TYPE]`

4. Vérifier l'onglet Network :
   - Requête GET vers `/settings/delivery-fee`
   - Status : 200 OK
   - Response body : 14 (pas un objet JSON complexe)

### Étape 4 - Problèmes possibles identifiés

#### A) Backend retourne 0 au lieu de 14
**Cause :** La valeur en base est mal stockée
**Solution :** 
```sql
UPDATE settings SET value = '14' WHERE key = 'delivery_fee';
```

#### B) API inaccessible (CORS, 404, 500)
**Cause :** Problème de déploiement ou configuration
**Résultat console :** `❌ Erreur lors du chargement des frais de livraison:`
**Solution :** Vérifier les logs Vercel

#### C) Type incorrect
**Cause :** Backend envoie une string au lieu d'un number
**Résultat console :** `✅ Frais de livraison reçus: "14" string`
**Solution :** Modifier le backend pour envoyer `parseFloat()`

#### D) Race condition
**Cause :** Template s'affiche avant que l'API réponde
**Solution :** Ajouter un loading state

## 🎯 Tests à effectuer MAINTENANT

1. **Ouvrir la console du navigateur**
2. **Aller sur la page checkout avec des produits**
3. **Noter EXACTEMENT ce qui s'affiche dans la console**
4. **Vérifier l'onglet Network pour voir la requête API**

## 📝 Résultats attendus après fix

```
🌐 Appel API: https://backend-node-dun.vercel.app/api/settings/delivery-fee
🚚 Chargement des frais de livraison...
✅ Frais de livraison reçus: 14 number
```

Et dans l'interface :
- Sous-total : 20.28 TND
- **Livraison : 14.00 TND** ✅
- **Total : 34.28 TND** ✅

---

**Status:** 🔄 En cours de diagnostic  
**Prochaine étape:** Vérifier les logs console + test API direct