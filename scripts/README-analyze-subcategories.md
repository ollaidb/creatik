# Guide d'utilisation : Analyse et ajout de sous-catégories

## 📋 Description

Ce script vous permet d'analyser une catégorie existante et d'ajouter automatiquement des sous-catégories pertinentes.

## 🚀 Utilisation

```bash
node scripts/analyze-and-add-subcategories.js
```

## 📝 Fonctionnalités

1. **Analyse de la catégorie** : Le script vérifie si la catégorie existe et affiche :
   - Les informations de la catégorie (nom, ID, couleur, description)
   - L'état du niveau 2 (activé ou non)
   - Les sous-catégories niveau 1 existantes
   - Les sous-catégories niveau 2 existantes (si activé)

2. **Génération intelligente** : Le script propose automatiquement des sous-catégories basées sur le nom de la catégorie :
   - Reconnaissance de patterns (art, cuisine, sport, musique, mode, voyage, tech, beauté, santé, éducation)
   - Suggestions adaptées au contexte

3. **Ajout interactif** : Vous pouvez :
   - Ajouter toutes les suggestions
   - Sélectionner manuellement les sous-catégories à ajouter
   - Ajouter des sous-catégories personnalisées

4. **Activation du niveau 2** : Le script peut activer automatiquement le système de sous-catégories niveau 2 si nécessaire.

## 💡 Exemple d'utilisation

```
📝 Entrez le nom de la catégorie à analyser: Art

✅ Catégorie trouvée:
   📌 Nom: Art
   🆔 ID: abc123...
   🎨 Couleur: blue
   📝 Description: Contenu artistique

⚙️  Niveau 2 activé: ❌ Non

📊 Sous-catégories niveau 1 existantes: 5

✨ 30 suggestion(s) générée(s):
   1. Peinture
   2. Dessin
   3. Sculpture
   ...

❓ Voulez-vous ajouter ces 30 sous-catégories ?
   (oui/non/toutes/custom): custom

📝 Sélectionnez les sous-catégories à ajouter (numéros séparés par des virgules):
   Exemple: 1,3,5-10,15: 1-10,15,20

💾 Ajout des sous-catégories...
   ✅ "Peinture" ajoutée
   ✅ "Dessin" ajoutée
   ...

❓ Voulez-vous activer le niveau 2 (sous-catégories de sous-catégories) ? (oui/non): oui

✅ Niveau 2 activé avec succès

🎉 Opération terminée avec succès !
```

## 🎯 Options de sélection

- **oui/o** : Ajoute toutes les suggestions
- **non/n** : Annule l'opération
- **toutes/t** : Ajoute toutes les suggestions
- **custom/c** : Mode sélection personnalisée
  - Format: `1,3,5-10,15` (numéros séparés par des virgules, plages avec `-`)

## 📌 Notes

- Le script évite les doublons automatiquement
- Les sous-catégories existantes ne sont pas proposées
- Le script peut gérer de grandes quantités de sous-catégories (insertion par batch)
- Les erreurs sont gérées gracieusement (doublons ignorés, erreurs affichées)

