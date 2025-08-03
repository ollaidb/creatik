# Guide complet : Recréation de la table user_publications

## 🚨 **Problème identifié**

La table `user_publications` existante a des problèmes de structure et de configuration qui empêchent le bon fonctionnement du filtrage par utilisateur.

## ✅ **Solution : Recréation complète**

### **Script à exécuter :** `scripts/recreate-user-publications-table.sql`

## 📋 **Étapes détaillées**

### **ÉTAPE 1 : Préparation**

1. **Ouvrir Supabase Dashboard**
   - Aller sur https://supabase.com
   - Se connecter à votre projet
   - Aller dans l'onglet "SQL Editor"

2. **Sauvegarder les données importantes** (optionnel)
   ```sql
   -- Exporter les publications existantes si nécessaire
   SELECT * FROM user_publications;
   ```

### **ÉTAPE 2 : Exécution du script**

1. **Copier le script complet** depuis `scripts/recreate-user-publications-table.sql`
2. **Coller dans l'éditeur SQL** de Supabase
3. **Exécuter le script** (bouton "Run")

## 🏗️ **Structure de la nouvelle table**

### **Champs principaux :**
```sql
CREATE TABLE user_publications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('category', 'subcategory', 'title', 'account', 'source', 'challenge', 'hooks')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    platform VARCHAR(100),
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Contraintes et validations :**
- ✅ **user_id obligatoire** : Chaque publication doit avoir un utilisateur
- ✅ **content_type validé** : Seuls les types autorisés sont acceptés
- ✅ **status avec valeurs prédéfinies** : pending, approved, rejected
- ✅ **Cascade sur suppression** : Si l'utilisateur est supprimé, ses publications aussi
- ✅ **Timestamps automatiques** : created_at et updated_at gérés automatiquement

## 🔒 **Sécurité (RLS)**

### **Politiques Row Level Security :**
```sql
-- Lecture : Uniquement ses propres publications
CREATE POLICY "Users can view their own publications" 
    ON user_publications FOR SELECT 
    USING (auth.uid() = user_id);

-- Création : Uniquement ses propres publications
CREATE POLICY "Users can create their own publications" 
    ON user_publications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Modification : Uniquement ses propres publications
CREATE POLICY "Users can update their own publications" 
    ON user_publications FOR UPDATE 
    USING (auth.uid() = user_id);

-- Suppression : Uniquement ses propres publications
CREATE POLICY "Users can delete their own publications" 
    ON user_publications FOR DELETE 
    USING (auth.uid() = user_id);
```

## ⚡ **Performance (Index)**

### **Index créés pour optimiser les requêtes :**
```sql
-- Index sur user_id (requêtes par utilisateur)
CREATE INDEX idx_user_publications_user_id ON user_publications(user_id);

-- Index sur content_type (filtrage par type)
CREATE INDEX idx_user_publications_content_type ON user_publications(content_type);

-- Index sur status (filtrage par statut)
CREATE INDEX idx_user_publications_status ON user_publications(status);

-- Index sur created_at (tri chronologique)
CREATE INDEX idx_user_publications_created_at ON user_publications(created_at DESC);

-- Index composite (requêtes fréquentes)
CREATE INDEX idx_user_publications_user_status ON user_publications(user_id, status);
```

## 🔄 **Automatisation (Triggers)**

### **Trigger pour updated_at :**
```sql
-- Fonction de mise à jour automatique
CREATE OR REPLACE FUNCTION update_user_publications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger qui s'exécute avant chaque UPDATE
CREATE TRIGGER trigger_update_user_publications_updated_at
    BEFORE UPDATE ON user_publications
    FOR EACH ROW
    EXECUTE FUNCTION update_user_publications_updated_at();
```

## 🧪 **Données de test**

### **Publications de test créées :**
- ✅ **5 publications de type 'title'** pour l'utilisateur par défaut
- ✅ **3 publications de type 'account'** pour l'utilisateur par défaut
- ✅ **Statut 'approved'** par défaut
- ✅ **Plateformes variées** : Instagram, TikTok

## 📊 **Vérifications après exécution**

### **1. Vérifier la création de la table :**
```sql
SELECT 
    'Table créée' as status,
    COUNT(*) as total_publications
