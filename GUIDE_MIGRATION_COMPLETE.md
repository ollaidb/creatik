# Guide de Migration Complète - Base de Données

Ce guide explique comment appliquer toutes les modifications de base de données nécessaires pour les nouvelles fonctionnalités.

## 📋 Modifications Incluses

1. **Ajout de `category_id` et `subcategory_id` à la table `creators`**
   - Permet de filtrer les créateurs par sous-catégorie dans la page des titres

2. **Contraintes d'unicité pour éviter les doublons**
   - Catégories, sous-catégories, titres, créateurs, etc.

3. **Fonctions de vérification des doublons**
   - Pour la publication multiple avec point-virgule

4. **Index de performance**
   - Pour améliorer les recherches et filtres

## 🚀 Étapes d'Exécution

### Option 1 : Via Supabase Dashboard (Recommandé)

1. **Ouvrir Supabase Dashboard**
   - Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sélectionnez votre projet

2. **Ouvrir l'éditeur SQL**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New query"

3. **Exécuter la migration**
   - Ouvrez le fichier `complete_database_migration.sql`
   - Copiez tout le contenu
   - Collez-le dans l'éditeur SQL
   - Cliquez sur "Run" ou appuyez sur `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)

4. **Vérifier l'exécution**
   - Vous devriez voir le message "Migration complète appliquée avec succès!"
   - Vérifiez qu'il n'y a pas d'erreurs dans les résultats

### Option 2 : Via Supabase CLI

```bash
# Si vous utilisez Supabase CLI
supabase db push

# Ou directement
psql -h <your-db-host> -U postgres -d postgres -f complete_database_migration.sql
```

## ✅ Vérifications Post-Migration

### 1. Vérifier que les colonnes ont été ajoutées

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'creators'
AND column_name IN ('category_id', 'subcategory_id');
```

**Résultat attendu :**
- `category_id` : `uuid`, `YES` (nullable)
- `subcategory_id` : `uuid`, `YES` (nullable)

### 2. Vérifier les contraintes d'unicité

```sql
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'public.creators'::regclass
AND contype = 'u';
```

**Résultat attendu :** Au moins une contrainte `unique_creator_name_per_subcategory`

### 3. Vérifier les fonctions de vérification

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'check_%';
```

**Résultat attendu :** Les fonctions suivantes doivent exister :
- `check_category_exists`
- `check_subcategory_exists`
- `check_subcategory_level2_exists`
- `check_title_exists`
- `check_creator_exists`
- `check_source_exists`

### 4. Tester une fonction

```sql
-- Tester la vérification d'une catégorie
SELECT check_category_exists('Test Category');
```

## 🔧 Dépannage

### Erreur : "column already exists"
- **Cause :** Les colonnes existent déjà
- **Solution :** C'est normal, le script utilise `IF NOT EXISTS` donc il ignore cette erreur

### Erreur : "constraint already exists"
- **Cause :** Les contraintes existent déjà
- **Solution :** C'est normal, le script vérifie avant de créer

### Erreur : "permission denied"
- **Cause :** Pas les permissions nécessaires
- **Solution :** Assurez-vous d'être connecté en tant qu'administrateur de la base de données

## 📝 Notes Importantes

1. **Sauvegarde** : Faites une sauvegarde de votre base de données avant d'exécuter la migration (recommandé)

2. **Données existantes** : Les créateurs existants n'auront pas de `category_id`/`subcategory_id` initialement. Ils devront être mis à jour manuellement ou via une migration de données si nécessaire.

3. **Performance** : Les index créés amélioreront les performances des requêtes de filtrage.

4. **RLS (Row Level Security)** : Les politiques RLS sont vérifiées et créées si elles n'existent pas déjà.

## 🎯 Prochaines Étapes

Après avoir exécuté la migration :

1. ✅ Testez la publication d'un créateur avec une sous-catégorie
2. ✅ Vérifiez que les créateurs s'affichent correctement dans la page des titres
3. ✅ Testez la publication multiple avec point-virgule
4. ✅ Vérifiez que les doublons sont bien détectés

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Supabase Dashboard → Logs
2. Vérifiez la console du navigateur pour les erreurs
3. Consultez la documentation Supabase : [https://supabase.com/docs](https://supabase.com/docs)

