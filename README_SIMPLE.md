# 🍽️ Restaurant App - Structure Simplifiée

## ✅ Ce qui est Créé

### 1. **Page d'Accueil** (`/session`)
- Formulaire avec numéro de table + nom client
- Bouton "Accéder au Menu" → Redirige vers `/menu`
- NgRx Store sauvegarde la session

### 2. **Page Menu** (`/menu`)
- **Gauche**: Panier avec total en temps réel
  - Liste des plats ajoutés
  - Bouton ❌ pour supprimer
  - Total calculé automatiquement
  
- **Droite**: Cards des plats
  - 6 plats d'exemple
  - Bouton "Ajouter" pour chaque plat

## 📁 Structure des Fichiers

```
src/app/
├── app.routes.ts          ← 2 routes: /session, /menu
├── app.config.ts          ← NgRx Store global avec cart
├── app.html               ← Navbar simple
├── app.css               ← Styles navbar
│
├── features/
│   ├── session/           ← Landing page
│   │   ├── store/
│   │   │   ├── session.actions.ts
│   │   │   ├── session.reducer.ts
│   │   │   └── session.selectors.ts
│   │   ├── components/
│   │   │   └── session-start.component.ts
│   │   └── session.routes.ts
│   │
│   ├── menu/              ← Menu + Cart
│   │   ├── store/
│   │   │   ├── menu.actions.ts
│   │   │   ├── menu.reducer.ts
│   │   │   └── menu.selectors.ts
│   │   ├── components/
│   │   │   └── menu-list.component.ts  ← Tout en un!
│   │   └── menu.routes.ts
│   │
│   └── cart/              ← Store du panier
│       └── store/
│           ├── cart.actions.ts
│           ├── cart.reducer.ts
│           └── cart.selectors.ts
```

## 🎯 Flow Utilisateur

```
1. / → Redirige vers /session

2. /session
   ↓
   User entre: Table 5, Nom "Jean"
   ↓
   Clic "Accéder au Menu"
   ↓
   NgRx Store: { tableNumber: 5, clientName: "Jean" }
   ↓
   Redirect → /menu

3. /menu
   ├─ GAUCHE: Panier vide
   └─ DROITE: 6 plats affichés

4. User clique "Ajouter" sur Pizza (12.50€)
   ↓
   dispatch(CartActions.addItem)
   ↓
   Cart Reducer ajoute plat et calcule total
   ↓
   GAUCHE: Pizza × 1 = 12.50€
           Total: 12.50€

5. User ajoute Burger (10.00€)
   ↓
   GAUCHE: Pizza × 1 = 12.50€
           Burger × 1 = 10.00€
           Total: 22.50€  ← Calculé automatiquement!

6. User clique ❌ sur Pizza
   ↓
   dispatch(CartActions.removeItem)
   ↓
   GAUCHE: Burger × 1 = 10.00€
           Total: 10.00€
```

## 🚀 Comment Tester

```bash
# Le serveur tourne déjà
# Ouvrir http://localhost:4200

1. Page d'accueil → Entrer Table + Nom → Clic "Accéder au Menu"
2. Page Menu → Voir panier vide à gauche, plats à droite
3. Cliquer "Ajouter" sur plusieurs plats
4. Voir le total se calculer en temps réel
5. Cliquer ❌ pour supprimer un plat
6. Voir le total se recalculer automatiquement
```

## 📝 Prochaines Étapes (À faire)

1. **Page Review** - Après commande, formulaire de feedback
2. **Admin Dashboard** - Ajouter/Supprimer/Désactiver des plats
   - Route `/admin`
   - CRUD simple pour les plats
   - Bouton enable/disable pour chaque plat

## 🎯 NgRx Utilisé (Simple)

- ✅ **Store**: État global (cart, session, menu)
- ✅ **Actions**: addItem, removeItem, startSession, loadDishes
- ✅ **Reducers**: Calcul du total automatique
- ✅ **Selectors**: selectCartTotal, selectCartItems
- ❌ **Effects**: PAS UTILISÉ (simplifié)

Tout est simple et direct!
