# Guide de Test du Système de Like

## Problèmes corrigés

### ✅ Feedback visuel immédiat
- Le cœur devient rouge **immédiatement** quand tu likes
- Le cœur redevient gris **immédiatement** quand tu unlikes
- Transitions fluides avec animations

### ✅ État persistant
- L'état du like est sauvegardé en base de données
- Synchronisation entre toutes les pages
- Cache invalidation automatique

### ✅ Gestion d'erreurs
- Retour à l'état précédent en cas d'erreur
- Messages d'erreur clairs
- Logs détaillés pour le débogage

## Tests à effectuer

### 1. Test des titres
1. Aller sur une page de titres (`/category/.../subcategory/...`)
2. **Liker un titre** → Le cœur doit devenir rouge immédiatement
3. **Unliker le titre** → Le cœur doit redevenir gris immédiatement
4. **Recharger la page** → Le cœur doit rester dans le bon état
5. **Aller dans les favoris** → Le titre doit apparaître dans l'onglet "Titres"

### 2. Test des comptes
1. Aller sur une page de titres → onglet "Comptes"
2. **Liker un compte** → Le cœur doit devenir rouge immédiatement
3. **Unliker le compte** → Le cœur doit redevenir gris immédiatement
4. **Recharger la page** → Le cœur doit rester dans le bon état
5. **Aller dans les favoris** → Le compte doit apparaître dans l'onglet "Comptes"

### 3. Test des sources
1. Aller sur une page de titres → onglet "Sources"
2. **Liker une source** → Le cœur doit devenir rouge immédiatement
3. **Unliker la source** → Le cœur doit redevenir gris immédiatement
4. **Recharger la page** → Le cœur doit rester dans le bon état
5. **Aller dans les favoris** → La source doit apparaître dans l'onglet "Sources"

### 4. Test des catégories
1. Aller sur la page des catégories (`/categories`)
2. **Liker une catégorie** → Le cœur doit devenir rouge immédiatement
3. **Unliker la catégorie** → Le cœur doit redevenir gris immédiatement
4. **Recharger la page** → Le cœur doit rester dans le bon état
5. **Aller dans les favoris** → La catégorie doit apparaître dans l'onglet "Catégories"

### 5. Test des sous-catégories
1. Aller sur une page de sous-catégories (`/category/.../subcategories`)
2. **Liker une sous-catégorie** → Le cœur doit devenir rouge immédiatement
3. **Unliker la sous-catégorie** → Le cœur doit redevenir gris immédiatement
4. **Recharger la page** → Le cœur doit rester dans le bon état
5. **Aller dans les favoris** → La sous-catégorie doit apparaître dans l'onglet "Sous-catégories"

## Vérifications à faire

### ✅ Feedback visuel
- [ ] Le cœur devient rouge **immédiatement** au clic
- [ ] Le cœur redevient gris **immédiatement** au clic
- [ ] Animations fluides (transition de 200ms)
- [ ] Hover effects fonctionnent

### ✅ Persistance
- [ ] L'état persiste après rechargement de page
- [ ] L'état est synchronisé entre toutes les pages
- [ ] Les favoris apparaissent dans `/profile/favorites`

### ✅ Gestion d'erreurs
- [ ] Pas d'erreurs dans la console
- [ ] Messages toast appropriés
- [ ] Retour à l'état précédent en cas d'erreur

## Logs de débogage

Ouvre les outils de développement (F12) et vérifie les logs :

```
🔍 Chargement des favoris pour le type: title
✅ Favoris chargés pour title: [array of IDs]
🔄 Toggle favori - Type: title, ItemId: xxx
➕ Ajout du favori: xxx
✅ Favori ajouté: xxx
```

## Problèmes possibles

### Si le cœur ne change pas de couleur
1. Vérifier que `isFavorite()` retourne le bon état
2. Vérifier que `localFavorites` est bien mis à jour
3. Vérifier les classes CSS appliquées

### Si l'état ne persiste pas
1. Vérifier la table `user_favorites` en base
2. Vérifier les permissions RLS
3. Vérifier les logs d'erreur

### Si les favoris n'apparaissent pas
1. Vérifier que `favorites.includes(itemId)` fonctionne
2. Vérifier que les IDs correspondent
3. Vérifier le filtrage dans la page des favoris

## Résultat attendu

Après ces corrections, tu dois avoir :
- ✅ **Feedback visuel immédiat** sur tous les likes
- ✅ **Persistance** de l'état entre les pages
- ✅ **Synchronisation** dans la page des favoris
- ✅ **Animations fluides** et transitions
- ✅ **Gestion d'erreurs** robuste 