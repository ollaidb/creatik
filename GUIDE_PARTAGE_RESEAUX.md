# 🔗 Guide : Partage de Réseaux Sociaux

## ✅ **TABLES CRÉÉES**

J'ai créé un système complet de partage de réseaux sociaux avec 3 tables principales :

### **1. `network_shares` - Partages principaux**
```sql
- id: Identifiant unique du partage
- owner_id: ID du propriétaire du réseau
- shared_with_email: Email de la personne qui reçoit l'accès
- permissions: 'view' ou 'edit'
- share_token: Token unique pour l'accès
- expires_at: Date d'expiration (optionnel)
- is_active: Si le partage est actif
```

### **2. `shared_network_access` - Liaison réseaux-partages**
```sql
- share_id: ID du partage
- social_account_id: ID du réseau social partagé
- (Un partage peut inclure plusieurs réseaux)
```

### **3. `shared_actions` - Actions des utilisateurs partagés**
```sql
- share_id: ID du partage
- social_account_id: ID du réseau concerné
- action_type: Type d'action (challenge_added, publication_added, etc.)
- action_data: Données JSON de l'action
- performed_by_email: Email de qui a fait l'action
```

## 🚀 **FONCTIONS DISPONIBLES**

### **1. Créer un partage**
```sql
SELECT create_network_share(
  'user-id'::UUID,                    -- Votre ID utilisateur
  'ami@example.com',                  -- Email de la personne
  'edit',                             -- Permissions: 'view' ou 'edit'
  ARRAY['network-id-1'::UUID],       -- IDs des réseaux à partager
  NOW() + INTERVAL '30 days'          -- Expiration (optionnel)
);
```

### **2. Vérifier les permissions**
```sql
SELECT * FROM check_share_permissions(
  'token-du-partage',                 -- Token généré automatiquement
  'network-id'::UUID                  -- ID du réseau (optionnel)
);
```

### **3. Enregistrer une action**
```sql
SELECT log_shared_action(
  'token-du-partage',                 -- Token du partage
  'network-id'::UUID,                 -- ID du réseau
  'challenge_added',                  -- Type d'action
  '{"title": "Mon défi"}'::jsonb,     -- Données de l'action
  'ami@example.com'                   -- Email de qui a fait l'action
);
```

## 🎯 **WORKFLOW COMPLET**

### **Étape 1 : L'utilisateur partage**
```
1. Clique sur "Partager le profil"
2. Sélectionne les réseaux (ou "Tous")
3. Choisit les permissions (view/edit)
4. Saisit l'email de la personne
5. Clique sur "Partager"
```

### **Étape 2 : Système crée le partage**
```sql
-- Appel automatique de create_network_share()
-- Génère un token unique
-- Envoie un email avec le lien
```

### **Étape 3 : La personne accède**
```
1. Reçoit un email avec le lien
2. Clique sur le lien
3. Accède aux réseaux partagés
4. Peut voir/éditer selon les permissions
```

### **Étape 4 : Actions trackées**
```sql
-- Chaque action est enregistrée avec :
-- - Qui a fait l'action (email)
-- - Quand (timestamp)
-- - Quoi (type d'action)
-- - Sur quel réseau
```

## 📊 **VUES UTILES**

### **1. Détails des partages**
```sql
SELECT * FROM network_shares_with_details
WHERE owner_id = 'votre-id';
-- Affiche tous vos partages avec les réseaux inclus
```

### **2. Actions récentes**
```sql
SELECT * FROM recent_shared_actions
WHERE share_id = 'id-du-partage';
-- Affiche les dernières actions sur un partage
```

## 🔒 **SÉCURITÉ**

### **RLS (Row Level Security)**
- ✅ Chaque utilisateur ne voit que ses propres partages
- ✅ Les actions sont vérifiées avec le token
- ✅ Les permissions sont respectées

### **Tokens uniques**
- ✅ Chaque partage a un token unique
- ✅ Les tokens peuvent expirer
- ✅ Les partages peuvent être désactivés

## 🎨 **INTERFACE UTILISATEUR**

### **Modal de partage :**
```
Partager un réseau social
┌─────────────────────────────────────────┐
│ Réseaux à partager :                   │
│ [Tous les réseaux ▼]                   │
│                                         │
│ Permissions :                           │
│ ○ Visualiser seulement                  │
│ ● Éditer (ajouter/supprimer)           │
│                                         │
│ Email : [ami@example.com]               │
│                                         │
│ [Annuler]  [Partager]                   │
└─────────────────────────────────────────┘
```

### **Affichage des actions :**
```
Défi ajouté par ami@example.com - 15:30
Publication supprimée par ami@example.com - 14:45
Défi accompli par ami@example.com - 13:20
```

## 🚀 **PROCHAINES ÉTAPES**

1. **Exécuter le script SQL** dans Supabase
2. **Créer le service de partage** (TypeScript)
3. **Implémenter l'envoi d'emails**
4. **Créer l'interface d'accès partagé**
5. **Ajouter le tracking des actions**

**Les tables sont prêtes ! Voulez-vous que je crée maintenant le service TypeScript pour gérer les partages ?** 🤔
