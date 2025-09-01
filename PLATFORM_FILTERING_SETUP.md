# 🎯 Configuration du Filtrage par Plateforme

## 📋 **Vue d'ensemble**

Cette configuration permet d'afficher des titres différents selon le réseau social sélectionné dans la page des catégories.

## 🗄️ **Structure de la Base de Données**

### Table `content_titles`
```sql
CREATE TABLE content_titles (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  subcategory_id UUID REFERENCES subcategories(id),
  platform VARCHAR(50), -- 'tiktok', 'instagram', 'youtube', 'linkedin', 'twitter', 'facebook', 'twitch', 'all'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Valeurs possibles pour `platform` :
- `'tiktok'` - Titres spécifiques à TikTok
- `'instagram'` - Titres spécifiques à Instagram  
- `'youtube'` - Titres spécifiques à YouTube
- `'linkedin'` - Titres spécifiques à LinkedIn
- `'twitter'` - Titres spécifiques à Twitter/X
- `'facebook'` - Titres spécifiques à Facebook
- `'twitch'` - Titres spécifiques à Twitch
- `'all'` - Titres génériques (visibles sur toutes les plateformes)

## ⚙️ **Configuration**

### 1. **Exécuter la Migration**

Copiez et exécutez le script SQL dans votre **Supabase SQL Editor** :

```sql
-- Ouvrir Supabase Dashboard → SQL Editor → Nouveau script
-- Copier le contenu de : scripts/apply-platform-migration.sql
```

### 2. **Vérifier la Configuration**

Après avoir exécuté le script, vérifiez que les données sont bien insérées :

```sql
SELECT 
  platform,
  COUNT(*) as total_titles
FROM content_titles 
WHERE subcategory_id = '550e8400-e29b-41d4-a716-446655440001'
GROUP BY platform
ORDER BY platform;
```

## 🔄 **Comment ça fonctionne**

### **Dans la page Categories.tsx :**
1. L'utilisateur sélectionne un réseau social (TikTok, Instagram, etc.)
2. Le paramètre `network` est ajouté à l'URL
3. La navigation se fait avec le paramètre : `/titles?network=tiktok`

### **Dans la page Titles.tsx :**
1. Le hook `useContentTitles` récupère le paramètre `network`
2. Il filtre les titres selon la plateforme sélectionnée
3. Il affiche :
   - Les titres spécifiques à la plateforme (ex: `platform = 'tiktok'`)
   - Les titres génériques (ex: `platform = 'all'`)

### **Logique de Filtrage :**
```typescript
// Si networkId = 'tiktok'
query.or(`platform.eq.tiktok,platform.eq.all`)

// Résultat : Titres TikTok + Titres génériques
```

## 🎨 **Exemples de Titres par Plateforme**

### **TikTok :**
- 🎵 Comment créer du contenu viral sur TikTok en 2024
- 🔥 Les 5 tendances TikTok que tu dois connaître
- ⚡ TikTok : Comment passer de 0 à 100k followers

### **Instagram :**
- 📸 Instagram Reels : Comment créer du contenu engageant
- ✨ Instagram Stories : Les meilleures pratiques 2024
- 🎨 Instagram : Comment optimiser sa bio pour plus de followers

### **YouTube :**
- 📺 YouTube : Comment créer une chaîne qui cartonne
- 🎬 YouTube Shorts : Le guide complet pour débuter
- ⚡ YouTube Algorithm : Comment être recommandé en 2024

### **LinkedIn :**
- 💼 LinkedIn : Comment construire sa marque personnelle
- 🚀 LinkedIn Content : Les posts qui génèrent du trafic
- 📊 LinkedIn Analytics : Mesurer son impact professionnel

## 🚀 **Test de la Fonctionnalité**

1. **Aller sur la page des catégories**
2. **Sélectionner un réseau social** (ex: TikTok)
3. **Naviguer vers une sous-catégorie**
4. **Vérifier que seuls les titres TikTok s'affichent**

## 📊 **Ajout de Nouveaux Titres**

Pour ajouter de nouveaux titres spécifiques à une plateforme :

```sql
INSERT INTO content_titles (title, subcategory_id, platform, created_at) VALUES
('Nouveau titre TikTok', 'subcategory_id', 'tiktok', NOW()),
('Nouveau titre Instagram', 'subcategory_id', 'instagram', NOW()),
('Nouveau titre YouTube', 'subcategory_id', 'youtube', NOW());
```

## 🔧 **Dépannage**

### **Problème : Les titres ne se filtrent pas**
- Vérifier que le paramètre `network` est bien passé dans l'URL
- Vérifier que les titres ont bien le bon `platform` en base

### **Problème : Aucun titre ne s'affiche**
- Vérifier que la `subcategory_id` existe
- Vérifier que des titres existent pour cette sous-catégorie

### **Problème : Tous les titres s'affichent**
- Vérifier que le hook `useContentTitles` filtre bien par `platform`
- Vérifier que `networkId !== 'all'` dans la condition

## ✅ **Validation**

Après configuration, vous devriez voir :
- ✅ Des titres différents selon le réseau sélectionné
- ✅ Des titres adaptés au style de chaque plateforme
- ✅ Une navigation fluide entre les réseaux
- ✅ Des performances optimisées avec les index 