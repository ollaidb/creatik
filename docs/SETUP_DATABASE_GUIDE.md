# Guide de Configuration de la Base de Données

## Étape 1: Accéder à votre Dashboard Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet Creatik

## Étape 2: Ouvrir l'éditeur SQL

1. Dans le menu de gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"** pour créer une nouvelle requête

## Étape 3: Copier et Exécuter le Script

1. Ouvrez le fichier `scripts/setup-events-database.sql` dans votre éditeur
2. Copiez tout le contenu du fichier
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **"Run"** pour exécuter le script

## Étape 4: Vérifier l'Exécution

Le script va :
- ✅ Créer les tables `event_categories` et `daily_events`
- ✅ Ajouter les colonnes Wikipédia nécessaires
- ✅ Créer les index pour optimiser les performances
- ✅ Insérer les catégories par défaut
- ✅ Insérer des événements d'exemple
- ✅ Créer les fonctions et vues pour Wikipédia
- ✅ Configurer les politiques de sécurité (RLS)

## Étape 5: Vérifier les Tables

Après l'exécution, vous devriez voir :
1. Dans **"Table Editor"** → **"daily_events"** : vos événements
2. Dans **"Table Editor"** → **"event_categories"** : vos catégories

## Étape 6: Tester l'Application

Une fois le script exécuté, votre application devrait :
- ✅ Afficher les événements sur la page d'accueil
- ✅ Afficher les événements sur la page `/events`
- ✅ Permettre la synchronisation avec Wikipédia

## En Cas de Problème

Si vous rencontrez des erreurs :
1. Vérifiez que vous êtes connecté avec le bon projet
2. Assurez-vous d'avoir les permissions d'administrateur
3. Contactez-moi avec le message d'erreur exact

## Prochaines Étapes

Une fois cette configuration terminée, nous pourrons :
1. Lancer la synchronisation Wikipédia
2. Enrichir les données avec de vrais événements
3. Optimiser les performances

---

**Note :** Ce script est sécurisé et utilise `IF NOT EXISTS` pour éviter les conflits avec des tables existantes. 