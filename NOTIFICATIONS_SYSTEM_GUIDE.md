# Système de Notifications Creatik

## Vue d'ensemble

Le système de notifications de Creatik permet aux utilisateurs de recevoir des alertes importantes concernant leurs défis privés, les réactions aux commentaires, les réponses aux publications et les nouveaux défis publics.

## Types de Notifications

### 1. Rappels de Défis Privés (`challenge_reminder`)
- **Priorité** : Haute
- **Déclencheurs** :
  - Défi à accomplir aujourd'hui
  - Défi en retard
  - Défi programmé pour bientôt
- **Actions** : Navigation directe vers le défi concerné

### 2. Réactions aux Commentaires (`comment_reaction`)
- **Priorité** : Moyenne
- **Déclencheurs** :
  - Nouveau like sur un commentaire
  - Nouvelle réponse à un commentaire
  - Mention dans un commentaire
- **Actions** : Navigation vers le commentaire concerné

### 3. Réponses aux Publications (`publication_reply`)
- **Priorité** : Moyenne
- **Déclencheurs** :
  - Nouvelle réponse sur LinkedIn
  - Nouvelle réponse sur Instagram
  - Nouvelle réponse sur TikTok
- **Actions** : Navigation vers la publication concernée

### 4. Défis Publics (`public_challenge`)
- **Priorité** : Basse
- **Déclencheurs** :
  - Nouveau défi public disponible
  - Défi public expirant bientôt
  - Défi public populaire
- **Actions** : Navigation vers le défi public

## Structure de la Base de Données

### Table `user_notifications`

```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('challenge_reminder', 'comment_reaction', 'publication_reply', 'public_challenge')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  related_id TEXT,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Index et Performances

- Index sur `user_id` pour les requêtes utilisateur
- Index sur `type` pour le filtrage par type
- Index sur `is_read` pour les notifications non lues
- Index sur `priority` pour le filtrage par priorité
- Index sur `timestamp` et `created_at` pour le tri chronologique
- Index composites pour les requêtes fréquentes

## Fonctionnalités

### Interface Utilisateur

1. **Header avec compteur** : Affiche le nombre total de notifications non lues
2. **Onglets de catégorie** : Filtrage par type de notification
3. **Barre de recherche** : Recherche dans le titre et le message
4. **Filtres de priorité** : Filtrage par niveau d'importance
5. **Actions en masse** : Marquer toutes comme lues

### Gestion des Notifications

- **Marquer comme lu** : Individuel ou en masse
- **Suppression** : Suppression individuelle
- **Filtrage** : Par type, priorité et recherche
- **Tri** : Chronologique (plus récent en premier)

### États et Priorités

#### Priorités
- **Haute** (rouge) : Défis urgents, retards
- **Moyenne** (jaune) : Réactions, réponses
- **Basse** (vert) : Défis publics, informations

#### États
- **Non lue** : Bordure gauche colorée, badge "Non lue"
- **Lue** : Style normal, pas de badge

## Hook Personnalisé `useNotifications`

### Fonctionnalités

```typescript
const {
  notifications,           // Liste des notifications
  unreadCount,           // Nombre de notifications non lues
  isLoading,             // État de chargement
  error,                 // Erreurs éventuelles
  markAsRead,            // Marquer une notification comme lue
  markAllAsRead,         // Marquer toutes comme lues
  deleteNotification,     // Supprimer une notification
  createNotification,     // Créer une nouvelle notification
  getNotificationsByType, // Filtrer par type
  getNotificationsByPriority, // Filtrer par priorité
  getUnreadNotifications, // Obtenir les non lues
  getUnreadCountByType   // Compter par type
} = useNotifications();
```

### Utilisation

```typescript
import { useNotifications } from '@/hooks/useNotifications';

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // Utiliser les données et fonctions
};
```

## Migration et Installation

### 1. Exécuter la Migration

```bash
# Dans Supabase Dashboard > SQL Editor
# Exécuter le fichier : supabase/migrations/20250128000003-create-user-notifications-table.sql
```

### 2. Vérifier les Politiques RLS

Les politiques RLS sont automatiquement créées pour :
- Lecture : Utilisateur peut voir ses propres notifications
- Création : Utilisateur peut créer ses propres notifications
- Mise à jour : Utilisateur peut modifier ses propres notifications
- Suppression : Utilisateur peut supprimer ses propres notifications

### 3. Fonctions Utilitaires

Trois fonctions SQL sont créées :
- `get_user_unread_notifications_count(user_uuid)` : Compter les non lues
- `get_user_notifications_by_type(user_uuid, type)` : Filtrer par type
- `mark_all_user_notifications_as_read(user_uuid)` : Marquer toutes comme lues

## Intégration avec l'Application

### 1. Route

```typescript
// Dans App.tsx
<Route path="/profile/notifications" element={<Notifications />} />
```

### 2. Navigation

```typescript
// Dans Profile.tsx
{
  title: 'Notifications',
  description: 'Rappels de défis, réactions et réponses',
  icon: Bell,
  path: '/profile/notifications',
  color: 'text-yellow-500',
  requiresAuth: true
}
```

### 3. Composant

Le composant `Notifications.tsx` gère :
- Affichage des notifications
- Filtrage et recherche
- Actions utilisateur
- États de chargement et d'erreur

## Personnalisation et Extension

### Ajouter de Nouveaux Types

1. Étendre l'enum dans l'interface
2. Ajouter la validation dans la base de données
3. Mettre à jour les icônes et couleurs
4. Ajouter la logique de filtrage

### Modifier les Priorités

1. Ajuster les couleurs dans `getPriorityColor()`
2. Modifier la logique de tri
3. Mettre à jour les filtres

### Ajouter des Actions

1. Étendre l'interface `Notification`
2. Ajouter les boutons d'action
3. Implémenter la logique métier

## Bonnes Pratiques

### Performance
- Utiliser les index de base de données
- Implémenter la pagination pour de grandes listes
- Mettre en cache les requêtes fréquentes

### Sécurité
- Toujours vérifier l'authentification
- Utiliser RLS pour l'isolation des données
- Valider les entrées utilisateur

### UX
- Afficher des états de chargement
- Gérer les erreurs gracieusement
- Fournir des retours visuels immédiats

## Dépannage

### Problèmes Courants

1. **Notifications non affichées** : Vérifier les politiques RLS
2. **Erreurs de permission** : Vérifier l'authentification
3. **Performance lente** : Vérifier les index de base de données

### Logs et Debug

- Utiliser la console du navigateur
- Vérifier les logs Supabase
- Tester les requêtes SQL directement

## Support et Maintenance

### Mise à Jour
- Vérifier la compatibilité des types
- Tester les migrations
- Mettre à jour la documentation

### Monitoring
- Surveiller les performances des requêtes
- Vérifier l'utilisation des ressources
- Analyser les erreurs utilisateur
