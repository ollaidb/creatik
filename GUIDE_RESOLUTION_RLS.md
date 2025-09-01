# 🚨 Guide de Résolution du Problème RLS

## ❌ **Problème Rencontré**
```
❌ Erreur lors de l'insertion: new row violates row-level security policy for table "daily_events"
```

## 🔍 **Cause du Problème**
Le **RLS (Row Level Security)** de Supabase bloque l'insertion d'événements car les politiques de sécurité sont trop restrictives.

## 🛠️ **Solutions Disponibles**

### **Option 1 : Désactiver RLS Temporairement (RECOMMANDÉ pour les tests)**

1. **Allez dans votre dashboard Supabase**
2. **SQL Editor** → **New Query**
3. **Exécutez ce script :**
```sql
-- Désactiver RLS temporairement
ALTER TABLE daily_events DISABLE ROW LEVEL SECURITY;

-- Vérifier
SELECT 'RLS désactivé' as status;
```

4. **Testez à nouveau :**
```bash
npm run enrich-events
```

### **Option 2 : Corriger les Politiques RLS**

1. **Exécutez le script complet :**
```sql
-- Dans SQL Editor de Supabase
-- Copiez le contenu de scripts/fix-rls-policies.sql
```

2. **Ou exécutez directement :**
```sql
-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read access to daily_events" ON daily_events;
DROP POLICY IF EXISTS "Allow admin insert on daily_events" ON daily_events;
DROP POLICY IF EXISTS "Allow admin update on daily_events" ON daily_events;

-- Créer de nouvelles politiques permissives
CREATE POLICY "Allow public read access to daily_events" ON daily_events
    FOR SELECT USING (true);

CREATE POLICY "Allow insert on daily_events" ON daily_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on daily_events" ON daily_events
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete on daily_events" ON daily_events
    FOR DELETE USING (true);
```

## ✅ **Vérification**

Après avoir appliqué une solution, vérifiez que ça fonctionne :

```bash
npm run enrich-events
```

**Résultat attendu :**
```
✅ 11 événements récupérés depuis holidays
✅ 11 nouveaux événements ajoutés à la base de données
```

## 🔒 **Sécurité**

### **Pour la Production :**
- **Réactivez RLS** après les tests
- **Configurez des politiques appropriées** selon vos besoins
- **Utilisez des clés d'API sécurisées**

### **Pour le Développement :**
- **RLS désactivé** est acceptable pour les tests
- **Gardez vos variables d'environnement** sécurisées

## 📋 **Commandes Utiles**

```bash
# Tester les APIs
npm run test-apis

# Enrichir la base (après correction RLS)
npm run enrich-events

# Voir les événements ajoutés
npm run enrich-events show
```

## 🆘 **Si le Problème Persiste**

1. **Vérifiez votre connexion Supabase**
2. **Vérifiez vos variables d'environnement**
3. **Vérifiez que la table daily_events existe**
4. **Vérifiez que les catégories existent**

---

**🎯 Objectif : Remplir votre base de données avec des centaines d'événements automatiquement !**
