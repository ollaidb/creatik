# Guide de Dépannage : Publication de Catégories

## 🚨 **Problème identifié**

Impossible de publier une catégorie via l'interface `/publish`

## 🔍 **Diagnostic étape par étape**

### **Étape 1 : Vérifier la base de données**

Exécuter le script de diagnostic :
```sql
-- Copier et exécuter scripts/diagnostic-publication-categorie.sql
```

**Résultats attendus :**
- ✅ Table `categories` existe
- ✅ Contraintes de couleur valides
- ✅ Politiques RLS actives
- ✅ Insertion de test réussie

### **Étape 2 : Vérifier les logs de la console**

**Dans la console du navigateur :**
1. Aller sur `/publish`
2. Sélectionner "Catégorie"
3. Remplir le formulaire
4. Soumettre
5. Vérifier les logs :
   ```
   === TENTATIVE DE PUBLICATION ===
   Type de contenu: category
   Publication catégorie...
   Couleur sélectionnée: [couleur]
   ```

## 🛠️ **Solutions possibles**

### **Problème 1 : Contrainte de couleur invalide**

**Symptôme :** `new row for relation "categories" violates check constraint "categories_color_check"`

**Solution :**
```sql
-- Vérifier la contrainte actuelle
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%categories%color%';

-- Corriger la contrainte
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_color_check;
ALTER TABLE categories 
ADD CONSTRAINT categories_color_check 
CHECK (color IN ('primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow'));
```

### **Problème 2 : Politiques RLS trop restrictives**

**Symptôme :** `new row violates row-level security policy`

**Solution :**
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'categories';

-- Créer une politique permissive pour les catégories
CREATE POLICY "Enable insert for authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### **Problème 3 : Champs manquants**

**Symptôme :** `null value in column violates not-null constraint`

**Solution :**
```sql
-- Vérifier les champs obligatoires
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories' AND is_nullable = 'NO';
```

### **Problème 4 : Problème d'authentification**

**Symptôme :** `auth.uid()` retourne NULL

**Solution :**
```sql
-- Vérifier l'authentification
SELECT auth.uid() as current_user;
```

## 🧪 **Tests à effectuer**

### **Test 1 : Publication simple**
1. Se connecter
2. Aller sur `/publish`
3. Sélectionner "Catégorie"
4. Entrer un nom simple (ex: "Test")
5. Soumettre
6. Vérifier la console pour les logs

### **Test 2 : Vérification base de données**
```sql
-- Vérifier les catégories récentes
SELECT * FROM categories 
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### **Test 3 : Test d'insertion directe**
```sql
-- Insérer une catégorie de test
INSERT INTO categories (name, description, color) 
VALUES ('Test direct', 'Test SQL', 'primary');
```

## 📊 **Monitoring en temps réel**

### **Console du navigateur :**
```javascript
// Vérifier les logs lors d'une publication
console.log('=== DÉBUT PUBLICATION ===');
console.log('FormData:', formData);
console.log('Couleur sélectionnée:', randomColor);
console.log('=== TENTATIVE DE PUBLICATION ===');
```

### **Base de données :**
```sql
-- Surveiller les nouvelles catégories
SELECT 
  COUNT(*) as total,
  MAX(created_at) as derniere_categorie
FROM categories;
```

## 🚨 **Erreurs courantes et solutions**

### **Erreur 1 : "new row for relation "categories" violates check constraint"**
- **Cause :** Couleur non autorisée
- **Solution :** Corriger la contrainte de couleur

### **Erreur 2 : "new row violates row-level security policy"**
- **Cause :** Politique RLS trop restrictive
- **Solution :** Créer une politique permissive

### **Erreur 3 : "null value in column violates not-null constraint"**
- **Cause :** Champ obligatoire manquant
- **Solution :** Vérifier tous les champs requis

### **Erreur 4 : "duplicate key value violates unique constraint"**
- **Cause :** Nom de catégorie déjà existant
- **Solution :** Utiliser un nom unique

## ✅ **Validation finale**

Après correction, vérifier que :

1. ✅ **Publication** de catégorie fonctionne
2. ✅ **Console** affiche les logs de succès
3. ✅ **Base de données** contient la nouvelle catégorie
4. ✅ **Couleur** est assignée correctement
5. ✅ **Pas d'erreurs** dans la console

## 📞 **Support**

Si les problèmes persistent :
1. **Exécuter** le script de diagnostic
2. **Vérifier** les logs de la console
3. **Tester** l'insertion directe en SQL
4. **Vérifier** les politiques RLS
5. **Contacter** le support avec les logs d'erreur 