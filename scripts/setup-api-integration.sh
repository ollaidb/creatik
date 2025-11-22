#!/bin/bash

echo "🚀 Configuration de l'intégration d'APIs pour Creatik..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js et npm sont installés"

# Installer les dépendances nécessaires
echo "📦 Installation des dépendances..."

# Créer un package.json temporaire si nécessaire
if [ ! -f "package.json" ]; then
    echo "📝 Création d'un package.json..."
    npm init -y
fi

# Installer les dépendances pour les scripts d'API
echo "🔧 Installation des packages nécessaires..."
npm install --save-dev @supabase/supabase-js axios dotenv

echo "✅ Dépendances installées"

# Créer le fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "🔐 Création du fichier .env..."
    cat > .env << EOF
# Configuration Supabase
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Configuration des APIs (optionnel)
WIKIPEDIA_API_KEY=your_wikipedia_api_key_here
HOLIDAY_API_KEY=your_holiday_api_key_here
EOF
    echo "⚠️  Veuillez configurer vos clés API dans le fichier .env"
else
    echo "✅ Fichier .env existe déjà"
fi

# Créer un script npm pour faciliter l'exécution
echo "📝 Ajout des scripts npm..."

# Vérifier si les scripts existent déjà
if ! grep -q "enrich-events" package.json; then
    # Ajouter les scripts au package.json
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['enrich-events'] = 'node scripts/fetch-events-from-apis.js';
    pkg.scripts['setup-events-db'] = 'node scripts/setup-daily-events-system.sql';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    echo "✅ Scripts npm ajoutés"
else
    echo "✅ Scripts npm existent déjà"
fi

# Créer un fichier de configuration pour les APIs
echo "⚙️  Création du fichier de configuration des APIs..."
cat > scripts/api-config.js << 'EOF'
// Configuration des APIs pour l'enrichissement des événements
module.exports = {
  // APIs gratuites (pas de clé requise)
  free: {
    wikipedia: {
      url: 'https://fr.wikipedia.org/api/rest_v1/feed/onthisday/all',
      rateLimit: 1000, // ms entre les requêtes
      maxRequests: 100 // par jour
    },
    holidays: {
      url: 'https://date.nager.at/api/v3/PublicHolidays',
      rateLimit: 500,
      maxRequests: 1000
    },
    onThisDay: {
      url: 'https://history.muffinlabs.com/date',
      rateLimit: 1000,
      maxRequests: 100
    }
  },
  
  // APIs payantes (clés requises)
  paid: {
    imdb: {
      url: 'https://imdb-api.com/API',
      key: process.env.IMDB_API_KEY,
      rateLimit: 2000,
      maxRequests: 100
    },
    abstractHoliday: {
      url: 'https://holidays.abstractapi.com/v1/',
      key: process.env.ABSTRACT_HOLIDAY_API_KEY,
      rateLimit: 1000,
      maxRequests: 1000
    }
  },
  
  // Configuration des pays supportés
  countries: ['FR', 'US', 'GB', 'DE', 'ES', 'IT', 'CA', 'AU'],
  
  // Configuration des catégories
  categories: {
    'Personnalités': { color: '#3B82F6', icon: '👤' },
    'Événements historiques': { color: '#EF4444', icon: '📜' },
    'Fériés': { color: '#10B981', icon: '🎉' },
    'Journées internationales': { color: '#8B5CF6', icon: '🌍' },
    'Musiciens': { color: '#F59E0B', icon: '🎵' },
    'Acteurs': { color: '#EC4899', icon: '🎬' },
    'Écrivains': { color: '#06B6D4', icon: '📚' },
    'Scientifiques': { color: '#84CC16', icon: '🔬' },
    'Sportifs': { color: '#F97316', icon: '⚽' },
    'Politiciens': { color: '#6366F1', icon: '🏛️' },
    'Artistes': { color: '#A855F7', icon: '🎨' }
  }
};
EOF

echo "✅ Configuration des APIs créée"

# Créer un script de test
echo "🧪 Création d'un script de test..."
cat > scripts/test-apis.js << 'EOF'
const { fetchFromAPI } = require('./fetch-events-from-apis');

async function testAPIs() {
  console.log('🧪 Test des APIs...');
  
  try {
    // Test Wikipedia API
    console.log('\n📚 Test Wikipedia API...');
    const wikiEvents = await fetchFromAPI('wikipedia', { date: '2024-01-01' });
    console.log(`✅ ${wikiEvents.length} événements récupérés de Wikipedia`);
    
    // Test Holiday API
    console.log('\n🎉 Test Holiday API...');
    const holidays = await fetchFromAPI('holidays', { year: 2024, country: 'FR' });
    console.log(`✅ ${holidays.length} jours fériés récupérés`);
    
    // Test On This Day API
    console.log('\n📅 Test On This Day API...');
    const onThisDayEvents = await fetchFromAPI('onThisDay', { date: '2024-01-01' });
    console.log(`✅ ${onThisDayEvents.length} événements récupérés de On This Day`);
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

if (require.main === module) {
  testAPIs();
}
EOF

echo "✅ Script de test créé"

# Créer un README pour l'utilisation
echo "📖 Création de la documentation..."
cat > scripts/README-APIs.md << 'EOF'
# 🚀 Intégration d'APIs pour l'Enrichissement des Événements

## 📋 Prérequis

1. **Node.js** et **npm** installés
2. **Compte Supabase** configuré
3. **Variables d'environnement** configurées dans `.env`

## ⚙️ Configuration

### 1. Variables d'environnement
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# APIs optionnelles (payantes)
IMDB_API_KEY=your_imdb_api_key
ABSTRACT_HOLIDAY_API_KEY=your_abstract_api_key
```

### 2. Installation
```bash
# Installer les dépendances
npm install

# Configurer l'intégration
chmod +x scripts/setup-api-integration.sh
./scripts/setup-api-integration.sh
```

## 🚀 Utilisation

### Enrichir la base de données
```bash
npm run enrich-events
```

### Tester les APIs
```bash
node scripts/test-apis.js
```

### Nettoyer les anciens événements
```bash
node scripts/fetch-events-from-apis.js cleanup
```

## 📊 APIs Intégrées

### ✅ APIs Gratuites
- **Wikipedia** - Événements historiques
- **Holiday API** - Jours fériés par pays
- **On This Day** - Événements divers

### 💰 APIs Payantes (optionnelles)
- **IMDb** - Anniversaires de célébrités
- **Abstract Holiday** - Jours fériés avancés

## 🔄 Automatisation

### Cron Job (Linux/Mac)
```bash
# Ajouter à crontab pour exécution quotidienne
0 2 * * * cd /path/to/creatik && npm run enrich-events
```

### GitHub Actions
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

## 📈 Monitoring

Le script génère des logs détaillés :
- ✅ Événements récupérés
- ❌ Erreurs d'API
- 📊 Statistiques d'insertion
- 🧹 Nettoyage automatique

## 🔧 Personnalisation

Modifiez `scripts/api-config.js` pour :
- Ajouter de nouvelles APIs
- Configurer les limites de taux
- Personnaliser les catégories
- Ajuster les pays supportés
EOF

echo "✅ Documentation créée"

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos clés API dans le fichier .env"
echo "2. Testez les APIs : node scripts/test-apis.js"
echo "3. Enrichissez votre base : npm run enrich-events"
echo ""
echo "📖 Consultez scripts/README-APIs.md pour plus d'informations"