FROM user_publications;
```

### **2. Vérifier les politiques RLS :**
```sql
SELECT 
    'Politiques RLS' as check_type,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'user_publications';
```

### **3. Vérifier les index :**
```sql
SELECT 
    'Index créés' as check_type,
    COUNT(*) as total_indexes
FROM pg_indexes 
WHERE tablename = 'user_publications';
```

### **4. Vérifier les triggers :**
```sql
SELECT 
    'Triggers créés' as check_type,
    COUNT(*) as total_triggers
FROM information_schema.triggers 
WHERE event_object_table = 'user_publications';
```

## 🧪 **Tests à effectuer**

### **Test 1 : Vérifier le filtrage par utilisateur**
1. Se connecter avec un utilisateur
2. Aller dans Profil → Publications
3. Vérifier qu'on ne voit que ses propres publications

### **Test 2 : Créer une nouvelle publication**
1. Créer une nouvelle publication
2. Vérifier qu'elle apparaît dans la liste
3. Vérifier qu'elle a le bon user_id

### **Test 3 : Supprimer une publication**
1. Supprimer une publication
2. Vérifier qu'elle disparaît de la liste
3. Vérifier qu'on ne peut supprimer que ses propres publications

## 🔧 **Intégration avec le code**

### **Hook usePublications mis à jour :**
```typescript
// Le hook filtre maintenant correctement par utilisateur
const { data: userPublications, error: publicationsError } = await supabase
  .from('user_publications')
  .select('*')
  .eq('user_id', user.id) // ✅ Filtre par utilisateur connecté
  .order('created_at', { ascending: false });
```

### **Suppression sécurisée :**
```typescript
// Double vérification pour la suppression
const { error: deleteError } = await supabase
  .from('user_publications')
  .delete()
  .eq('id', publicationId)
  .eq('user_id', user.id); // ✅ S'assurer que c'est sa publication
```

## 📈 **Monitoring et logs**

### **Logs à surveiller dans la console :**
```javascript
console.log('User ID:', user.id);
console.log('Publications de l\'utilisateur récupérées:', userPublications);
console.log('Total publications de l\'utilisateur:', formattedPublications.length);
```

### **Requêtes SQL de monitoring :**
```sql
-- Vérifier les publications d'un utilisateur spécifique
SELECT COUNT(*) FROM user_publications WHERE user_id = 'user-uuid-here';

-- Vérifier la répartition par type de contenu
SELECT content_type, COUNT(*) FROM user_publications GROUP BY content_type;

-- Vérifier la répartition par statut
SELECT status, COUNT(*) FROM user_publications GROUP BY status;
```

## ✅ **Résultats attendus**

Après l'exécution du script :

1. ✅ **Table user_publications recréée** avec la bonne structure
2. ✅ **Politiques RLS configurées** pour la sécurité
3. ✅ **Index optimisés** pour les performances
4. ✅ **Triggers automatiques** pour updated_at
5. ✅ **Données de test** insérées
6. ✅ **Filtrage par utilisateur** fonctionnel
7. ✅ **Sécurité renforcée** (chacun ne voit que ses publications)

## 🚨 **En cas de problème**

### **Si le script échoue :**
1. **Vérifier les permissions** dans Supabase
2. **Vérifier qu'il n'y a pas de contraintes** qui bloquent
3. **Exécuter étape par étape** si nécessaire

### **Si les publications ne s'affichent pas :**
1. **Vérifier que l'utilisateur est connecté**
2. **Vérifier les politiques RLS**
3. **Vérifier les logs de la console**

### **Si toutes les publications s'affichent encore :**
1. **Redémarrer l'application**
2. **Vider le cache du navigateur**
3. **Vérifier que le hook a été mis à jour**

---

**Note importante :** Ce script supprime complètement la table existante et la recrée. Assurez-vous de sauvegarder les données importantes avant l'exécution si nécessaire. 