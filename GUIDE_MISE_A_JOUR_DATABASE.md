# Guide de Mise à Jour de la Base de Données

## 🎯 Objectif
Mettre à jour toutes les tables existantes pour permettre la communication entre les réseaux sociaux, playlists et défis dans la page de profil utilisateur.

## 📋 Tables Existantes à Mettre à Jour

### 1. **Tables Principales Existantes**
- `user_social_accounts` - Comptes sociaux des utilisateurs
- `user_content_playlists` - Playlists de contenu
- `user_social_posts` - Publications des utilisateurs
- `playlist_posts` - Liaison entre playlists et publications
- `user_challenges` - Défis des utilisateurs
- `challenges` - Défis publics

### 2. **Nouvelles Tables à Créer**
- `user_program_settings` - Paramètres de programmation par réseau/playlist
- `user_custom_challenges` - Défis personnalisés des utilisateurs
- `user_custom_challenges_completed` - Défis personnalisés accomplis

## 🔧 Modifications Nécessaires

### **A. Ajout de Colonnes de Liaison**

#### `user_content_playlists`
```sql
-- Lier les playlists aux réseaux sociaux
ALTER TABLE user_content_playlists 
ADD COLUMN social_network_id UUID REFERENCES user_social_accounts(id);
```

#### `user_social_posts`
```sql
-- Lier les publications aux playlists
ALTER TABLE user_social_posts 
ADD COLUMN playlist_id UUID REFERENCES user_content_playlists(id);
```

#### `user_challenges`
```sql
-- Lier les défis aux réseaux sociaux et playlists
ALTER TABLE user_challenges 
ADD COLUMN social_account_id UUID REFERENCES user_social_accounts(id),
ADD COLUMN playlist_id UUID REFERENCES user_content_playlists(id),
ADD COLUMN is_custom BOOLEAN DEFAULT false,
ADD COLUMN custom_title TEXT,
ADD COLUMN custom_description TEXT;
```

### **B. Nouvelles Tables**

#### `user_program_settings`
```sql
-- Paramètres de programmation par réseau/playlist
CREATE TABLE user_program_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  social_account_id UUID REFERENCES user_social_accounts(id),
  playlist_id UUID REFERENCES user_content_playlists(id), -- NULL = "Tout"
  duration VARCHAR(20) DEFAULT '3months',
  contents_per_day INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, social_account_id, playlist_id)
);
```

#### `user_custom_challenges`
```sql
-- Défis personnalisés des utilisateurs
CREATE TABLE user_custom_challenges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  social_account_id UUID REFERENCES user_social_accounts(id),
  playlist_id UUID REFERENCES user_content_playlists(id),
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

## 🔄 Logique de Communication

### **1. Sélection de Réseau Social**
Quand l'utilisateur sélectionne un réseau social (ex: TikTok) :
- **Playlists** : Filtrer par `social_network_id = selected_network_id`
- **Publications** : Filtrer par `social_account_id = selected_network_id`
- **Défis** : Filtrer par `social_account_id = selected_network_id`
- **Paramètres** : Récupérer `user_program_settings` pour ce réseau

### **2. Sélection de Playlist**
Quand l'utilisateur sélectionne une playlist :
- **Publications** : Filtrer par `playlist_id = selected_playlist_id`
- **Défis** : Filtrer par `playlist_id = selected_playlist_id`
- **Paramètres** : Récupérer `user_program_settings` pour cette playlist

### **3. Option "Tout"**
Quand l'utilisateur choisit "Tout" :
- **Publications** : Toutes les publications du réseau sélectionné
- **Défis** : Tous les défis du réseau sélectionné
- **Paramètres** : `playlist_id = NULL` dans `user_program_settings`

## 📊 Fonctions Utilitaires Créées

### **1. `get_playlist_publications(playlist_uuid, user_uuid)`**
Récupère toutes les publications d'une playlist spécifique avec les infos du réseau social.

### **2. `get_social_network_challenges(social_account_uuid, user_uuid)`**
Récupère tous les défis d'un réseau social spécifique.

### **3. `get_social_network_stats(social_account_uuid, user_uuid)`**
Récupère les statistiques complètes pour un réseau social.

## 🚀 Comment Exécuter la Migration

### **Étape 1 : Sauvegarder la Base de Données**
```bash
# Créer une sauvegarde avant la migration
pg_dump your_database > backup_before_migration.sql
```

### **Étape 2 : Exécuter le Script de Migration**
```sql
-- Exécuter le fichier de migration
\i migrations/update_database_for_network_playlist_integration.sql
```

### **Étape 3 : Vérifier la Migration**
```sql
-- Vérifier que toutes les tables sont créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_program_settings',
  'user_custom_challenges', 
  'user_custom_challenges_completed'
);

-- Vérifier les colonnes ajoutées
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_content_playlists' 
AND column_name = 'social_network_id';
```

## 🔍 Vérifications Post-Migration

### **1. Vérifier les Liaisons**
```sql
-- Vérifier que les playlists sont liées aux réseaux sociaux
SELECT p.name, usa.platform, usa.username 
FROM user_content_playlists p
JOIN user_social_accounts usa ON p.social_network_id = usa.id;

-- Vérifier que les publications sont liées aux playlists
SELECT sp.title, p.name as playlist_name
FROM user_social_posts sp
JOIN user_content_playlists p ON sp.playlist_id = p.id;
```

### **2. Tester les Fonctions**
```sql
-- Tester la fonction de récupération des publications
SELECT * FROM get_playlist_publications('playlist-uuid-here');

-- Tester la fonction de récupération des défis
SELECT * FROM get_social_network_challenges('social-account-uuid-here');

-- Tester la fonction de statistiques
SELECT * FROM get_social_network_stats('social-account-uuid-here');
```

## ⚠️ Points d'Attention

### **1. Données Existantes**
- Les playlists existantes seront automatiquement liées au premier réseau social de l'utilisateur
- Les publications existantes seront automatiquement liées à la première playlist du réseau social

### **2. Performance**
- Des index ont été créés pour optimiser les requêtes
- Les contraintes de clé étrangère sont en place pour maintenir l'intégrité

### **3. Sécurité**
- RLS (Row Level Security) est activé sur toutes les nouvelles tables
- Les utilisateurs ne peuvent accéder qu'à leurs propres données

## 🎯 Résultat Final

Après cette migration, l'application pourra :
- ✅ Filtrer les playlists par réseau social
- ✅ Filtrer les publications par playlist
- ✅ Filtrer les défis par réseau social et playlist
- ✅ Gérer les paramètres de programmation par réseau/playlist
- ✅ Afficher des statistiques spécifiques par réseau social
- ✅ Créer des défis personnalisés liés à des réseaux/playlists

## 📞 Support

Si vous rencontrez des problèmes lors de la migration :
1. Vérifiez les logs de la base de données
2. Assurez-vous que toutes les tables existantes sont accessibles
3. Vérifiez que les contraintes de clé étrangère sont respectées
4. Testez les fonctions utilitaires une par une
