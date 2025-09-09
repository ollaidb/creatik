# Guide : Système de Publications par Utilisateur

## 🎯 **Objectif**

Créer un système où chaque utilisateur peut :
1. **Publier du contenu** via la page `/publish`
2. **Voir ses publications** dans `/profile/publications`
3. **Avoir ses publications liées** à son compte utilisateur

## 📋 **Configuration créée**

### **1. Base de données (SQL)**

**Table `user_publications`** :
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key vers auth.users)
- content_type (TEXT: 'category', 'subcategory', 'title', 'account', 'source', 'challenge', 'hooks')
- title (TEXT, NOT NULL)
- description (TEXT)
- category_id (UUID, Foreign Key)
- subcategory_id (UUID, Foreign Key)
- platform (TEXT)
- url (TEXT)
- status (TEXT: 'pending', 'approved', 'rejected')
- rejection_reason (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fonctions SQL créées** :
- `add_user_publication()` - Ajouter une publication utilisateur
- `get_user_publications()` - Récupérer les publications d'un utilisateur
- `delete_user_publication()` - Supprimer une publication utilisateur

**Politiques RLS** :
- ✅ Utilisateurs peuvent voir leurs propres publications
- ✅ Utilisateurs peuvent créer leurs propres publications
- ✅ Utilisateurs peuvent modifier leurs propres publications
- ✅ Utilisateurs peuvent supprimer leurs propres publications

### **2. Routes configurées**

**Routes existantes** :
- `/publish` → Page de publication
- `/profile/publications` → Page "Mes publications"

**Lien ajouté** :
- ✅ **Publish → Publications** : Redirection automatique après publication
- ✅ **Publications → Publish** : Bouton "Créer une publication"

### **3. Flux utilisateur**

#### **📝 Publication d'un contenu :**
1. Utilisateur va sur `/publish`
2. Remplit le formulaire
3. Soumet la publication
4. **Contenu publié** dans les tables publiques (categories, subcategories, etc.)
5. **Publication ajoutée** dans `user_publications`
6. **Redirection automatique** vers `/profile/publications`
7. Utilisateur voit sa publication dans sa liste personnelle

#### **👁️ Consultation des publications :**
1. Utilisateur va sur `/profile/publications`
2. Voir toutes ses publications personnelles
3. Filtrer par type (catégories, sous-catégories, titres, etc.)
4. Supprimer ses publications si nécessaire

## 🔧 **Modifications apportées**

### **1. Script SQL (`scripts/create-user-publications-system.sql`)**
- ✅ Création de la table `user_publications`
- ✅ Index pour les performances
- ✅ Politiques RLS pour la sécurité
- ✅ Fonctions SQL pour la gestion

### **2. Page Publish (`src/pages/Publish.tsx`)**
- ✅ **Ajout automatique** dans `user_publications` après publication
- ✅ **Redirection** vers `/profile/publications` après succès
- ✅ **Toast de confirmation** avec message de redirection

### **3. Hook usePublications (`src/hooks/usePublications.tsx`)**
- ✅ **Déjà configuré** pour récupérer les publications utilisateur
- ✅ **Filtrage par utilisateur** avec `auth.uid()`
- ✅ **Gestion des erreurs** et loading states

## 🧪 **Tests à effectuer**

### **Test 1 : Publication d'un contenu**
1. Se connecter avec un utilisateur
2. Aller sur `/publish`
3. Créer une publication (catégorie, titre, etc.)
4. Vérifier que :
   - ✅ Le contenu apparaît dans les tables publiques
   - ✅ La publication apparaît dans `user_publications`
   - ✅ Redirection vers `/profile/publications`
   - ✅ La publication apparaît dans la liste personnelle

### **Test 2 : Consultation des publications**
1. Aller sur `/profile/publications`
2. Vérifier que :
   - ✅ Seules les publications de l'utilisateur connecté sont visibles
   - ✅ Les filtres par type fonctionnent
   - ✅ La suppression fonctionne

### **Test 3 : Sécurité**
1. Se connecter avec un utilisateur A
2. Voir ses publications
3. Se connecter avec un utilisateur B
4. Vérifier que :
   - ✅ Les publications de A ne sont pas visibles pour B
   - ✅ B ne peut pas supprimer les publications de A

## 📊 **Monitoring**

### **Requêtes de vérification** :
```sql
-- Vérifier les publications d'un utilisateur
SELECT * FROM user_publications WHERE user_id = 'USER_ID';

-- Vérifier le nombre total de publications
SELECT COUNT(*) FROM user_publications;

-- Vérifier les publications par type
SELECT content_type, COUNT(*) FROM user_publications GROUP BY content_type;
```

## 🚨 **Problèmes potentiels**

### **Si les publications n'apparaissent pas :**
1. **Vérifier la table `user_publications`** existe
2. **Vérifier les politiques RLS** sont actives
3. **Vérifier les logs** dans la console du navigateur
4. **Vérifier l'authentification** de l'utilisateur

### **Si la redirection ne fonctionne pas :**
1. **Vérifier les routes** dans `App.tsx`
2. **Vérifier les logs** de navigation
3. **Vérifier les permissions** utilisateur

## ✅ **Validation finale**

Après configuration, vérifier que :

1. ✅ **Table `user_publications`** existe et est configurée
2. ✅ **Politiques RLS** sont actives
3. ✅ **Publication** ajoute automatiquement dans `user_publications`
4. ✅ **Redirection** fonctionne vers `/profile/publications`
5. ✅ **Consultation** affiche les bonnes publications
6. ✅ **Sécurité** empêche l'accès aux publications d'autres utilisateurs

---

**Note** : Ce système permet à chaque utilisateur d'avoir ses propres publications tout en gardant le contenu public accessible à tous. Les publications sont liées à l'utilisateur qui les a créées. 