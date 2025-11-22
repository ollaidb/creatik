#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES ASTROLOGIE ===\n');

        // 1. Récupérer la catégorie Astrologie
        console.log('🔍 Recherche de la catégorie "Astrologie"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%astrologie%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Astrologie" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories astrologie
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const astrologieSubcategories = [
            // Signes du zodiaque
            { name: 'Bélier', description: 'Contenu sur le signe astrologique Bélier' },
            { name: 'Taureau', description: 'Contenu sur le signe astrologique Taureau' },
            { name: 'Gémeaux', description: 'Contenu sur le signe astrologique Gémeaux' },
            { name: 'Cancer', description: 'Contenu sur le signe astrologique Cancer' },
            { name: 'Lion', description: 'Contenu sur le signe astrologique Lion' },
            { name: 'Vierge', description: 'Contenu sur le signe astrologique Vierge' },
            { name: 'Balance', description: 'Contenu sur le signe astrologique Balance' },
            { name: 'Scorpion', description: 'Contenu sur le signe astrologique Scorpion' },
            { name: 'Sagittaire', description: 'Contenu sur le signe astrologique Sagittaire' },
            { name: 'Capricorne', description: 'Contenu sur le signe astrologique Capricorne' },
            { name: 'Verseau', description: 'Contenu sur le signe astrologique Verseau' },
            { name: 'Poissons', description: 'Contenu sur le signe astrologique Poissons' },
            
            // Types d\'horoscopes
            { name: 'Horoscope du jour', description: 'Horoscope quotidien' },
            { name: 'Horoscope de la semaine', description: 'Horoscope hebdomadaire' },
            { name: 'Horoscope du mois', description: 'Horoscope mensuel' },
            { name: 'Horoscope de l\'année', description: 'Horoscope annuel' },
            { name: 'Horoscope amour', description: 'Horoscope amoureux' },
            { name: 'Horoscope travail', description: 'Horoscope professionnel' },
            { name: 'Horoscope santé', description: 'Horoscope santé et bien-être' },
            { name: 'Horoscope finance', description: 'Horoscope financier' },
            { name: 'Horoscope famille', description: 'Horoscope familial' },
            { name: 'Horoscope amitié', description: 'Horoscope amitié' },
            
            // Maisons astrologiques
            { name: 'Maison 1', description: 'Maison astrologique 1 - Ascendant' },
            { name: 'Maison 2', description: 'Maison astrologique 2 - Valeurs et possessions' },
            { name: 'Maison 3', description: 'Maison astrologique 3 - Communication' },
            { name: 'Maison 4', description: 'Maison astrologique 4 - Foyer et famille' },
            { name: 'Maison 5', description: 'Maison astrologique 5 - Créativité et enfants' },
            { name: 'Maison 6', description: 'Maison astrologique 6 - Travail et santé' },
            { name: 'Maison 7', description: 'Maison astrologique 7 - Partenariats' },
            { name: 'Maison 8', description: 'Maison astrologique 8 - Transformation' },
            { name: 'Maison 9', description: 'Maison astrologique 9 - Voyage et philosophie' },
            { name: 'Maison 10', description: 'Maison astrologique 10 - Carrière' },
            { name: 'Maison 11', description: 'Maison astrologique 11 - Amitiés et projets' },
            { name: 'Maison 12', description: 'Maison astrologique 12 - Subconscient' },
            
            // Planètes en astrologie
            { name: 'Soleil astrologique', description: 'Influence du Soleil en astrologie' },
            { name: 'Lune astrologique', description: 'Influence de la Lune en astrologie' },
            { name: 'Mercure astrologique', description: 'Influence de Mercure en astrologie' },
            { name: 'Vénus astrologique', description: 'Influence de Vénus en astrologie' },
            { name: 'Mars astrologique', description: 'Influence de Mars en astrologie' },
            { name: 'Jupiter astrologique', description: 'Influence de Jupiter en astrologie' },
            { name: 'Saturne astrologique', description: 'Influence de Saturne en astrologie' },
            { name: 'Uranus astrologique', description: 'Influence d\'Uranus en astrologie' },
            { name: 'Neptune astrologique', description: 'Influence de Neptune en astrologie' },
            { name: 'Pluton astrologique', description: 'Influence de Pluton en astrologie' },
            
            // Aspects astrologiques
            { name: 'Conjonction', description: 'Aspect astrologique de conjonction' },
            { name: 'Opposition', description: 'Aspect astrologique d\'opposition' },
            { name: 'Trine', description: 'Aspect astrologique de trine' },
            { name: 'Carré', description: 'Aspect astrologique de carré' },
            { name: 'Sextile', description: 'Aspect astrologique de sextile' },
            { name: 'Quincunx', description: 'Aspect astrologique de quincunx' },
            
            // Compatibilité
            { name: 'Compatibilité amoureuse', description: 'Compatibilité entre signes en amour' },
            { name: 'Compatibilité amitié', description: 'Compatibilité entre signes en amitié' },
            { name: 'Compatibilité travail', description: 'Compatibilité entre signes au travail' },
            { name: 'Synastrie', description: 'Analyse de compatibilité entre deux thèmes' },
            { name: 'Composantes', description: 'Analyse des composantes d\'un couple' },
            
            // Thème astral
            { name: 'Thème astral', description: 'Création et interprétation de thème astral' },
            { name: 'Carte du ciel', description: 'Lecture de carte du ciel' },
            { name: 'Ascendant', description: 'Signe ascendant et son influence' },
            { name: 'Milieu du ciel', description: 'Point du milieu du ciel (MC)' },
            { name: 'Descendant', description: 'Point descendant' },
            { name: 'Fond du ciel', description: 'Point du fond du ciel (IC)' },
            { name: 'Interprétation thème', description: 'Interprétation complète d\'un thème' },
            
            // Éléments
            { name: 'Signes de feu', description: 'Bélier, Lion, Sagittaire' },
            { name: 'Signes de terre', description: 'Taureau, Vierge, Capricorne' },
            { name: 'Signes d\'air', description: 'Gémeaux, Balance, Verseau' },
            { name: 'Signes d\'eau', description: 'Cancer, Scorpion, Poissons' },
            
            // Modalités
            { name: 'Signes cardinaux', description: 'Bélier, Cancer, Balance, Capricorne' },
            { name: 'Signes fixes', description: 'Taureau, Lion, Scorpion, Verseau' },
            { name: 'Signes mutables', description: 'Gémeaux, Vierge, Sagittaire, Poissons' },
            
            // Transits
            { name: 'Transits planétaires', description: 'Influence des transits planétaires' },
            { name: 'Rétrogradation', description: 'Planètes rétrogrades et leur influence' },
            { name: 'Mercure rétrograde', description: 'Période de Mercure rétrograde' },
            { name: 'Vénus rétrograde', description: 'Période de Vénus rétrograde' },
            { name: 'Mars rétrograde', description: 'Période de Mars rétrograde' },
            
            // Numérologie et astrologie
            { name: 'Numérologie astrologique', description: 'Combinaison numérologie et astrologie' },
            { name: 'Chemin de vie', description: 'Chemin de vie en numérologie' },
            
            // Astrologie chinoise
            { name: 'Astrologie chinoise', description: 'Zodiaque chinois' },
            { name: 'Signes chinois', description: 'Rat, Bœuf, Tigre, Lapin, Dragon, Serpent, Cheval, Chèvre, Singe, Coq, Chien, Cochon' },
            { name: 'Année chinoise', description: 'Influence de l\'année chinoise' },
            
            // Astrologie karmique
            { name: 'Astrologie karmique', description: 'Astrologie et karma' },
            { name: 'Nœuds lunaires', description: 'Nœud nord et nœud sud' },
            { name: 'Lilith', description: 'Point Lilith en astrologie' },
            { name: 'Chiron', description: 'Astéroïde Chiron en astrologie' },
            
            // Prévisions
            { name: 'Prévisions astrologiques', description: 'Prévisions basées sur l\'astrologie' },
            { name: 'Tendances astrologiques', description: 'Tendances astrologiques actuelles' },
            { name: 'Événements astrologiques', description: 'Événements astrologiques importants' },
            
            // Éducation
            { name: 'Apprendre l\'astrologie', description: 'Cours et formation en astrologie' },
            { name: 'Astrologie pour débutants', description: 'Bases de l\'astrologie' },
            { name: 'Symbolisme astrologique', description: 'Symboles et significations' },
            { name: 'Histoire astrologie', description: 'Histoire de l\'astrologie' },
            { name: 'Livres astrologie', description: 'Livres sur l\'astrologie' },
            
            // Spécialisé
            { name: 'Astrologie médicale', description: 'Astrologie et santé' },
            { name: 'Astrologie financière', description: 'Astrologie et finances' },
            { name: 'Astrologie électorale', description: 'Astrologie et élections' },
            { name: 'Astrologie mondiale', description: 'Astrologie mondiale et événements' },
            { name: 'Astrologie horaire', description: 'Astrologie horaire' },
            { name: 'Astrologie védique', description: 'Astrologie védique (Jyotish)' },
            { name: 'Astrologie tropicale', description: 'Astrologie tropicale' },
            { name: 'Astrologie sidérale', description: 'Astrologie sidérale' }
        ];

        console.log(`📊 ${astrologieSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = astrologieSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

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

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "Astrologie"`);
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

