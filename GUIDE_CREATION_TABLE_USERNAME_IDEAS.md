# Guide : Créer la table username_ideas dans Supabase

## 📋 Étapes pour créer la table

### Option 1 : Via Supabase Dashboard (Recommandé)

1. **Ouvrir Supabase Dashboard**
   - Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Connectez-vous à votre compte
   - Sélectionnez votre projet

2. **Ouvrir l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur **"SQL Editor"**
   - Cliquez sur **"New query"** (Nouvelle requête)

3. **Copier le script SQL**
   - Ouvrez le fichier `create_username_ideas_table.sql` dans votre éditeur
   - Copiez **TOUT** le contenu du fichier

4. **Coller et exécuter**
   - Collez le contenu dans l'éditeur SQL de Supabase
   - Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)

5. **Vérifier la création**
   - Vous devriez voir le message : `"Table username_ideas créée avec succès!"`
   - Allez dans **"Table Editor"** dans le menu de gauche
   - Vous devriez voir la table `username_ideas` dans la liste

### Option 2 : Via Supabase CLI

Si vous utilisez Supabase CLI :

```bash
# Naviguer vers votre projet
cd /Users/binta/Downloads/creatik

# Exécuter la migration
supabase db push

# Ou directement avec psql
psql -h <your-db-host> -U postgres -d postgres -f create_username_ideas_table.sql
```

## ✅ Vérification

### Vérifier que la table existe

Exécutez cette requête dans l'éditeur SQL :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'username_ideas';
```

**Résultat attendu :** Vous devriez voir `username_ideas` dans les résultats.

### Vérifier la structure de la table

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'username_ideas'
ORDER BY ordinal_position;
```

**Résultat attendu :**
- `id` (uuid, NOT NULL)
- `pseudo` (varchar, NOT NULL)
- `social_network_id` (uuid, NOT NULL)
- `user_id` (uuid, NOT NULL)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### Vérifier les contraintes

```sql
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'public.username_ideas'::regclass;
```

**Résultat attendu :** Au moins une contrainte `unique_pseudo_per_network`

## 🔧 Dépannage

### Erreur : "relation already exists"
- **Cause :** La table existe déjà
- **Solution :** C'est normal, le script utilise `IF NOT EXISTS` donc il ignore cette erreur

### Erreur : "permission denied"
- **Cause :** Pas les permissions nécessaires
- **Solution :** Assurez-vous d'être connecté en tant qu'administrateur de la base de données

### Erreur : "column already exists"
- **Cause :** Les colonnes existent déjà
- **Solution :** C'est normal, le script utilise `IF NOT EXISTS` donc il ignore cette erreur

## 📝 Notes

- La table sera créée dans le schéma `public`
- Les politiques RLS (Row Level Security) sont activées
- Les index sont créés automatiquement pour améliorer les performances

## 🎯 Après la création

Une fois la table créée, vous pourrez :
- ✅ Publier des pseudos via `/publish`
- ✅ Voir les pseudos sur `/community/usernames`
- ✅ Filtrer par réseau social
- ✅ Ajouter en favoris

