#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES CATASTROPHE / ERREUR ===\n');

        // 1. Récupérer la catégorie
        console.log('🔍 Recherche de la catégorie...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .or('name.ilike.%catastrophe%,name.ilike.%erreur%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Catastrophe / erreur" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const catastropheErreurSubcategories = [
            // Catastrophes naturelles
            { name: 'Tremblements de terre', description: 'Contenu sur les séismes et tremblements de terre' },
            { name: 'Tsunamis', description: 'Contenu sur les tsunamis' },
            { name: 'Inondations', description: 'Contenu sur les inondations' },
            { name: 'Sécheresses', description: 'Contenu sur les sécheresses' },
            { name: 'Orages', description: 'Contenu sur les orages violents' },
            { name: 'Tornades', description: 'Contenu sur les tornades' },
            { name: 'Ouragans', description: 'Contenu sur les ouragans et cyclones' },
            { name: 'Typhons', description: 'Contenu sur les typhons' },
            { name: 'Tempêtes', description: 'Contenu sur les tempêtes' },
            { name: 'Avalanches', description: 'Contenu sur les avalanches' },
            { name: 'Glissements de terrain', description: 'Contenu sur les glissements de terrain' },
            { name: 'Éruptions volcaniques', description: 'Contenu sur les éruptions volcaniques' },
            { name: 'Volcans', description: 'Contenu sur les volcans' },
            { name: 'Feux de forêt', description: 'Contenu sur les feux de forêt' },
            { name: 'Incendies', description: 'Contenu sur les incendies' },
            { name: 'Blizzards', description: 'Contenu sur les blizzards et tempêtes de neige' },
            { name: 'Vagues de chaleur', description: 'Contenu sur les vagues de chaleur' },
            { name: 'Vagues de froid', description: 'Contenu sur les vagues de froid' },
            { name: 'Grêle', description: 'Contenu sur les tempêtes de grêle' },
            { name: 'Foudre', description: 'Contenu sur les impacts de foudre' },
            
            // Catastrophes technologiques
            { name: 'Accidents industriels', description: 'Contenu sur les accidents industriels' },
            { name: 'Explosions', description: 'Contenu sur les explosions' },
            { name: 'Fuites chimiques', description: 'Contenu sur les fuites chimiques' },
            { name: 'Accidents nucléaires', description: 'Contenu sur les accidents nucléaires' },
            { name: 'Pannes électriques', description: 'Contenu sur les pannes électriques massives' },
            { name: 'Pannes informatiques', description: 'Contenu sur les pannes informatiques' },
            { name: 'Cyberattaques', description: 'Contenu sur les cyberattaques majeures' },
            { name: 'Pannes de réseau', description: 'Contenu sur les pannes de réseau' },
            
            // Accidents de transport
            { name: 'Accidents de la route', description: 'Contenu sur les accidents de la route' },
            { name: 'Accidents de train', description: 'Contenu sur les accidents ferroviaires' },
            { name: 'Accidents d\'avion', description: 'Contenu sur les accidents aériens' },
            { name: 'Accidents maritimes', description: 'Contenu sur les accidents maritimes' },
            { name: 'Naufrages', description: 'Contenu sur les naufrages' },
            { name: 'Crashs aériens', description: 'Contenu sur les crashs d\'avions' },
            { name: 'Déraillements', description: 'Contenu sur les déraillements de train' },
            { name: 'Collisions', description: 'Contenu sur les collisions' },
            
            // Erreurs humaines
            { name: 'Erreurs médicales', description: 'Contenu sur les erreurs médicales' },
            { name: 'Erreurs de jugement', description: 'Contenu sur les erreurs de jugement' },
            { name: 'Erreurs de communication', description: 'Contenu sur les erreurs de communication' },
            { name: 'Malentendus', description: 'Contenu sur les malentendus' },
            { name: 'Oublis', description: 'Contenu sur les oublis et leurs conséquences' },
            { name: 'Confusions', description: 'Contenu sur les confusions' },
            { name: 'Erreurs de calcul', description: 'Contenu sur les erreurs de calcul' },
            { name: 'Erreurs de frappe', description: 'Contenu sur les erreurs de frappe' },
            { name: 'Fautes d\'orthographe', description: 'Contenu sur les fautes d\'orthographe' },
            { name: 'Erreurs de traduction', description: 'Contenu sur les erreurs de traduction' },
            
            // Erreurs professionnelles
            { name: 'Erreurs au travail', description: 'Contenu sur les erreurs professionnelles' },
            { name: 'Erreurs de projet', description: 'Contenu sur les erreurs de gestion de projet' },
            { name: 'Erreurs budgétaires', description: 'Contenu sur les erreurs budgétaires' },
            { name: 'Erreurs de planning', description: 'Contenu sur les erreurs de planning' },
            { name: 'Erreurs de livraison', description: 'Contenu sur les erreurs de livraison' },
            { name: 'Erreurs de commande', description: 'Contenu sur les erreurs de commande' },
            { name: 'Erreurs de facturation', description: 'Contenu sur les erreurs de facturation' },
            
            // Erreurs technologiques
            { name: 'Bugs informatiques', description: 'Contenu sur les bugs informatiques' },
            { name: 'Pannes de système', description: 'Contenu sur les pannes de système' },
            { name: 'Erreurs de programmation', description: 'Contenu sur les erreurs de code' },
            { name: 'Erreurs de configuration', description: 'Contenu sur les erreurs de configuration' },
            { name: 'Perte de données', description: 'Contenu sur la perte de données' },
            { name: 'Erreurs de sauvegarde', description: 'Contenu sur les erreurs de sauvegarde' },
            { name: 'Virus informatiques', description: 'Contenu sur les virus et malwares' },
            { name: 'Piratage', description: 'Contenu sur les piratages et intrusions' },
            
            // Erreurs domestiques
            { name: 'Erreurs de cuisine', description: 'Contenu sur les erreurs culinaires' },
            { name: 'Erreurs de bricolage', description: 'Contenu sur les erreurs de bricolage' },
            { name: 'Erreurs de ménage', description: 'Contenu sur les erreurs de ménage' },
            { name: 'Erreurs de jardinage', description: 'Contenu sur les erreurs de jardinage' },
            { name: 'Accidents domestiques', description: 'Contenu sur les accidents domestiques' },
            { name: 'Oublis de clés', description: 'Contenu sur les oublis de clés' },
            { name: 'Oublis de rendez-vous', description: 'Contenu sur les oublis de rendez-vous' },
            
            // Erreurs financières
            { name: 'Erreurs bancaires', description: 'Contenu sur les erreurs bancaires' },
            { name: 'Erreurs de paiement', description: 'Contenu sur les erreurs de paiement' },
            { name: 'Erreurs de virement', description: 'Contenu sur les erreurs de virement' },
            { name: 'Erreurs de facture', description: 'Contenu sur les erreurs de facture' },
            { name: 'Oublis de paiement', description: 'Contenu sur les oublis de paiement' },
            { name: 'Dépenses imprévues', description: 'Contenu sur les dépenses imprévues' },
            
            // Erreurs relationnelles
            { name: 'Malentendus relationnels', description: 'Contenu sur les malentendus entre personnes' },
            { name: 'Erreurs de communication', description: 'Contenu sur les erreurs de communication interpersonnelle' },
            { name: 'Oublis d\'anniversaire', description: 'Contenu sur les oublis d\'anniversaire' },
            { name: 'Oublis d\'événement', description: 'Contenu sur les oublis d\'événements importants' },
            { name: 'Erreurs de cadeau', description: 'Contenu sur les erreurs de choix de cadeau' },
            
            // Catastrophes historiques
            { name: 'Catastrophes historiques', description: 'Contenu sur les catastrophes historiques' },
            { name: 'Titanic', description: 'Contenu sur le naufrage du Titanic' },
            { name: 'Tchernobyl', description: 'Contenu sur la catastrophe de Tchernobyl' },
            { name: 'Fukushima', description: 'Contenu sur la catastrophe de Fukushima' },
            { name: 'Pompeï', description: 'Contenu sur l\'éruption du Vésuve à Pompeï' },
            
            // Erreurs de navigation
            { name: 'Erreurs de navigation', description: 'Contenu sur les erreurs de navigation' },
            { name: 'Se perdre', description: 'Contenu sur les situations où on se perd' },
            { name: 'Mauvais itinéraire', description: 'Contenu sur les mauvais itinéraires' },
            { name: 'Erreurs GPS', description: 'Contenu sur les erreurs GPS' },
            
            // Erreurs de timing
            { name: 'Retards', description: 'Contenu sur les retards' },
            { name: 'Oublis d\'heure', description: 'Contenu sur les oublis d\'heure' },
            { name: 'Mauvais timing', description: 'Contenu sur le mauvais timing' },
            { name: 'Erreurs de fuseau horaire', description: 'Contenu sur les erreurs de fuseau horaire' },
            
            // Erreurs de choix
            { name: 'Mauvais choix', description: 'Contenu sur les mauvais choix' },
            { name: 'Erreurs de décision', description: 'Contenu sur les erreurs de décision' },
            { name: 'Regrets', description: 'Contenu sur les regrets et erreurs passées' },
            { name: 'Opportunités manquées', description: 'Contenu sur les opportunités manquées' },
            
            // Erreurs de préparation
            { name: 'Oublis de préparation', description: 'Contenu sur les oublis de préparation' },
            { name: 'Manque de préparation', description: 'Contenu sur le manque de préparation' },
            { name: 'Oublis d\'équipement', description: 'Contenu sur les oublis d\'équipement' },
            { name: 'Oublis de documents', description: 'Contenu sur les oublis de documents' },
            
            // Erreurs de sécurité
            { name: 'Erreurs de sécurité', description: 'Contenu sur les erreurs de sécurité' },
            { name: 'Oublis de verrouillage', description: 'Contenu sur les oublis de verrouillage' },
            { name: 'Oublis de mot de passe', description: 'Contenu sur les oublis de mot de passe' },
            { name: 'Perte d\'objets', description: 'Contenu sur la perte d\'objets' },
            
            // Erreurs de communication digitale
            { name: 'Erreurs de message', description: 'Contenu sur les erreurs de message' },
            { name: 'Envoi à la mauvaise personne', description: 'Contenu sur les envois à la mauvaise personne' },
            { name: 'Messages non envoyés', description: 'Contenu sur les messages non envoyés' },
            { name: 'Erreurs de publication', description: 'Contenu sur les erreurs de publication sur réseaux sociaux' },
            { name: 'Posts accidentels', description: 'Contenu sur les posts accidentels' },
            
            // Erreurs de mesure
            { name: 'Erreurs de mesure', description: 'Contenu sur les erreurs de mesure' },
            { name: 'Mauvaises dimensions', description: 'Contenu sur les mauvaises dimensions' },
            { name: 'Erreurs de calcul de quantité', description: 'Contenu sur les erreurs de calcul de quantité' },
            
            // Catastrophes écologiques
            { name: 'Catastrophes écologiques', description: 'Contenu sur les catastrophes écologiques' },
            { name: 'Marées noires', description: 'Contenu sur les marées noires' },
            { name: 'Pollution massive', description: 'Contenu sur la pollution massive' },
            { name: 'Déforestation', description: 'Contenu sur la déforestation' },
            { name: 'Extinction d\'espèces', description: 'Contenu sur l\'extinction d\'espèces' }
        ];

        console.log(`📊 ${catastropheErreurSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = catastropheErreurSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

        console.log(`📊 ${existing?.length || 0} sous-catégorie(s) existante(s)`);
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);

        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !\n');
            return;
        }

        // 4. Ajouter les sous-catégories
        console.log('💾 Ajout des sous-catégories...\n');

        const now = new Date().toISOString();
        const dataToInsert = toAdd.map(sub => ({
            name: sub.name,
            description: sub.description,
            category_id: category.id,
            created_at: now,
            updated_at: now
        }));

        // Insérer par batch de 50
        const batchSize = 50;
        let success = 0;
        let failed = 0;

        for (let i = 0; i < dataToInsert.length; i += batchSize) {
            const batch = dataToInsert.slice(i, i + batchSize);

            const { error } = await supabase
                .from('subcategories')
                .insert(batch);

            if (error) {
                // Essayer une par une
                for (const item of batch) {
                    const { error: singleError } = await supabase
                        .from('subcategories')
                        .insert(item);

                    if (singleError) {
                        if (singleError.message.includes('duplicate') || singleError.code === '23505') {
                            console.log(`   ⚠️  "${item.name}" existe déjà, ignoré`);
                            success++;
                        } else {
                            console.log(`   ❌ "${item.name}": ${singleError.message}`);
                            failed++;
                        }
                    } else {
                        console.log(`   ✅ "${item.name}" ajoutée`);
                        success++;
                    }
                }
            } else {
                batch.forEach(item => {
                    console.log(`   ✅ "${item.name}" ajoutée`);
                });
                success += batch.length;
            }
        }

        // 5. Résumé final
        console.log('\n📊 === RÉSUMÉ FINAL ===\n');

        const { data: finalSubcategories } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "${category.name}"`);
        console.log(`✅ ${success} nouvelle(s) sous-catégorie(s) ajoutée(s)`);
        if (failed > 0) {
            console.log(`❌ ${failed} échec(s)`);
        }
        console.log('\n🎉 Configuration terminée avec succès !\n');

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

