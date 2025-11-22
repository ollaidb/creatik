#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES MOTIVATION ===\n');

        // 1. Récupérer la catégorie Motivation
        console.log('🔍 Recherche de la catégorie "Motivation"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%motivation%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Motivation" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories motivation
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const motivationSubcategories = [
            // Motivation générale et quotidienne
            { name: 'Citations motivantes', description: 'Citations et phrases inspirantes pour la motivation quotidienne' },
            { name: 'Citations du matin', description: 'Citations pour commencer la journée avec motivation' },
            { name: 'Citations du soir', description: 'Citations pour terminer la journée positivement' },
            { name: 'Pensées positives', description: 'Pensées et affirmations positives' },
            { name: 'Affirmations', description: 'Affirmations quotidiennes pour renforcer la confiance' },
            
            // Motivation par objectif
            { name: 'Objectifs personnels', description: 'Motivation pour atteindre ses objectifs personnels' },
            { name: 'Objectifs professionnels', description: 'Motivation pour réussir professionnellement' },
            { name: 'Objectifs financiers', description: 'Motivation pour atteindre l\'indépendance financière' },
            { name: 'Objectifs santé', description: 'Motivation pour améliorer sa santé et son bien-être' },
            { name: 'Objectifs sportifs', description: 'Motivation pour atteindre ses objectifs sportifs' },
            { name: 'Objectifs créatifs', description: 'Motivation pour développer sa créativité' },
            { name: 'Objectifs académiques', description: 'Motivation pour réussir ses études' },
            
            // Motivation par domaine
            { name: 'Motivation sportive', description: 'Contenu pour motiver dans le sport et le fitness' },
            { name: 'Motivation professionnelle', description: 'Motivation pour avancer dans sa carrière' },
            { name: 'Motivation entrepreneuriale', description: 'Motivation pour créer et développer son entreprise' },
            { name: 'Motivation académique', description: 'Motivation pour réussir ses études et examens' },
            { name: 'Motivation créative', description: 'Motivation pour créer et exprimer sa créativité' },
            { name: 'Motivation relationnelle', description: 'Motivation pour améliorer ses relations' },
            { name: 'Motivation spirituelle', description: 'Motivation basée sur la spiritualité' },
            
            // Motivation par situation
            { name: 'Dépasser les obstacles', description: 'Motivation pour surmonter les difficultés' },
            { name: 'Surmonter l\'échec', description: 'Motivation après un échec ou une déception' },
            { name: 'Repartir de zéro', description: 'Motivation pour recommencer après un échec' },
            { name: 'Changer de vie', description: 'Motivation pour transformer sa vie' },
            { name: 'Sortir de sa zone de confort', description: 'Motivation pour prendre des risques' },
            { name: 'Persévérance', description: 'Motivation pour continuer malgré les difficultés' },
            { name: 'Résilience', description: 'Motivation pour rebondir après les épreuves' },
            
            // Motivation par état d'esprit
            { name: 'Confiance en soi', description: 'Contenu pour développer la confiance en soi' },
            { name: 'Estime de soi', description: 'Motivation pour améliorer l\'estime de soi' },
            { name: 'Auto-motivation', description: 'Techniques pour se motiver soi-même' },
            { name: 'Mindset de croissance', description: 'Développer un état d\'esprit de croissance' },
            { name: 'Mentalité de gagnant', description: 'Adopter une mentalité de succès' },
            { name: 'Positivité', description: 'Cultiver une attitude positive' },
            { name: 'Gratitude', description: 'Pratiquer la gratitude pour rester motivé' },
            
            // Motivation par action
            { name: 'Passer à l\'action', description: 'Motivation pour agir et ne plus procrastiner' },
            { name: 'Productivité', description: 'Motivation pour être plus productif' },
            { name: 'Discipline', description: 'Développer la discipline personnelle' },
            { name: 'Habitudes positives', description: 'Créer et maintenir de bonnes habitudes' },
            { name: 'Gestion du temps', description: 'Motivation pour mieux gérer son temps' },
            { name: 'Organisation', description: 'Motivation pour s\'organiser efficacement' },
            
            // Motivation par inspiration
            { name: 'Histoires de succès', description: 'Histoires inspirantes de personnes qui ont réussi' },
            { name: 'Témoignages', description: 'Témoignages de transformation personnelle' },
            { name: 'Modèles inspirants', description: 'Personnes qui inspirent et motivent' },
            { name: 'Parcours de vie', description: 'Parcours inspirants de transformation' },
            { name: 'Leçons de vie', description: 'Leçons apprises qui motivent' },
            
            // Motivation par thème spécifique
            { name: 'Réussite', description: 'Motivation pour réussir dans tous les domaines' },
            { name: 'Excellence', description: 'Motivation pour viser l\'excellence' },
            { name: 'Détermination', description: 'Renforcer sa détermination' },
            { name: 'Courage', description: 'Trouver le courage d\'agir' },
            { name: 'Ambition', description: 'Cultiver et réaliser ses ambitions' },
            { name: 'Rêves', description: 'Motivation pour réaliser ses rêves' },
            { name: 'Passion', description: 'Trouver et suivre sa passion' },
            { name: 'But dans la vie', description: 'Trouver son but et sa mission de vie' },
            
            // Motivation pour moments difficiles
            { name: 'Motivation en période difficile', description: 'Motivation pour traverser les moments difficiles' },
            { name: 'Dépassement de soi', description: 'Motivation pour se dépasser' },
            { name: 'Force mentale', description: 'Développer sa force mentale' },
            { name: 'Mentalité de guerrier', description: 'Adopter une mentalité de combattant' },
            { name: 'Ne jamais abandonner', description: 'Motivation pour ne jamais renoncer' },
            
            // Motivation par type de contenu
            { name: 'Vidéos motivationnelles', description: 'Vidéos courtes et percutantes' },
            { name: 'Podcasts motivationnels', description: 'Podcasts et audio pour se motiver' },
            { name: 'Livres motivationnels', description: 'Recommandations de livres motivants' },
            { name: 'Documentaires inspirants', description: 'Documentaires qui motivent' },
            
            // Motivation par public
            { name: 'Motivation pour étudiants', description: 'Contenu motivant spécifique aux étudiants' },
            { name: 'Motivation pour entrepreneurs', description: 'Motivation pour les entrepreneurs' },
            { name: 'Motivation pour artistes', description: 'Motivation pour les créateurs et artistes' },
            { name: 'Motivation pour athlètes', description: 'Motivation pour les sportifs' },
            { name: 'Motivation pour parents', description: 'Motivation pour les parents' },
            
            // Motivation par méthode
            { name: 'Visualisation', description: 'Techniques de visualisation pour la motivation' },
            { name: 'Méditation motivationnelle', description: 'Méditations guidées pour se motiver' },
            { name: 'Journaling motivationnel', description: 'Tenir un journal pour rester motivé' },
            { name: 'Rituels motivationnels', description: 'Rituels quotidiens pour la motivation' },
            
            // Motivation par résultat
            { name: 'Transformation personnelle', description: 'Motivation pour se transformer' },
            { name: 'Évolution', description: 'Motivation pour évoluer et grandir' },
            { name: 'Croissance personnelle', description: 'Motivation pour la croissance personnelle' },
            { name: 'Développement personnel', description: 'Motivation pour le développement personnel' },
            { name: 'Réalisation de soi', description: 'Motivation pour se réaliser pleinement' },
            
            // Motivation par valeur
            { name: 'Valeur du travail', description: 'Motivation basée sur la valeur du travail' },
            { name: 'Effort et persévérance', description: 'Valoriser l\'effort et la persévérance' },
            { name: 'Patience', description: 'Motivation pour être patient dans ses efforts' },
            { name: 'Honnêteté avec soi-même', description: 'Motivation pour être honnête avec soi' },
            { name: 'Intégrité', description: 'Motivation basée sur l\'intégrité' },
            
            // Motivation par moment
            { name: 'Lundi motivation', description: 'Motivation pour bien commencer la semaine' },
            { name: 'Motivation du week-end', description: 'Motivation pour profiter du week-end' },
            { name: 'Motivation de fin d\'année', description: 'Motivation pour terminer l\'année en beauté' },
            { name: 'Motivation de début d\'année', description: 'Motivation pour commencer une nouvelle année' },
            { name: 'Motivation mensuelle', description: 'Objectifs et motivation mensuels' }
        ];

        console.log(`📊 ${motivationSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = motivationSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

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

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "Motivation"`);
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

