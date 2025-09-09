# 🎯 Système de Profil Utilisateur - Creatik

## 📋 Vue d'ensemble

Le système de profil utilisateur permet aux utilisateurs de :
- **Gérer leurs réseaux sociaux** (TikTok, Instagram, YouTube, Twitter)
- **Organiser leurs publications** par réseau social
- **Créer des playlists** pour organiser leur contenu
- **Suivre leurs performances** et engagement

## 🗄️ Structure de la base de données

### Tables créées :

1. **`user_social_accounts`** - Comptes réseaux sociaux de l'utilisateur
2. **`user_social_posts`** - Publications personnelles de l'utilisateur
3. **`user_content_playlists`** - Playlists de contenu de l'utilisateur
4. **`playlist_posts`** - Liaison entre playlists et publications

## 🚀 Installation

### 1. Créer les tables
```bash
# Exécuter le script SQL dans votre base de données Supabase
psql -h your-db-host -U postgres -d postgres -f run_profile_tables.sql
```

### 2. Insérer des données de test
```bash
# Insérer des données de test (remplacez l'ID utilisateur)
psql -h your-db-host -U postgres -d postgres -f insert_test_data.sql
```

### 3. Vérifier l'installation
```sql
-- Vérifier que les tables existent
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'user_%';

-- Vérifier les données de test
SELECT COUNT(*) FROM public.user_social_accounts;
SELECT COUNT(*) FROM public.user_social_posts;
SELECT COUNT(*) FROM public.user_content_playlists;
```

## 🔧 Utilisation

### Service TypeScript
Le service `UserProfileService` fournit toutes les méthodes nécessaires :

```typescript
import { UserProfileService } from '@/services/userProfileService';

// Récupérer toutes les données du profil
const data = await UserProfileService.getUserProfileData(userId);

// Ajouter un réseau social
await UserProfileService.addSocialAccount({
  user_id: userId,
  platform: 'tiktok',
  username: '@mon_compte',
  display_name: 'Mon Compte TikTok'
});

// Créer une publication
await UserProfileService.addSocialPost({
  user_id: userId,
  social_account_id: accountId,
  title: 'Mon titre',
  content: 'Mon contenu',
  status: 'published'
});

// Créer une playlist
await UserProfileService.addPlaylist({
  user_id: userId,
  name: 'Ma Playlist',
  description: 'Description de ma playlist',
  color: '#FF5733'
});
```

### Page UserProfile
La page `UserProfile.tsx` utilise automatiquement les vraies données :
- **Chargement automatique** des données utilisateur
- **États de chargement** avec skeletons
- **Gestion des erreurs** intégrée
- **Interface responsive** et moderne

## 📊 Fonctionnalités

### ✅ Implémentées
- [x] Structure de base de données complète
- [x] Service TypeScript avec toutes les méthodes CRUD
- [x] Intégration dans la page UserProfile
- [x] États de chargement et gestion d'erreurs
- [x] Politiques RLS pour la sécurité
- [x] Triggers pour updated_at automatique

### 🔄 À implémenter
- [ ] Interface pour ajouter/modifier des réseaux sociaux
- [ ] Interface pour créer/modifier des publications
- [ ] Interface pour gérer les playlists
- [ ] Système de partage de profil
- [ ] Statistiques d'engagement
- [ ] Import/export de données

## 🔒 Sécurité

- **Row Level Security (RLS)** activé sur toutes les tables
- **Politiques strictes** : chaque utilisateur ne peut voir que ses propres données
- **Validation des données** côté client et serveur
- **Gestion des erreurs** robuste

## 🎨 Interface utilisateur

### Sections principales :
1. **Header** : Photo, nom, nombre de publications
2. **Mes Pages** : Icônes de navigation vers les pages existantes
3. **Réseaux Sociaux** : Liste des comptes connectés
4. **Playlists** : Collections de contenu organisées
5. **Publications** : Liste des publications récentes

### États visuels :
- **Chargement** : Skeletons animés
- **Vide** : Messages informatifs avec icônes
- **Erreur** : Gestion gracieuse des erreurs
- **Succès** : Feedback visuel pour les actions

## 🐛 Dépannage

### Problèmes courants :

1. **Tables non créées**
   ```sql
   -- Vérifier l'existence des tables
   \dt public.user_*
   ```

2. **Erreurs RLS**
   ```sql
   -- Vérifier les politiques
   SELECT * FROM pg_policies WHERE tablename LIKE 'user_%';
   ```

3. **Données non chargées**
   - Vérifier que l'utilisateur est connecté
   - Vérifier les logs de la console
   - Vérifier les permissions de l'utilisateur

## 📈 Prochaines étapes

1. **Interface de gestion** : Créer des modales pour ajouter/modifier
2. **Intégration API** : Connecter aux vraies APIs des réseaux sociaux
3. **Analytics** : Ajouter des métriques d'engagement
4. **Partage** : Système de partage de profil public
5. **Export** : Fonctionnalité d'export des données

## 🤝 Contribution

Pour contribuer au système :
1. Suivre les conventions de nommage existantes
2. Ajouter des tests pour les nouvelles fonctionnalités
3. Documenter les nouvelles méthodes
4. Respecter les politiques RLS

---

**Note** : Ce système est conçu pour être évolutif et s'adapter aux besoins futurs de l'application Creatik.
