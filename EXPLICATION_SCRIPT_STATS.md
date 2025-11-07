# 📖 Explication du Script de Récupération Automatique des Statistiques

## 🎯 Vue d'ensemble

Ce script automatise complètement la récupération des statistiques des réseaux sociaux (nombre de followers, abonnés, etc.) pour tous les créateurs de contenu présents dans votre base de données. Il utilise un **système hybride intelligent** qui combine plusieurs méthodes de récupération de données pour garantir le meilleur taux de réussite possible, même sans clés API.

## 🔄 Fonctionnement en Détail

### **Étape 1: Initialisation et Configuration**

Le script commence par charger les variables d'environnement (clés API optionnelles) et établit une connexion avec votre base de données Supabase. Il vérifie quelles APIs sont disponibles en fonction des clés que vous avez configurées (ou non configurées) dans votre fichier `.env`. **Important : Le script fonctionne même sans aucune clé API** - il utilisera automatiquement le scraping OpenGraph comme méthode de secours.

### **Étape 2: Récupération de la Liste des Créateurs**

Le script interroge votre base de données Supabase pour récupérer tous les créateurs et leurs réseaux sociaux associés. Pour chaque créateur, il obtient :
- Le nom du créateur
- Les réseaux sociaux (Instagram, YouTube, TikTok, etc.)
- Les URLs de profil
- Les usernames
- Les statistiques actuelles (s'il y en a)

### **Étape 3: Système Hybride de Récupération (4 Méthodes en Cascade)**

Pour chaque réseau social, le script essaie **automatiquement** plusieurs méthodes dans l'ordre suivant, en passant à la suivante si la précédente échoue :

#### **Méthode 1 : YouTube Data API v3 (Officielle - Gratuite)**
- **Quand :** Uniquement pour les chaînes YouTube
- **Comment :** Utilise l'API officielle de Google si vous avez configuré une clé API YouTube
- **Avantages :** Très précis, données officielles
- **Quota :** 10,000 requêtes/jour (gratuit)
- **Si échec :** Passe automatiquement à la méthode suivante

#### **Méthode 2 : RapidAPI (Service Tiers - Gratuit)**
- **Quand :** Pour Instagram et TikTok
- **Comment :** Utilise les APIs de scraping disponibles sur RapidAPI
- **Avantages :** Données précises pour Instagram et TikTok
- **Quota :** 500 requêtes/mois (gratuit)
- **Si échec :** Passe automatiquement à la méthode suivante

#### **Méthode 3 : LinkPreview API (Service Tiers - Gratuit)**
- **Quand :** Pour tous les réseaux sociaux
- **Comment :** Récupère les métadonnées OpenGraph des pages de profil
- **Avantages :** Fonctionne pour tous les réseaux, extraction intelligente
- **Quota :** 10,000 requêtes/mois (gratuit)
- **Si échec :** Passe automatiquement à la méthode suivante

#### **Méthode 4 : OpenGraph Scraping Direct (Toujours Disponible)**
- **Quand :** Toutes les autres méthodes ont échoué (ou aucune clé API configurée)
- **Comment :** Télécharge directement la page HTML du profil et extrait les informations depuis les balises meta et le contenu de la page
- **Avantages :** **Aucune clé API requise**, fonctionne pour tous les réseaux, quota illimité
- **Limitations :** Peut être moins précis que les APIs officielles, peut être bloqué par certains sites

### **Étape 4 : Extraction et Parsing Intelligent**

Pour chaque méthode, le script extrait le nombre de followers/abonnés depuis différentes sources :
- **Meta tags OpenGraph** : `<meta property="og:description" content="...">`
- **Données JSON structurées** : Informations dans les scripts JSON-LD
- **Sélecteurs CSS spécifiques** : Éléments HTML spécifiques à chaque plateforme
- **Parsing de texte intelligent** : Reconnaissance de formats comme "12.5K followers", "1.2M abonnés", etc.

Le script convertit automatiquement les formats abrégés (K, M, B) en nombres complets :
- "12.5K" → 12,500
- "1.2M" → 1,200,000
- "500B" → 500,000,000

### **Étape 5 : Mise à Jour de la Base de Données**

Une fois les statistiques récupérées avec succès, le script met à jour automatiquement la base de données Supabase :
- Met à jour le nombre de followers dans la table `creator_social_networks`
- Met à jour le statut "verified" si disponible
- Conserve les anciennes valeurs si aucune nouvelle donnée n'a pu être récupérée

### **Étape 6 : Calcul des Scores d'Activité**

Après avoir mis à jour toutes les statistiques, le script déclenche automatiquement le calcul des scores d'activité pour chaque réseau social. Ces scores sont utilisés pour déterminer les 4 réseaux sociaux les plus actifs de chaque créateur. Le score est calculé en fonction de :
- Le nombre de followers (plus de followers = score plus élevé)
- Le nombre de défis actifs liés à ce réseau
- Le statut "réseau principal" (bonus de 50 points)

### **Étape 7 : Rapport Final**

Le script génère un rapport détaillé affichant :
- Le nombre de réseaux sociaux mis à jour avec succès
- Le nombre d'erreurs rencontrées
- La méthode utilisée pour chaque réseau (pour voir quelle méthode fonctionne le mieux)
- Des statistiques sur les méthodes les plus utilisées

## 🛡️ Gestion des Erreurs et Robustesse

Le script est conçu pour être **très robuste** :
- **Gestion des timeouts** : Chaque requête a un délai d'attente pour éviter les blocages
- **Gestion du rate limiting** : Délai de 2 secondes entre chaque requête pour éviter d'être bloqué
- **Fallback automatique** : Si une méthode échoue, passage automatique à la suivante
- **Conservation des données** : Si aucune nouvelle donnée n'est récupérée, les anciennes valeurs sont conservées
- **Gestion des erreurs réseau** : Les erreurs sont capturées et loggées sans interrompre le processus

## 📊 Avantages du Système Hybride

1. **Aucune dépendance obligatoire** : Fonctionne même sans aucune clé API
2. **Taux de réussite élevé** : Plusieurs méthodes garantissent qu'au moins une fonctionnera
3. **Coût zéro** : Toutes les méthodes utilisées sont gratuites
4. **Mise à jour automatique** : Un seul script met à jour tous les créateurs
5. **Scalable** : Peut gérer des dizaines ou centaines de créateurs
6. **Intelligent** : Choisit automatiquement la meilleure méthode disponible

## 🚀 Utilisation

Le script peut être exécuté manuellement ou programmé pour s'exécuter automatiquement (par exemple, tous les jours via un cron job). Une fois exécuté, il mettra à jour toutes les statistiques des créateurs présents dans votre base de données, permettant à votre application d'afficher automatiquement les 4 réseaux sociaux les plus actifs pour chaque créateur.

## 📝 Note Importante

Ce script est conçu pour fonctionner avec des données déjà présentes dans votre base de données. Si vous n'avez pas encore de créateurs dans votre base de données, le script vous informera et attendra que vous ajoutiez des données. Une fois les créateurs ajoutés (même manuellement via l'interface Supabase), le script pourra immédiatement récupérer et mettre à jour leurs statistiques automatiquement.

