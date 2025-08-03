# Guide de correction : Publications par utilisateur

## 🔍 **Problème identifié**

La page de publications dans le profil affichait **toutes les publications** de l'application au lieu d'afficher uniquement **les publications de l'utilisateur connecté**.

## 🎯 **Cause du problème**

Le hook `usePublications` ne filtrait pas par `user_id`. Il récupérait toutes les publications de la table `user_publications` sans restriction.

### **Code problématique (avant correction) :**
```typescript
const { data: userPublications, error: publicationsError } = await supabase
  .from('user_publications')
  .select('*')
  .gte('created_at', thirtyDaysAgo.toISOString()) // ❌ Pas de filtre par utilisateur
  .order('created_at', { ascending: false });
```

## ✅ **Solution appliquée**

### **1. Correction du hook `usePublications`**

**Fichier modifié :** `src/hooks/usePublications.tsx`

**Changements :**
- ✅ **Ajout du filtre par utilisateur** : `.eq('user_id', user.id)`
- ✅ **Suppression du filtre par date** (plus nécessaire)
- ✅ **Sécurisation de la suppression** : vérification que l'utilisateur ne peut supprimer que ses propres publications

### **Code corrigé :**
```typescript
const { data: userPublications, error: publicationsError } = await supabase
  .from('user_publications')
  .select('*')
  .eq('user_id', user.id) // ✅ FILTRE PAR UTILISATEUR CONNECTÉ
  .order('created_at', { ascending: false });
```

### **2. Sécurisation de la suppression :**
```typescript
const { error: deleteError } = await supabase
  .from('user_publications')
  .delete()
  .eq('id', publicationId)
  .eq('user_id', user.id); // ✅ S'assurer que l'utilisateur ne peut supprimer que ses propres publications
```

## 🛠️ **Scripts de vérification**

### **Script de diagnostic :**
```sql
-- Exécuter dans Supabase SQL Editor
\i scripts/fix-user-publications-filtering.sql
```

Ce script va :
1. ✅ **Vérifier la structure** de la table `user_publications`
2. ✅ **Vérifier les politiques RLS** 
3. ✅ **Compter les publications** avec/sans `user_id`
4. ✅ **Afficher des exemples** de publications
5. ✅ **Vérifier les utilisateurs** existants

## 📊 **Résultats attendus**

### **Avant la correction :**
- ❌ Tous les utilisateurs voyaient toutes les publications
- ❌ Impossible de distinguer les publications par utilisateur
- ❌ Problème de sécurité (accès aux publications d'autres utilisateurs)

### **Après la correction :**
- ✅ **Chaque utilisateur ne voit que ses propres publications**
- ✅ **Sécurité renforcée** (politiques RLS + filtrage côté application)
- ✅ **Suppression sécurisée** (uniquement ses propres publications)

## 🧪 **Tests à effectuer**

### **Test 1 : Connexion avec un utilisateur**
1. Se connecter avec un utilisateur
2. Aller dans Profil → Publications
3. Vérifier qu'on ne voit que ses propres publications

### **Test 2 : Connexion avec un autre utilisateur**
1. Se connecter avec un autre utilisateur
2. Aller dans Profil → Publications
3. Vérifier qu'on ne voit que les publications de ce deuxième utilisateur

### **Test 3 : Suppression de publication**
1. Essayer de supprimer une publication
2. Vérifier que la suppression fonctionne
3. Vérifier qu'on ne peut supprimer que ses propres publications

## 🔧 **Configuration de la base de données**

### **Politiques RLS existantes :**
```sql
-- Les politiques RLS sont déjà configurées dans la migration
CREATE POLICY "Users can view their own publications" 
  ON public.user_publications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own publications" 
  ON public.user_publications 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

### **Structure de la table :**
```sql
CREATE TABLE user_publications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- ✅ Champ pour filtrer par utilisateur
  content_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  -- ... autres champs
);
```

## 📈 **Monitoring**

### **Logs à surveiller :**
```javascript
// Dans la console du navigateur
console.log('User ID:', user.id);
console.log('Publications de l\'utilisateur récupérées:', userPublications);
console.log('Total publications de l\'utilisateur:', formattedPublications.length);
```

### **Vérifications SQL :**
```sql
-- Vérifier les publications d'un utilisateur spécifique
SELECT COUNT(*) FROM user_publications WHERE user_id = 'user-uuid-here';

-- Vérifier qu'il n'y a plus de publications sans user_id
SELECT COUNT(*) FROM user_publications WHERE user_id IS NULL;
```

## ✅ **Validation finale**

Après la correction, vérifier que :

1. ✅ **Chaque utilisateur ne voit que ses propres publications**
2. ✅ **Les nouvelles publications sont bien associées à l'utilisateur connecté**
3. ✅ **La suppression fonctionne uniquement pour ses propres publications**
4. ✅ **Les politiques RLS empêchent l'accès aux publications d'autres utilisateurs**

## 🚨 **Problèmes potentiels**

### **Si les publications ne s'affichent pas :**
1. **Vérifier que l'utilisateur est connecté** : `console.log(user.id)`
2. **Vérifier les politiques RLS** : exécuter le script de diagnostic
3. **Vérifier que les publications ont un `user_id`** : requête SQL

### **Si toutes les publications s'affichent encore :**
1. **Vérifier que le hook a été mis à jour** : redémarrer l'application
2. **Vérifier le cache du navigateur** : Ctrl+F5
3. **Vérifier les logs de la console** pour voir les requêtes SQL

---

**Note** : Cette correction garantit que chaque utilisateur ne voit que ses propres publications, résolvant le problème de confidentialité et de sécurité. 