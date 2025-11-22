# 🚀 Guide d'Intégration d'APIs pour Enrichir votre Base de Données

## 📋 **Résumé**

Ce guide vous explique comment **automatiquement enrichir votre base de données d'événements** en utilisant des **APIs gratuites** qui récupèrent :
- 📅 **Jours fériés** (France et autres pays)
- 📚 **Événements historiques** 
- 🎂 **Anniversaires de célébrités**
- 💀 **Décès de personnalités**

## ⚡ **Démarrage Rapide (5 minutes)**

### 1. **Tester les APIs**
```bash
npm run test-apis
```
✅ **Résultat attendu** : 2-3 APIs fonctionnent sur 3 testées

### 2. **Enrichir votre base de données**
```bash
npm run enrich-events
```
✅ **Résultat** : Votre base de données sera remplie automatiquement !

## 🔧 **Configuration Avancée**

### **Variables d'environnement requises**
Créez un fichier `.env` à la racine du projet :
```bash
# Supabase (obligatoire)
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# APIs optionnelles (payantes)
IMDB_API_KEY=votre_clé_imdb
ABSTRACT_HOLIDAY_API_KEY=votre_clé_abstract
```

### **Commandes disponibles**
```bash
# Tester les APIs
npm run test-apis

# Enrichir la base de données
npm run enrich-events

# Voir les événements récents
npm run enrich-events show

# Nettoyer les anciens événements
npm run enrich-events cleanup

# Tout faire d'un coup
npm run enrich-events all
```

## 📊 **APIs Intégrées**

### ✅ **APIs Gratuites (Fonctionnelles)**
| API | Description | Données |
|-----|-------------|---------|
| **Holiday API** | Jours fériés par pays | 11 jours fériés FR/2024 |
| **On This Day** | Événements historiques | Événements + Anniversaires + Décès |

### ❌ **APIs avec Problèmes**
| API | Problème | Solution |
|-----|----------|----------|
| **Wikipedia** | Timeout | API lente, désactivée |

### 💰 **APIs Payantes (Optionnelles)**
| API | Coût | Données |
|-----|------|---------|
| **IMDb** | ~$10/mois | Anniversaires célébrités |
| **Abstract Holiday** | ~$5/mois | Jours fériés avancés |

## 📈 **Résultats Attendus**

### **Après enrichissement, vous aurez :**
- 🎉 **11 jours fériés** français pour 2024
- 📚 **~150 événements historiques** pour les 30 prochains jours
- 🎂 **~100 anniversaires** de personnalités
- 💀 **~50 décès** de personnalités

### **Types d'événements créés :**
```sql
-- Exemples d'événements ajoutés
INSERT INTO daily_events VALUES
('holiday', 'Jour de l''an', 'Jour férié en FR', '2024-01-01', 'Fériés'),
('historical_event', 'Premier vol commercial', 'Événement historique', '2024-01-15', 'Événements historiques'),
('birthday', 'Anniversaire de Martin Luther King', 'Anniversaire de naissance', '2024-01-15', 'Personnalités'),
('death', 'Décès de Salvador Dalí', 'Date de décès', '2024-01-23', 'Personnalités');
```

## 🔄 **Automatisation**

### **Mise à jour quotidienne (Recommandé)**
```bash
# Ajouter à votre crontab
0 2 * * * cd /path/to/creatik && npm run enrich-events
```

### **GitHub Actions (Automatique)**
```yaml
name: Enrich Events Database
on:
  schedule:
    - cron: '0 2 * * *'  # Tous les jours à 2h du matin

jobs:
  enrich:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run enrich-events
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## 🛠️ **Dépannage**

### **Erreur : "Variables d'environnement manquantes"**
```bash
# Vérifiez votre fichier .env
cat .env

# Assurez-vous d'avoir :
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon
```

### **Erreur : "Table daily_events n'existe pas"**
```bash
# Exécutez d'abord la migration
psql -h votre-host -U votre-user -d votre-db -f scripts/setup-daily-events-system.sql
```

### **APIs ne répondent pas**
```bash
# Testez votre connexion internet
curl https://date.nager.at/api/v3/PublicHolidays/2024/FR

# Si ça marche, réessayez
npm run test-apis
```

## 📝 **Exemples d'Utilisation**

### **Voir ce qui a été ajouté**
```bash
npm run enrich-events show
```

### **Ajouter seulement les jours fériés**
```bash
# Modifiez le script pour ne récupérer que les fériés
node scripts/enrich-events.mjs holidays-only
```

### **Ajouter des pays supplémentaires**
```bash
# Modifiez le script pour ajouter d'autres pays
# FR, US, GB, DE, ES, IT, CA, AU
```

## 🎯 **Prochaines Étapes**

1. **Testez** : `npm run test-apis`
2. **Enrichissez** : `npm run enrich-events`
3. **Vérifiez** : Allez sur votre page `/events`
4. **Automatisez** : Configurez GitHub Actions ou cron

## 📞 **Support**

Si vous rencontrez des problèmes :
1. Vérifiez les logs d'erreur
2. Testez votre connexion internet
3. Vérifiez vos variables d'environnement
4. Consultez `scripts/README-APIs.md` pour plus de détails

---

**🎉 Votre base de données sera automatiquement enrichie avec des centaines d'événements !**
