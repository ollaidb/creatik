# 🎯 Guide : Programmation par Réseau Social

## ✅ **LOGIQUE CORRIGÉE**

La programmation et les statistiques sont maintenant liées au **réseau social sélectionné**, pas à la playlist. La playlist sert uniquement à organiser le contenu.

## 🔄 **COMMENT ÇA FONCTIONNE MAINTENANT**

### **1. Sélection du réseau social**
- ✅ Choisir TikTok → Programmation TikTok
- ✅ Choisir Instagram → Programmation Instagram
- ✅ Choisir YouTube → Programmation YouTube

### **2. Programmation par réseau**
- ✅ **Durée** : 3 mois, 6 mois, 1 an, etc.
- ✅ **Contenus par jour** : 1, 2, 3, etc.
- ✅ **Portée** : Toutes les playlists de ce réseau

### **3. Statistiques par réseau**
- ✅ **Défis** : Tous les défis du réseau sélectionné
- ✅ **Publications** : Toutes les publications du réseau sélectionné
- ✅ **Accomplis** : Tous les défis accomplis du réseau sélectionné

## 🎨 **INTERFACE UTILISATEUR**

### **Modal de programmation :**
```
Réseau social: [TikTok ▼]
Portée: La programmation s'applique à toutes les playlists de ce réseau social
Durée: [3 mois ▼]
Contenus par jour: [1 ▼]
```

### **Section des playlists :**
```
[Tout] [Playlist 1] [Playlist 2] [Playlist 3] [+]
```
- **"Tout"** : Affiche toutes les publications du réseau
- **Playlists** : Filtre les publications par playlist

## 📊 **EXEMPLES CONCRETS**

### **Scénario 1 : TikTok sélectionné**
- **Programmation** : 3 mois, 2 contenus par jour
- **Statistiques** : Tous les défis TikTok
- **Publications** : Toutes les publications TikTok
- **Playlists** : "Tout" + "Vidéos courtes" + "Tendances"

### **Scénario 2 : Instagram sélectionné**
- **Programmation** : 6 mois, 1 contenu par jour
- **Statistiques** : Tous les défis Instagram
- **Publications** : Toutes les publications Instagram
- **Playlists** : "Tout" + "Photos" + "Stories"

## 🔧 **TECHNIQUE**

### **Table user_program_settings :**
```sql
-- Paramètres par réseau (playlist_id = NULL)
user_id | social_account_id | playlist_id | duration | contents_per_day
--------|-------------------|-------------|----------|------------------
user1   | tiktok_id        | NULL        | 3months  | 2
user1   | instagram_id     | NULL        | 6months  | 1
```

### **Filtrage des statistiques :**
```typescript
// Charger les paramètres pour le réseau sélectionné
const networkSettings = settings.find(s => 
  s.social_account_id === selectedSocialNetworkId && 
  s.playlist_id === null // Paramètres généraux du réseau
);
```

## 🚀 **WORKFLOW COMPLET**

### **Étape 1 : Sélectionner un réseau**
```
Cliquer sur "TikTok" → Les paramètres TikTok se chargent
```

### **Étape 2 : Programmer les défis**
```
Cliquer sur "Programmer" → Modal s'ouvre avec les paramètres TikTok
Modifier durée et contenus par jour → Sauvegarder
```

### **Étape 3 : Voir les statistiques**
```
Section "Statistiques" → Affiche les stats TikTok
Section "Défis" → Affiche les défis TikTok
Section "Publications" → Affiche les publications TikTok
```

### **Étape 4 : Organiser par playlist**
```
Cliquer sur "Vidéos courtes" → Filtre les publications TikTok
Cliquer sur "Tout" → Affiche toutes les publications TikTok
```

## ✅ **AVANTAGES**

### **1. Simplicité**
- Un seul paramètre de programmation par réseau
- Pas de confusion entre playlists

### **2. Cohérence**
- Toutes les playlists d'un réseau suivent la même programmation
- Statistiques cohérentes

### **3. Flexibilité**
- Chaque réseau peut avoir sa propre programmation
- Organisation libre par playlists

## 🎯 **RÉSULTAT FINAL**

Maintenant :
- ✅ **Programmation** : Par réseau social (TikTok, Instagram, etc.)
- ✅ **Statistiques** : Par réseau social
- ✅ **Organisation** : Par playlist (optionnel)
- ✅ **Filtrage** : Réseau + Playlist (optionnel)

**La programmation est maintenant correctement liée au réseau social !** 🚀
