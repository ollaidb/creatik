#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eiuhcgvvexoshuopvska.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDM5MjMsImV4cCI6MjA2MzkxOTkyM30.OqFLbnFM3A01feA3NmVYXgnDep9yDghPby8HhxcvOqI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUserNotificationsTable() {
  console.log('🔍 Vérification de la table user_notifications...\n');

  try {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.log('❌ La table user_notifications est introuvable.');
        console.log('💡 Exécutez la migration supabase/migrations/20250128000003-create-user-notifications-table.sql');
      } else if (error.code === '42501') {
        console.log('❌ Accès refusé à la table user_notifications (RLS ou permissions).');
        console.log('💡 Vérifiez les policies RLS et assurez-vous que la clé utilisée a les droits nécessaires.');
      } else {
        console.log(`❌ Erreur lors de la requête: ${error.message} (code ${error.code ?? 'inconnu'})`);
      }
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Table user_notifications trouvée. ${data.length} enregistrement(s) aperçu(s).`);
    } else {
      console.log('✅ Table user_notifications trouvée mais aucune donnée (0 enregistrement).');
    }
  } catch (err) {
    console.error('❌ Erreur inattendue:', err);
  }
}

checkUserNotificationsTable();

