# Guide de Dépannage : Publications qui ne s'affichent pas

## 🚨 **Problème identifié**

Les publications ne s'affichent pas dans :
1. **Base de données** : Table `user_publications` vide
2. **Page profil** : `/profile/publications` ne montre rien
3. **Console** : Erreurs lors de l'insertion

## 🔍 **Diagnostic étape par étape**

### **Étape 1 : Vérifier la base de données**

Exécuter le script de diagnostic :
```sql
-- Copier et exécuter scripts/diagnostic-publications-complet.sql
```

**Résultats attendus :**
- ✅ Table `user_publications` existe
- ✅ Politiques RLS actives
- ✅ Fonctions SQL créées

### **Étape 2 : Tester l'insertion**

Exécuter le script de test :
```sql
-- Copier et exécuter scripts/test-insertion-publication.sql
```

**Vérifier :**
- ✅ Insertion directe fonctionne
- ✅ Fonction `add_user_publication()` fonctionne
- ✅ Pas d'erreurs de contraintes

### **Étape 3 : Vérifier le code frontend**

**Dans la console du navigateur :**
1. Aller sur `/publish`
2. Faire une publication
3. Vérifier les logs :
   ```
   === AJOUT DANS USER_PUBLICATIONS ===
   User ID: [UUID]
   Content Type: [type]
   Title: [titre]
   Données à insérer: [objet]
   ```

## 🛠️ **Solutions possibles**

### **Problème 1 : Politiques RLS trop restrictives**

**Symptôme :** Erreur "new row violates row-level security policy"

**Solution :**
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'user_publications';

-- Recréer les politiques si nécessaire
DROP POLICY IF EXISTS "Users can create their own publications" ON public.user_publications;
CREATE POLICY "Users can create their own publications" ON public.user_publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **Problème 2 : Contraintes de validation**

**Symptôme :** Erreur "new row for relation violates check constraint"

**Solution :**
```sql
-- Vérifier les contraintes
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%user_publications%';

-- Vérifier les valeurs autorisées
SELECT unnest(enum_range(NULL::text)) as content_types;
```

### **Problème 3 : Problème d'authentification**

**Symptôme :** `auth.uid()` retourne NULL

**Solution :**
```sql
-- Vérifier l'authentification
SELECT auth.uid() as current_user;

-- Tester avec un utilisateur spécifique
SELECT id FROM auth.users LIMIT 1;
```

### **Problème 4 : Table inexistante**

**Symptôme :** Erreur "relation does not exist"

**Solution :**
```sql
-- Recréer la table
-- Exécuter scripts/create-user-publications-system-fixed.sql
```

## 🧪 **Tests à effectuer**

### **Test 1 : Publication simple**
1. Se connecter
2. Aller sur `/publish`
3. Créer une publication simple (titre)
4. Vérifier la console pour les logs
5. Vérifier la base de données

### **Test 2 : Vérification base de données**
```sql
-- Vérifier les publications récentes
SELECT * FROM user_publications 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### **Test 3 : Test d'insertion directe**
```sql
-- Insérer une publication de test
INSERT INTO user_publications (
  user_id, content_type, title, status
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'title',
  'Test publication',
  'approved'
);
```

## 📊 **Monitoring en temps réel**

### **Console du navigateur :**
```javascript
// Vérifier les logs lors d'une publication
console.log('=== DÉBUT PUBLICATION ===');
console.log('User:', user);
console.log('FormData:', formData);
console.log('=== AJOUT DANS USER_PUBLICATIONS ===');
```

### **Base de données :**
```sql
-- Surveiller les nouvelles publications
SELECT 
  COUNT(*) as total,
  MAX(created_at) as derniere_publication
FROM user_publications;
```

## 🚨 **Erreurs courantes et solutions**

### **Erreur 1 : "new row violates row-level security policy"**
- **Cause :** Politique RLS trop restrictive
- **Solution :** Recréer les politiques RLS

### **Erreur 2 : "invalid input value for enum"**
- **Cause :** Type de contenu invalide
- **Solution :** Vérifier les valeurs autorisées

### **Erreur 3 : "null value in column violates not-null constraint"**
- **Cause :** Champ obligatoire manquant
- **Solution :** Vérifier tous les champs requis

### **Erreur 4 : "foreign key violation"**
- **Cause :** Référence vers une table inexistante
- **Solution :** Vérifier les clés étrangères

## ✅ **Validation finale**

Après correction, vérifier que :

1. ✅ **Publication** ajoute dans `user_publications`
2. ✅ **Console** affiche les logs de succès
3. ✅ **Base de données** contient les publications
4. ✅ **Page profil** affiche les publications
5. ✅ **Pas d'erreurs** dans la console

## 📞 **Support**

Si les problèmes persistent :
1. **Exécuter** les scripts de diagnostic
2. **Vérifier** les logs de la console
3. **Tester** l'insertion directe en SQL
4. **Vérifier** les politiques RLS
5. **Contacter** le support avec les logs d'erreur 