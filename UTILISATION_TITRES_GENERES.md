# 🚀 Guide d'Utilisation - Titres Générés

## 📱 **Comment ça fonctionne maintenant**

### **1. Entrée dans une page**
Quand vous entrez dans une page de sous-catégorie (ex: "Analyses politiques"), vous voyez maintenant :

- ✅ **Titres générés automatiquement** pour la plateforme sélectionnée
- ✅ **Filtrage par réseau social** (TikTok, Instagram, LinkedIn, etc.)
- ✅ **Titres permanents** qui ne disparaissent jamais
- ✅ **Compteur d'utilisation** pour chaque titre

### **2. Interface utilisateur**

#### **Header de la page**
```
📱 [Retour] Analyses politiques
   25 titres générés
   TikTok
   [🔄 Générer] [➕ Publier]
```

#### **Affichage des titres**
```
┌─────────────────────────────────────┐
│ BREAKING Actualite revele en direct │
│ Utilisé 3 fois • Généré le 15/01/24 │
│                    [📋] [❤️]        │
└─────────────────────────────────────┘
```

### **3. Actions disponibles**

#### **🔄 Générer de nouveaux titres**
- Cliquez sur le bouton "Générer" dans le header
- Le système crée 10 nouveaux titres automatiquement
- Les titres sont sauvegardés définitivement

#### **📋 Copier un titre**
- Cliquez sur l'icône de copie à côté de chaque titre
- Le titre est copié dans votre presse-papiers
- Notification de confirmation

#### **❤️ Liker un titre**
- Cliquez sur l'icône cœur pour marquer un titre comme favori
- (Fonctionnalité à venir)

#### **🔍 Rechercher**
- Utilisez la barre de recherche pour filtrer les titres
- Recherche en temps réel dans le contenu des titres

## 🎯 **Exemples de navigation**

### **Scénario 1 : TikTok + Analyses politiques**
1. Allez dans "Actualités" → "Analyses politiques"
2. Sélectionnez "TikTok" dans le menu des réseaux
3. Vous voyez des titres comme :
   - "BREAKING Actualite revele en direct"
   - "URGENT Election confirme les coulisses"
   - "EXCLUSIF Scandale expose les details"

### **Scénario 2 : Instagram + Fashion tips**
1. Allez dans "Beauty/Style" → "Fashion tips"
2. Sélectionnez "Instagram" dans le menu des réseaux
3. Vous voyez des titres comme :
   - "STYLE Mode stylise pour sortir"
   - "ELEGANCE Look coordonne avec classe"
   - "GLAMOUR Outfit transforme avec audace"

### **Scénario 3 : LinkedIn + Analyses de marché**
1. Allez dans "Analyse" → "Analyses de marché"
2. Sélectionnez "LinkedIn" dans le menu des réseaux
3. Vous voyez des titres comme :
   - "ANALYSE Marche etudie les tendances"
   - "STRATEGIE Economie evalue les opportunites"
   - "PERFORMANCE Finance mesure les indicateurs"

## 🔧 **Configuration requise**

### **Avant d'utiliser le système :**

1. **Exécuter les scripts SQL** dans l'ordre :
   ```sql
   -- 1. Vérifier les tables existantes
   scripts/check-existing-tables.sql
   
   -- 2. Créer la table word_blocks
   scripts/create-word-blocks-only.sql
   
   -- 3. Ajouter les mots
   scripts/add-comprehensive-word-blocks.sql
   scripts/add-more-categories-word-blocks.sql
   
   -- 4. Créer la table generated_titles
   scripts/create-generated-titles-table.sql
   
   -- 5. Générer les premiers titres
   scripts/generate-titles-for-all-platforms.sql
   ```

2. **Vérifier que les mots sont configurés** pour vos sous-catégories

## 🎨 **Différences avec l'ancien système**

### **❌ Ancien système**
- Titres statiques dans `content_titles`
- Pas de génération automatique
- Titres identiques pour toutes les plateformes
- Pas de compteur d'utilisation

### **✅ Nouveau système**
- Titres générés dynamiquement
- Génération automatique à la demande
- Titres adaptés par plateforme
- Compteur d'utilisation par titre
- Sauvegarde définitive

## 🚨 **Dépannage**

### **Problème : "Aucun titre généré"**
**Solution :**
1. Vérifiez que des mots sont configurés pour cette sous-catégorie
2. Cliquez sur "Générer les premiers titres"
3. Vérifiez que la plateforme est correctement sélectionnée

### **Problème : "Erreur lors de la génération"**
**Solution :**
1. Vérifiez que la table `word_blocks` contient des données
2. Vérifiez que la table `generated_titles` existe
3. Vérifiez que la fonction `generate_and_save_titles` est créée

### **Problème : Titres ne s'affichent pas**
**Solution :**
1. Vérifiez que le réseau social est correctement détecté
2. Vérifiez que la sous-catégorie existe
3. Rafraîchissez la page

## 📊 **Statistiques disponibles**

### **Dans l'interface**
- Nombre de titres générés par page
- Compteur d'utilisation par titre
- Date de génération de chaque titre

### **Dans la base de données**
```sql
-- Statistiques globales
SELECT COUNT(*) as total_titres FROM generated_titles;

-- Titres les plus populaires
SELECT title, usage_count FROM generated_titles 
ORDER BY usage_count DESC LIMIT 10;

-- Répartition par plateforme
SELECT platform, COUNT(*) FROM generated_titles 
GROUP BY platform;
```

## 🎯 **Résumé**

**Maintenant, quand vous entrez dans une page :**

1. **📱 Sélectionnez un réseau social** (TikTok, Instagram, etc.)
2. **🎯 Allez dans une sous-catégorie** (Analyses politiques, Fashion tips, etc.)
3. **✨ Voyez les titres générés** automatiquement pour cette combinaison
4. **🔄 Générez plus de titres** si nécessaire
5. **📋 Copiez et utilisez** les titres qui vous plaisent

**Les titres sont maintenant adaptés à chaque plateforme et restent disponibles pour toujours !** 🎉 