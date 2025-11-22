# Service d'Extraction d'Avatars (Futur)

## 🎯 Objectif
Extraire automatiquement les photos de profil des comptes sociaux

## 🔧 Solutions techniques

### 1. **API TikTok Business** (Recommandée)
```javascript
// Exemple d'implémentation future
const getTikTokAvatar = async (username) => {
  const response = await fetch(`https://api.tiktok.com/user/info?username=${username}`, {
    headers: {
      'Authorization': 'Bearer YOUR_TIKTOK_API_KEY'
    }
  });
  return response.json();
};
```

### 2. **Web Scraping avec Puppeteer**
```javascript
// Alternative si pas d'API
const scrapeAvatar = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const avatarUrl = await page.$eval('.avatar img', img => img.src);
  await browser.close();
  return avatarUrl;
};
```

### 3. **Service tiers (LinkPreview, OpenGraph)**
```javascript
// Utiliser les métadonnées OpenGraph
const getOpenGraphImage = async (url) => {
  const response = await fetch(`https://api.linkpreview.net/?key=YOUR_KEY&q=${url}`);
  const data = await response.json();
  return data.image;
};
```

## 📋 Implémentation recommandée

1. **Phase 1** : Avatars par défaut (actuel)
2. **Phase 2** : Service d'extraction simple
3. **Phase 3** : API complète avec cache

## 🚀 Avantages
- ✅ Expérience utilisateur améliorée
- ✅ Cohérence visuelle
- ✅ Pas de dépendance externe

## ⚠️ Considérations
- 🔒 Respect des TOS des plateformes
- 🐌 Performance (cache nécessaire)
- 💰 Coût des APIs tierces 