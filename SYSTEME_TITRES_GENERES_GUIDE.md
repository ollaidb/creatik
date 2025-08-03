# 🎯 Guide du Système de Titres Générés

## 📋 **Vue d'ensemble**

Le système de titres générés fonctionne en **3 étapes** :

1. **📝 Mots dans `word_blocks`** → Base de mots par plateforme et sous-catégorie
2. **🔄 Génération** → Combinaison des mots pour créer des titres uniques
3. **💾 Sauvegarde** → Stockage définitif dans `generated_titles`

## 🗄️ **Structure des Tables**

### **Table `word_blocks`**
```sql
CREATE TABLE word_blocks (
    id UUID PRIMARY KEY,
    platform VARCHAR(50), -- 'tiktok', 'instagram', etc.
    subcategory_id UUID REFERENCES subcategories(id),
    category VARCHAR(20), -- 'subject', 'verb', 'complement', 'twist'
    words TEXT[], -- Array de mots
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### **Table `generated_titles`**
```sql
CREATE TABLE generated_titles (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL, -- Titre généré final
    platform VARCHAR(50), -- Plateforme cible
    subcategory_id UUID REFERENCES subcategories(id),
    subject_word TEXT, -- Mot utilisé pour le sujet
    verb_word TEXT, -- Mot utilisé pour le verbe
    complement_word TEXT, -- Mot utilisé pour le complément
    twist_word TEXT, -- Mot utilisé pour l'accroche
    generation_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0, -- Nombre d'utilisations
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔄 **Processus de Génération**

### **1. Récupération des mots**
```sql
-- Récupérer les mots pour TikTok + Analyses politiques
SELECT words FROM word_blocks 
WHERE platform = 'tiktok' 
AND subcategory_id = 'uuid-analyses-politiques'
AND category = 'subject';
```

### **2. Combinaison aléatoire**
```javascript
// Exemple de génération
const subject = "Actualite"; // Tiré aléatoirement
const verb = "revele"; // Tiré aléatoirement  
const complement = "en direct"; // Tiré aléatoirement
const twist = "BREAKING"; // Tiré aléatoirement

const title = `${twist} ${subject} ${verb} ${complement}`;
// Résultat: "BREAKING Actualite revele en direct"
```

### **3. Sauvegarde définitive**
```sql
INSERT INTO generated_titles (
    title, platform, subcategory_id, 
    subject_word, verb_word, complement_word, twist_word
) VALUES (
    'BREAKING Actualite revele en direct',
    'tiktok', 'uuid-analyses-politiques',
    'Actualite', 'revele', 'en direct', 'BREAKING'
);
```

## 🎯 **Avantages du Système**

### ✅ **Titres permanents**
- Chaque titre généré est **sauvegardé définitivement**
- Pas de disparition après rechargement
- Base de données qui grandit avec le temps

### ✅ **Filtrage par plateforme**
- Titres spécifiques à chaque réseau social
- Adaptation du style selon la plateforme
- Pas de mélange entre les contenus

### ✅ **Traçabilité complète**
- Chaque titre garde trace des mots utilisés
- Compteur d'utilisation par titre
- Historique de génération

### ✅ **Évolutivité**
- Ajout facile de nouveaux mots
- Génération de nouveaux titres à la demande
- Statistiques d'utilisation

## 📊 **Exemples de Titres Générés**

### **TikTok - Analyses politiques**
- "BREAKING Actualite revele en direct"
- "URGENT Election confirme les coulisses"
- "EXCLUSIF Scandale expose les details"

### **Instagram - Fashion tips**
- "STYLE Mode stylise pour sortir"
- "ELEGANCE Look coordonne avec classe"
- "GLAMOUR Outfit transforme avec audace"

### **LinkedIn - Analyses de marché**
- "ANALYSE Marche etudie les tendances"
- "STRATEGIE Economie evalue les opportunites"
- "PERFORMANCE Finance mesure les indicateurs"

### **YouTube - Cuisine du monde**
- "GASTRONOMIE Cuisine decouvre les traditions"
- "TRADITION Recette explore les techniques"
- "AUTHENTIQUE Gastronomie maitrise les secrets"

## 🚀 **Utilisation dans l'Application**

### **Hook React**
```typescript
import { useGeneratedTitles } from '../hooks/useGeneratedTitles';

const { data: titles, isLoading } = useGeneratedTitles({
  platform: 'tiktok',
  subcategoryId: 'uuid-analyses-politiques',
  limit: 20
});
```

### **Génération de nouveaux titres**
```typescript
import { generateNewTitles } from '../hooks/useGeneratedTitles';

// Générer 10 nouveaux titres
await generateNewTitles('tiktok', 'uuid-analyses-politiques', 10);
```

### **Incrémentation d'utilisation**
```typescript
import { useIncrementTitleUsage } from '../hooks/useGeneratedTitles';

const incrementUsage = useIncrementTitleUsage();

// Quand un titre est utilisé
incrementUsage.mutate(titleId);
```

## 📈 **Statistiques et Monitoring**

### **Statistiques globales**
```sql
SELECT 
  COUNT(*) as total_titres,
  COUNT(DISTINCT platform) as plateformes,
  COUNT(DISTINCT subcategory_id) as sous_categories,
  SUM(usage_count) as total_utilisations
FROM generated_titles 
WHERE is_active = TRUE;
```

### **Titres les plus populaires**
```sql
SELECT 
  title, platform, usage_count
FROM generated_titles 
WHERE is_active = TRUE
ORDER BY usage_count DESC
LIMIT 10;
```

### **Répartition par plateforme**
```sql
SELECT 
  platform, 
  COUNT(*) as nombre_titres,
  AVG(usage_count) as utilisation_moyenne
FROM generated_titles 
WHERE is_active = TRUE
GROUP BY platform;
```

## 🔧 **Maintenance et Évolution**

### **Ajouter de nouveaux mots**
```sql
-- Ajouter des mots pour une nouvelle sous-catégorie
INSERT INTO word_blocks (platform, subcategory_id, category, words) 
VALUES (
  'tiktok',
  'uuid-nouvelle-categorie',
  'subject',
  ARRAY['Nouveau', 'Mot', 'Sujet']
);
```

### **Générer de nouveaux titres**
```sql
-- Générer 20 nouveaux titres
SELECT generate_and_save_titles('tiktok', 'uuid-categorie', 20);
```

### **Désactiver des titres**
```sql
-- Désactiver un titre inapproprié
UPDATE generated_titles 
SET is_active = FALSE 
WHERE id = 'uuid-titre';
```

## 🎯 **Résumé du Fonctionnement**

1. **📝 Configuration** : Mots organisés par plateforme et catégorie
2. **🔄 Génération** : Combinaison aléatoire des mots
3. **💾 Sauvegarde** : Stockage permanent dans la base
4. **📱 Affichage** : Récupération filtrée par plateforme
5. **📊 Suivi** : Comptage des utilisations et statistiques

**Le système garantit que chaque titre généré reste disponible pour toujours, avec un filtrage précis par plateforme !** 🎉 