// Script pour nettoyer la session et permettre l'accès normal
console.log('🧹 Nettoyage de la session...');

// Nettoyer le localStorage
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.startsWith('user_') || key.startsWith('challenge_') || key.startsWith('playlist_') || key.startsWith('welcome_shown_') || key === 'just_logged_out')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Supprimé: ${key}`);
});

console.log('✅ Session nettoyée ! Vous pouvez maintenant accéder à la page de profil.');
console.log('📝 Redirigez vers /profile pour tester la connexion.');
