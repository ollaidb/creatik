# 🔗 Guide : Connecter les défis au réseau social sélectionné

## 🎯 **PROBLÈME IDENTIFIÉ**

Les défis s'ajoutent dans la page "Mes défis privés" mais ne s'affichent pas dans la page de profil utilisateur (section Publications/Défis) selon le réseau social sélectionné.

## ✅ **SOLUTION IMPLÉMENTÉE**

J'ai modifié le code pour que les défis ajoutés dans la page de profil soient automatiquement liés au réseau social et à la playlist sélectionnés.

## 🔧 **MODIFICATIONS APPORTÉES**

### **1. Hook useChallenges.tsx**
- ✅ Ajout des propriétés `social_account_id`, `playlist_id`, `is_custom` dans l'interface `UserChallenge`
- ✅ Modification de la fonction `addChallenge` pour accepter des données supplémentaires

### **2. Page UserProfile.tsx**
- ✅ Modification de `handleAddChallenge` pour utiliser le réseau social et la playlist sélectionnés
- ✅ Vérification qu'un réseau social est sélectionné avant d'ajouter un défi
- ✅ Message de confirmation indiquant pour quel réseau le défi a été ajouté

## 🚀 **COMMENT ÇA FONCTIONNE MAINTENANT**

### **Étape 1 : L'utilisateur sélectionne un réseau social**
- Exemple : TikTok

### **Étape 2 : L'utilisateur sélectionne une playlist (optionnel)**
- Exemple : "Mes vidéos TikTok"

### **Étape 3 : L'utilisateur ajoute un défi**
- Le défi est automatiquement lié à TikTok et à la playlist sélectionnée
- Le défi apparaît dans la section "Défis" filtrée pour TikTok

### **Étape 4 : Le filtrage fonctionne**
- Changer de réseau social → Les défis se filtrent automatiquement
- Changer de playlist → Les défis se filtrent automatiquement

## 📊 **VÉRIFICATION**

### **Test 1 : Ajouter un défi**
1. Aller sur `/profile`
2. Sélectionner TikTok
3. Cliquer sur l'onglet "Défis"
4. Ajouter un défi
5. ✅ Le défi doit apparaître dans la liste

### **Test 2 : Changer de réseau**
1. Sélectionner Instagram
2. ✅ Les défis TikTok doivent disparaître
3. ✅ Seuls les défis Instagram doivent s'afficher

### **Test 3 : Changer de playlist**
1. Sélectionner une playlist spécifique
2. ✅ Seuls les défis de cette playlist doivent s'afficher

## 🐛 **DÉPANNAGE**

### **Problème : "Veuillez d'abord sélectionner un réseau social"**
**Solution :** Sélectionner un réseau social avant d'ajouter un défi

### **Problème : Les défis ne se filtrent pas**
**Solution :** Vérifier que les colonnes `social_account_id` et `playlist_id` existent dans la base de données

### **Problème : Les défis n'apparaissent pas**
**Solution :** Vérifier que le hook `useProfileFiltering` fonctionne correctement

## 📝 **CODE DE VÉRIFICATION**

### **Vérifier que les défis sont bien liés :**
```sql
-- Vérifier les défis avec leurs réseaux sociaux
SELECT 
  uc.id,
  uc.title,
  uc.status,
  uc.social_account_id,
  uc.playlist_id,
  uc.is_custom,
  usa.platform as social_platform
FROM user_challenges uc
LEFT JOIN user_social_accounts usa ON uc.social_account_id = usa.id
WHERE uc.user_id = auth.uid()
ORDER BY uc.created_at DESC;
```

### **Vérifier le filtrage :**
```sql
-- Vérifier les défis pour un réseau spécifique
SELECT 
  uc.id,
  uc.title,
  uc.status,
  usa.platform
FROM user_challenges uc
JOIN user_social_accounts usa ON uc.social_account_id = usa.id
WHERE uc.user_id = auth.uid() 
  AND usa.platform = 'tiktok'
ORDER BY uc.created_at DESC;
```

## 🎉 **RÉSULTAT FINAL**

Maintenant, quand vous :
1. **Sélectionnez TikTok** → Tous les défis TikTok s'affichent
2. **Ajoutez un défi** → Il est automatiquement lié à TikTok
3. **Changez de réseau** → Les défis se filtrent automatiquement
4. **Changez de playlist** → Les défis se filtrent selon la playlist

**La connexion entre les défis et les réseaux sociaux est maintenant complète !** 🚀
