# Guide de Test - Page Resources

## 🧪 Tests à effectuer

### 1. Accès à la page
- [ ] Aller sur `/compte`
- [ ] Vérifier que la carte "Ressources" est visible avec le badge "Nouveau"
- [ ] Cliquer sur la carte "Ressources"
- [ ] Vérifier que la page `/profile/resources` se charge

### 2. Navigation par onglets
- [ ] Vérifier que l'onglet "Reçu" est actif par défaut
- [ ] Cliquer sur l'onglet "Contrat"
- [ ] Vérifier que l'onglet "Contrat" devient actif
- [ ] Revenir à l'onglet "Reçu"

### 3. Générateur de Reçu
- [ ] Remplir le nom du client (champ obligatoire)
- [ ] Remplir la description du service (champ obligatoire)
- [ ] Remplir le montant (champ obligatoire)
- [ ] Sélectionner une plateforme dans la liste déroulante
- [ ] Sélectionner un type de contenu
- [ ] Ajouter des hashtags
- [ ] Cliquer sur "Générer et Télécharger"
- [ ] Vérifier que le toast de succès s'affiche
- [ ] Vérifier que le fichier est téléchargé
- [ ] Vérifier que le contenu est copié dans le presse-papier

### 4. Générateur de Contrat
- [ ] Aller sur l'onglet "Contrat"
- [ ] Remplir le nom de l'influenceur (champ obligatoire)
- [ ] Remplir le nom de la marque (champ obligatoire)
- [ ] Remplir la description de la campagne (champ obligatoire)
- [ ] Ajouter des deliverables
- [ ] Remplir la compensation
- [ ] Sélectionner des dates de début et fin
- [ ] Sélectionner plusieurs plateformes (cliquer sur les boutons)
- [ ] Ajouter des termes et conditions
- [ ] Cliquer sur "Générer et Télécharger"
- [ ] Vérifier que le toast de succès s'affiche
- [ ] Vérifier que le fichier est téléchargé
- [ ] Vérifier que le contenu est copié dans le presse-papier

### 5. Validation des champs
- [ ] Essayer de générer un reçu sans remplir les champs obligatoires
- [ ] Vérifier que le toast d'erreur s'affiche
- [ ] Essayer de générer un contrat sans remplir les champs obligatoires
- [ ] Vérifier que le toast d'erreur s'affiche

### 6. Interface utilisateur
- [ ] Vérifier que les thèmes clair/sombre fonctionnent
- [ ] Vérifier que la page est responsive sur mobile
- [ ] Vérifier que les animations fonctionnent
- [ ] Vérifier que les icônes s'affichent correctement

### 7. Actions rapides
- [ ] Retourner à `/compte`
- [ ] Utiliser les boutons "Créer un reçu" et "Nouveau contrat"
- [ ] Vérifier qu'ils redirigent vers la page Resources

## 🐛 Problèmes connus et solutions

### Erreur TikTok icon
- **Problème** : L'icône TikTok n'existe pas dans lucide-react
- **Solution** : Remplacée par Smartphone icon
- **Statut** : ✅ Résolu

### Icônes de plateformes
- **Instagram** : ✅ Disponible
- **TikTok** : ✅ Remplacé par Smartphone
- **YouTube** : ✅ Remplacé par Video
- **LinkedIn** : ✅ Disponible
- **Twitter** : ✅ Disponible

## 📱 Test sur mobile

### Responsive design
- [ ] Vérifier que la grille s'adapte sur mobile
- [ ] Vérifier que les boutons sont suffisamment grands
- [ ] Vérifier que les formulaires sont lisibles
- [ ] Tester la navigation tactile

### Performance
- [ ] Vérifier que la page se charge rapidement
- [ ] Vérifier que les animations sont fluides
- [ ] Vérifier qu'il n'y a pas de lag lors de la saisie

## 🔍 Vérifications techniques

### Console du navigateur
- [ ] Aucune erreur JavaScript
- [ ] Aucune erreur de module
- [ ] Aucun warning de performance

### Réseau
- [ ] Aucune requête HTTP inutile
- [ ] Chargement des composants UI correct
- [ ] Pas de 404 sur les ressources

### Accessibilité
- [ ] Les labels sont correctement associés aux inputs
- [ ] Les boutons ont des aria-labels appropriés
- [ ] La navigation au clavier fonctionne
- [ ] Les contrastes sont suffisants

## 📋 Checklist finale

- [ ] Page accessible depuis `/compte`
- [ ] Navigation par onglets fonctionnelle
- [ ] Générateur de reçus opérationnel
- [ ] Générateur de contrats opérationnel
- [ ] Validation des champs obligatoires
- [ ] Téléchargement des fichiers
- [ ] Copie presse-papier
- [ ] Interface responsive
- [ ] Thèmes clair/sombre
- [ ] Aucune erreur console
- [ ] Actions rapides fonctionnelles

## 🎯 Objectifs de test

1. **Fonctionnalité** : Toutes les fonctionnalités principales marchent
2. **Interface** : L'UI est intuitive et responsive
3. **Performance** : La page se charge et répond rapidement
4. **Stabilité** : Aucune erreur ou crash
5. **Accessibilité** : Utilisable par tous les utilisateurs

---

*Guide de test créé pour la page Resources - Janvier 2025*
