# 🎯 Système de Génération de Titres par Mots

## 📋 **Vue d'ensemble**

Ce système permet de générer des titres automatiquement en combinant des blocs de mots selon la plateforme et la sous-catégorie sélectionnées.

## 🗄️ **Structure de la Base de Données**

### **Table `word_blocks`**
```sql
CREATE TABLE word_blocks (
  id UUID PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,           -- 'tiktok', 'instagram', 'youtube', etc.
  subcategory_id UUID REFERENCES subcategories(id),
  category VARCHAR(50) NOT NULL,           -- 'subject', 'verb', 'complement', 'twist'
  words TEXT[] NOT NULL,                   -- Array de mots pour cette catégorie
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### **Catégories de mots :**
- **`subject`** : Sujets, thèmes, personnes, lieux
- **`verb`** : Actions, verbes d'action
- **`complement`** : Compléments, contextes, détails
- **`twist`** : Éléments d'accroche, emojis, hashtags

## 🔄 **Comment ça fonctionne**

### **1. Sélection des mots**
```sql
-- Récupérer les mots pour TikTok + Analyses politiques
SELECT category, words 
FROM word_blocks 
WHERE platform = 'tiktok' 
  AND subcategory_id = 'subcategory_id'
ORDER BY category;
```

### **2. Génération de titres**
```javascript
// Exemple de génération
const subject = getRandomWord(subjects);    // "Politique"
const verb = getRandomWord(verbs);         // "analyse"
const complement = getRandomWord(complements); // "en 60 secondes"
const twist = getRandomWord(twists);       // "🔥"

// Titre généré : "🔥 Politique analyse en 60 secondes"
```

## 📊 **Exemple de Données**

### **Pour "Analyses politiques" sur TikTok :**

| Catégorie | Mots disponibles |
|-----------|------------------|
| **subject** | Politique, Gouvernement, Élections, Partis, Députés, Ministres, Président, Assemblée, Sénat, Municipales |
| **verb** | analyse, décrypte, explique, révèle, dévoile, expose, critique, défend, soutient, condamne |
| **complement** | en 60 secondes, en direct, en coulisses, les coulisses, les secrets, les scandales, les révélations, les tendances, l'actualité, le débat |
| **twist** | 🔥, ⚡, 💥, 🎯, 📊, 🔍, 💡, 🚨, 🎪, 🌟 |

### **Titres générés possibles :**
- 🔥 **Politique analyse en 60 secondes**
- ⚡ **Gouvernement décrypte les coulisses**
- 💥 **Élections révèle les scandales**
- 🎯 **Partis expose les tendances**

## ⚙️ **Configuration**

### **1. Vérifier l'état actuel**
```sql
-- Exécuter le script de vérification
-- scripts/verify-title-generation-system.sql
```

### **2. Créer la table si nécessaire**
```sql
-- Exécuter le script de création
-- scripts/create-word-blocks-table.sql
```

### **3. Ajouter des mots pour une nouvelle sous-catégorie**

```sql
-- Exemple pour "Cuisine" sur Instagram
INSERT INTO word_blocks (platform, subcategory_id, category, words) VALUES
('instagram', 'subcategory_id', 'subject', ARRAY['Recette', 'Cuisine', 'Chef', 'Restaurant', 'Ingrédients', 'Plat', 'Dessert', 'Apéro', 'Dîner', 'Déjeuner']),
('instagram', 'subcategory_id', 'verb', ARRAY['prépare', 'cuisine', 'réalise', 'crée', 'invente', 'adapte', 'améliore', 'perfectionne', 'décore', 'présente']),
('instagram', 'subcategory_id', 'complement', ARRAY['en 5 minutes', 'facilement', 'avec style', 'comme un pro', 'pour impressionner', 'en famille', 'pour les enfants', 'healthy', 'gourmet', 'traditionnel']),
('instagram', 'subcategory_id', 'twist', ARRAY['📸', '✨', '👨‍🍳', '🍽️', '🎨', '💫', '🌟', '💎', '🔥', '⭐']);
```

## 🎨 **Adaptation par Plateforme**

### **TikTok :**
- **Style** : Court, dynamique, emojis
- **Exemple** : "🔥 Politique analyse en 60 secondes"

### **Instagram :**
- **Style** : Visuel, esthétique, hashtags
- **Exemple** : "📸 Recette cuisine en 5 minutes"

### **YouTube :**
- **Style** : Informatif, détaillé, professionnel
- **Exemple** : "📺 Guide complet : Comment cuisiner comme un pro"

### **LinkedIn :**
- **Style** : Professionnel, business, expertise
- **Exemple** : "💼 Stratégie marketing : Les tendances 2024"

## 🚀 **Utilisation dans l'Application**

### **1. Hook de génération**
```typescript
const { generateTitles } = useTitleGeneration(platform, subcategoryId);

// Générer des titres
const titles = await generateTitles({
  platform: 'tiktok',
  subcategoryId: 'subcategory_id',
  wordBlocks: {
    subjects: ['Politique', 'Gouvernement'],
    verbs: ['analyse', 'décrypte'],
    complements: ['en 60 secondes'],
    twists: ['🔥', '⚡']
  }
});
```

### **2. Interface utilisateur**
- Bouton "Générer des titres" dans la page Titles.tsx
- Affichage des titres générés
- Possibilité de copier les titres

## 📈 **Avantages du Système**

✅ **Flexibilité** : Facile d'ajouter de nouveaux mots
✅ **Adaptabilité** : Style adapté à chaque plateforme
✅ **Cohérence** : Logique de génération uniforme
✅ **Performance** : Index optimisés pour les requêtes
✅ **Évolutivité** : Support de nouvelles plateformes

## 🔧 **Maintenance**

### **Ajouter de nouveaux mots :**
```sql
-- Ajouter des mots à une catégorie existante
UPDATE word_blocks 
SET words = array_append(words, 'nouveau_mot')
WHERE platform = 'tiktok' 
  AND subcategory_id = 'subcategory_id'
  AND category = 'subject';
```

### **Ajouter une nouvelle plateforme :**
```sql
-- Copier les mots d'une plateforme vers une nouvelle
INSERT INTO word_blocks (platform, subcategory_id, category, words)
SELECT 'nouvelle_platform', subcategory_id, category, words
FROM word_blocks 
WHERE platform = 'tiktok';
```

## ✅ **Validation**

Après configuration, vous devriez avoir :
- ✅ Table `word_blocks` créée avec les bons index
- ✅ Données de test pour au moins une sous-catégorie
- ✅ Système de génération fonctionnel
- ✅ Interface utilisateur pour générer des titres 