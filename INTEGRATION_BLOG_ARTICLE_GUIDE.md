# Guide d'Intégration Blog et Article

## ✅ Étapes Complétées

### 1. Base de données
- ✅ Ajout de "Blog" et "Article" dans la table `social_networks`
- ✅ Script SQL créé pour ajouter des mots dans `word_blocks` pour Blog et Article
- ✅ **SUPPRESSION** des réseaux sociaux non désirés (Pinterest, Snapchat, Discord, Telegram)

### 2. Frontend - Types et Interfaces
- ✅ Mise à jour des types TypeScript dans `src/types/database.ts`
- ✅ Mise à jour des types dans `src/types/index.ts`
- ✅ Ajout dans `src/services/socialTrendsService.ts`
- ✅ Ajout dans `src/components/CreatorCard.tsx`
- ✅ Ajout dans `src/hooks/useSocialTrends.ts`
- ✅ Ajout dans `src/pages/TrendingIdeas.tsx`

### 3. Fonctions d'affichage
- ✅ Mise à jour de `getNetworkDisplayName` dans :
  - `src/pages/Titles.tsx`
  - `src/pages/Subcategories.tsx`
  - `src/pages/SubcategoriesLevel2.tsx`
  - `src/pages/Hooks.tsx`
- ✅ Ajout dans `TEMP_SOCIAL_NETWORKS` dans `src/hooks/useSocialNetworks.ts`
- ✅ **SUPPRESSION** des réseaux non désirés de toutes les fonctions d'affichage

### 4. Nettoyage des réseaux sociaux
- ✅ Suppression de Pinterest, Snapchat, Discord, Telegram de :
  - `src/pages/Publish.tsx` (options de plateforme)
  - `src/pages/Accounts.tsx` (icônes et couleurs)
  - `src/pages/profile/Favorites.tsx` (icônes et couleurs)
  - `src/hooks/useAccounts.ts` (couleurs de plateforme)
  - `supabase/migrations/20250724000001-configure-social-networks.sql`

## 🔄 Prochaines Étapes

### 1. Exécuter les scripts SQL
```sql
-- 1. Supprimer les réseaux sociaux supplémentaires
-- scripts/remove-extra-social-networks.sql

-- 2. Ajouter des mots pour Blog et Article
-- scripts/add-blog-article-word-blocks.sql
```

### 2. Vérifier l'intégration
- [ ] Tester que Blog et Article apparaissent dans le menu des réseaux sociaux
- [ ] Vérifier qu'ils sont disponibles dans la page Publish
- [ ] Tester la navigation avec Blog et Article sélectionnés
- [ ] Vérifier que les titres s'affichent correctement pour Blog et Article
- [ ] **Vérifier que Pinterest, Snapchat, Discord, Telegram ne sont plus présents**

### 3. Générer des titres pour Blog et Article
```sql
-- Exécuter la génération de titres pour Blog et Article
SELECT generate_and_save_titles('blog', 'subcategory_id', 10);
SELECT generate_and_save_titles('article', 'subcategory_id', 10);
```

## 📋 Réseaux Sociaux Autorisés

### ✅ Réseaux sociaux dans le menu :
1. **Tout** (all)
2. **TikTok** (tiktok)
3. **YouTube** (youtube)
4. **Instagram** (instagram)
5. **Facebook** (facebook)
6. **Twitter** (twitter)
7. **LinkedIn** (linkedin)
8. **Twitch** (twitch)
9. **Blog** (blog) - **NOUVEAU**
10. **Article** (article) - **NOUVEAU**

### ❌ Réseaux sociaux supprimés :
- Pinterest
- Snapchat
- Discord
- Telegram

## 📋 Pages à Vérifier

### Pages Principales
- [ ] **Categories.tsx** - Menu des réseaux sociaux
- [ ] **Publish.tsx** - Sélection de réseau pour publication
- [ ] **Titles.tsx** - Affichage des titres filtrés
- [ ] **Subcategories.tsx** - Navigation avec réseau
- [ ] **SubcategoriesLevel2.tsx** - Navigation avec réseau

### Pages Secondaires
- [ ] **Favorites.tsx** - Filtrage par réseau
- [ ] **Challenges.tsx** - Intégration réseau
- [ ] **Hooks.tsx** - Affichage des hooks
- [ ] **Accounts.tsx** - Comptes exemplaires
- [ ] **TrendingIdeas.tsx** - Tendances

## 🎯 Fonctionnalités à Tester

### 1. Navigation
- [ ] Sélectionner Blog/Article dans le menu des réseaux
- [ ] Vérifier que les catégories s'affichent correctement
- [ ] Tester la navigation vers les sous-catégories
- [ ] Vérifier l'affichage des titres
- [ ] **Vérifier que les réseaux supprimés n'apparaissent plus**

### 2. Publication
- [ ] Sélectionner Blog/Article dans la page Publish
- [ ] Vérifier que les options sont disponibles
- [ ] Tester la publication de contenu
- [ ] **Vérifier que les réseaux supprimés ne sont pas dans les options**

### 3. Filtrage
- [ ] Vérifier que les titres sont filtrés par Blog/Article
- [ ] Tester la recherche avec Blog/Article sélectionné
- [ ] Vérifier l'affichage des comptes et sources
- [ ] **Vérifier que les données des réseaux supprimés ne s'affichent plus**

## 🐛 Problèmes Potentiels

### 1. Base de données
- Vérifier que Blog et Article sont bien dans `social_networks`
- S'assurer que les mots sont ajoutés dans `word_blocks`
- Vérifier que les titres sont générés
- **Vérifier que les réseaux supprimés sont bien supprimés de toutes les tables**

### 2. Frontend
- Vérifier que les types TypeScript sont corrects
- S'assurer que les fonctions d'affichage incluent Blog/Article
- Tester que les icônes s'affichent correctement
- **Vérifier que les réseaux supprimés n'apparaissent plus dans les menus**

### 3. Navigation
- Vérifier que les URLs avec `?network=blog` fonctionnent
- Tester la persistance de la sélection de réseau
- S'assurer que les redirections fonctionnent
- **Vérifier que les URLs avec les réseaux supprimés ne causent pas d'erreurs**

## 📝 Notes Importantes

1. **Blog et Article sont traités comme des "réseaux sociaux"** dans l'application
2. **Ils ont leurs propres mots** dans `word_blocks` pour générer des titres adaptés
3. **Ils apparaissent dans tous les menus** de sélection de réseau
4. **Ils ont des icônes spécifiques** (FileText pour Blog, BookOpen pour Article)
5. **Les réseaux sociaux non désirés ont été supprimés** de toute l'application

## 🚀 Commandes à Exécuter

```bash
# Redémarrer le serveur de développement
npm run dev

# Vérifier qu'il n'y a pas d'erreurs TypeScript
npx tsc --noEmit
```

## ✅ Checklist Finale

- [ ] Blog et Article dans la base de données
- [ ] Mots ajoutés dans word_blocks
- [ ] Types TypeScript mis à jour
- [ ] Fonctions d'affichage mises à jour
- [ ] **Réseaux sociaux non désirés supprimés**
- [ ] Titres générés pour Blog et Article
- [ ] Navigation testée
- [ ] Publication testée
- [ ] Filtrage testé
- [ ] Aucune erreur dans la console 