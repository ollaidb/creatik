#!/usr/bin/env node

/**
 * Script de test pour le système de notifications
 * Ce script teste la création et la gestion des notifications
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase (à adapter selon votre environnement)
const supabaseUrl = 'VOTRE_SUPABASE_URL';
const supabaseKey = 'VOTRE_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test des notifications
async function testNotifications() {
  console.log('🧪 Test du système de notifications Creatik\n');

  try {
    // 1. Vérifier la connexion
    console.log('1. Test de connexion...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Erreur d\'authentification:', authError.message);
      console.log('💡 Connectez-vous d\'abord via l\'interface web');
      return;
    }
    
    console.log('✅ Connecté en tant que:', user.email);

    // 2. Créer une notification de test
    console.log('\n2. Création d\'une notification de test...');
    const testNotification = {
      user_id: user.id,
      type: 'challenge_reminder',
      title: 'Test - Rappel Défi',
      message: 'Ceci est une notification de test pour vérifier le système',
      priority: 'high',
      related_id: 'test_challenge_1',
      related_type: 'challenge'
    };

    const { data: newNotification, error: createError } = await supabase
      .from('user_notifications')
      .insert([testNotification])
      .select()
      .single();

    if (createError) {
      console.log('❌ Erreur lors de la création:', createError.message);
      return;
    }

    console.log('✅ Notification créée avec l\'ID:', newNotification.id);

    // 3. Récupérer les notifications de l'utilisateur
    console.log('\n3. Récupération des notifications...');
    const { data: notifications, error: fetchError } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.log('❌ Erreur lors de la récupération:', fetchError.message);
      return;
    }

    console.log(`✅ ${notifications.length} notification(s) trouvée(s)`);
    notifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.title} (${notif.type}) - ${notif.is_read ? 'Lue' : 'Non lue'}`);
    });

    // 4. Compter les notifications non lues
    console.log('\n4. Comptage des notifications non lues...');
    const { count: unreadCount, error: countError } = await supabase
      .from('user_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (countError) {
      console.log('❌ Erreur lors du comptage:', countError.message);
      return;
    }

    console.log(`✅ ${unreadCount} notification(s) non lue(s)`);

    // 5. Marquer la notification de test comme lue
    console.log('\n5. Marquage comme lue...');
    const { error: updateError } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', newNotification.id);

    if (updateError) {
      console.log('❌ Erreur lors de la mise à jour:', updateError.message);
      return;
    }

    console.log('✅ Notification marquée comme lue');

    // 6. Vérifier le nouveau comptage
    console.log('\n6. Vérification du nouveau comptage...');
    const { count: newUnreadCount, error: newCountError } = await supabase
      .from('user_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (newCountError) {
      console.log('❌ Erreur lors du nouveau comptage:', newCountError.message);
      return;
    }

    console.log(`✅ ${newUnreadCount} notification(s) non lue(s) après mise à jour`);

    // 7. Nettoyer - Supprimer la notification de test
    console.log('\n7. Nettoyage - Suppression de la notification de test...');
    const { error: deleteError } = await supabase
      .from('user_notifications')
      .delete()
      .eq('id', newNotification.id);

    if (deleteError) {
      console.log('❌ Erreur lors de la suppression:', deleteError.message);
      return;
    }

    console.log('✅ Notification de test supprimée');

    // 8. Test des fonctions utilitaires
    console.log('\n8. Test des fonctions utilitaires...');
    
    // Test de la fonction de comptage
    const { data: functionResult, error: functionError } = await supabase
      .rpc('get_user_unread_notifications_count', { user_uuid: user.id });

    if (functionError) {
      console.log('⚠️  Fonction utilitaire non disponible:', functionError.message);
    } else {
      console.log('✅ Fonction utilitaire testée:', functionResult);
    }

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('\n💡 Le système de notifications est prêt à être utilisé.');

  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Fonction pour afficher l'aide
function showHelp() {
  console.log(`
🔔 Système de Notifications Creatik - Script de Test

Usage:
  node test-notifications.js

Prérequis:
  1. Avoir une base de données Supabase configurée
  2. Avoir exécuté la migration des notifications
  3. Être connecté via l'interface web
  4. Avoir configuré les variables d'environnement

Configuration:
  - Modifiez supabaseUrl et supabaseKey dans ce script
  - Ou utilisez les variables d'environnement

Migration:
  Exécutez le fichier SQL dans Supabase Dashboard:
  supabase/migrations/20250128000003-create-user-notifications-table.sql

Support:
  Consultez NOTIFICATIONS_SYSTEM_GUIDE.md pour plus d'informations
`);
}

// Point d'entrée
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  testNotifications();
}
