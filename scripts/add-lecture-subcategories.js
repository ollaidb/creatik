#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Structure : niveau 1 -> niveau 2
const structure = {
    'Livres': [
        'Romans', 'BD', 'Manga', 'Science-fiction', 'Fantasy', 'Thriller', 'Policier',
        'Romance', 'Historique', 'Biographie', 'Autobiographie', 'Essai', 'Poésie',
        'Nouvelles', 'Jeunesse', 'Enfant', 'Guide', 'Manuel', 'Dictionnaire', 'Encyclopédie'
    ],
    'Articles': [
        'Actualités', 'Blog', 'Magazine', 'Scientifique', 'Technologie', 'Santé',
        'Culture', 'Sport', 'Économie', 'Politique', 'Société', 'Lifestyle', 'Voyage',
        'Cuisine', 'Mode', 'Beauté', 'Divertissement'
    ],
    'Commentaires': [
        'YouTube', 'Instagram', 'TikTok', 'Articles', 'Blogs', 'Posts', 'Vidéos',
        'Photos', 'Livres', 'Films', 'Séries', 'Musique', 'Jeux vidéo', 'Produits',
        'Services', 'Restaurants', 'Hôtels'
    ],
    'Tweets': [
        'Actualités', 'Humour', 'Politique', 'Tech', 'Sport', 'Culture', 'Divertissement',
        'Opinions', 'Débats', 'Tendances', 'Viral', 'Citations', 'Inspiration'
    ],
    'Histoires': [
        'Cortes', 'Longues', 'Fantastiques', 'Réalistes', 'Horreur', 'Romance',
        'Aventure', 'Mystère', 'Science-fiction', 'Historique', 'Contemporain',
        'Jeunesse', 'Enfant'
    ],
    'Posts': [
        'Instagram', 'Facebook', 'LinkedIn', 'Reddit', 'Twitter', 'TikTok', 'Snapchat',
        'Pinterest', 'Discord', 'Forum', 'Communauté'
    ],
    'Blogs': [
        'Lifestyle', 'Tech', 'Voyage', 'Cuisine', 'Mode', 'Beauté', 'Fitness',
        'Parentalité', 'Développement personnel', 'Finance', 'Business', 'Créativité',
        'Art', 'Photographie', 'Écriture'
    ],
    'Médias': [
        'Presse', 'Magazine', 'Journal', 'Quotidien', 'Hebdomadaire', 'Mensuel',
        'Numérique', 'Papier', 'En ligne', 'Télévision', 'Radio'
    ],
    'Documents': [
        'PDF', 'Word', 'Rapports', 'Études', 'Recherche', 'Académique', 'Professionnel',
        'Administratif', 'Légal', 'Médical', 'Technique', 'Commercial'
    ],
    'Poésie': [
        'Classique', 'Moderne', 'Slam', 'Haïku', 'Sonnet', 'Vers libre', 'Rap',
        'Spoken word', 'Performance', 'Écriture'
    ],
    'Nouvelles': [
        'Cortes', 'Longues', 'Genres', 'Fantastique', 'Réaliste', 'Horreur',
        'Science-fiction', 'Romance', 'Mystère', 'Historique'
    ],
    'Essais': [
        'Philosophie', 'Politique', 'Société', 'Culture', 'Histoire', 'Science',
        'Économie', 'Psychologie', 'Sociologie', 'Littérature', 'Art'
    ],
    'Biographies': [
        'Personnalités', 'Histoires', 'Mémoires', 'Autobiographie', 'Témoignages',
        'Célébrités', 'Artistes', 'Politiques', 'Scientifiques', 'Entrepreneurs',
        'Sportifs', 'Écrivains'
    ],
    'Manuels': [
        'Scolaire', 'Technique', 'Guide', 'Utilisation', 'Installation', 'Réparation',
        'Formation', 'Pédagogique', 'Référence', 'Pratique'
    ],
    'Revues': [
        'Scientifique', 'Littéraire', 'Culturelle', 'Académique', 'Professionnelle',
        'Spécialisée', 'Généraliste', 'Thématique'
    ],
    'Étiquettes': [
        'Alimentaires', 'Produits', 'Vêtements', 'Médicaments', 'Cosmétiques',
        'Électronique', 'Textile', 'Composition', 'Ingrédients', 'Allergènes',
        'Instructions', 'Prix'
    ],
    'Informations applications': [
        'Politique de confidentialité', 'Conditions d\'utilisation', 'Aide', 'FAQ',
        'Guide d\'utilisation', 'Mentions légales', 'CGU', 'CGV', 'Support',
        'Tutoriels', 'Documentation'
    ],
    'Notices': [
        'Médicaments', 'Appareils', 'Produits', 'Électronique', 'Électroménager',
        'Mobilier', 'Jouets', 'Véhicules', 'Outils', 'Sécurité'
    ],
    'Menus': [
        'Restaurant', 'Café', 'Fast-food', 'Bar', 'Brasserie', 'Bistrot', 'Gastronomique',
        'Végétarien', 'Vegan', 'Spécialités', 'Desserts', 'Boissons'
    ],
    'Panneaux': [
        'Signalisation', 'Publicitaires', 'Informatifs', 'Direction', 'Sécurité',
        'Réglementation', 'Avertissement', 'Interdiction', 'Obligation', 'Information'
    ],
    'Affiches': [
        'Publicitaires', 'Culturelles', 'Informatives', 'Événements', 'Concerts',
        'Spectacles', 'Expositions', 'Cinéma', 'Théâtre', 'Promotionnelles'
    ],
    'Emails': [
        'Professionnels', 'Personnels', 'Newsletters', 'Promotionnels', 'Administratifs',
        'Commerciaux', 'Informatifs', 'Confirmation', 'Rappel', 'Invitation'
    ],
    'Messages': [
        'SMS', 'WhatsApp', 'Messenger', 'Telegram', 'Signal', 'iMessage', 'Textos',
        'Conversations', 'Groupes', 'Privés'
    ],
    'Recettes': [
        'Cuisine', 'Pâtisserie', 'Cocktails', 'Boissons', 'Apéritifs', 'Entrées',
        'Plats', 'Desserts', 'Petits-déjeuners', 'Goûters', 'Végétarien', 'Vegan',
        'Sans gluten', 'Régime'
    ],
    'Instructions': [
        'Montage', 'Utilisation', 'Installation', 'Réparation', 'Configuration',
        'Assemblage', 'Démontage', 'Maintenance', 'Dépannage', 'Guide pas à pas'
    ],
    'Contrats': [
        'Travail', 'Location', 'Achat', 'Vente', 'Service', 'Assurance', 'Prêt',
        'Crédit', 'Abonnement', 'Partenariat', 'Commercial', 'Légal'
    ],
    'Factures': [
        'Électricité', 'Eau', 'Téléphone', 'Internet', 'Gaz', 'Assurance', 'Abonnement',
        'Achat', 'Service', 'Professionnel', 'Personnel'
    ],
    'Formulaires': [
        'Administratifs', 'Inscription', 'Déclaration', 'Demande', 'Candidature',
        'Réservation', 'Commande', 'Contact', 'Réclamation', 'Satisfaction'
    ],
    'Cartes': [
        'Restaurants', 'Visites', 'Géographiques', 'Touristiques', 'Routières',
        'Métro', 'Bus', 'Train', 'Musées', 'Monuments', 'Guides'
    ],
    'Horaires': [
        'Transports', 'Magasins', 'Services', 'Médicaux', 'Administratifs', 'Bancaires',
        'Postaux', 'Culturels', 'Sportifs', 'Éducatifs'
    ],
    'Catalogues': [
        'Produits', 'Services', 'Offres', 'Promotions', 'Collections', 'Saisons',
        'Thématiques', 'Spécialisés', 'Généralistes'
    ],
    'Brochures': [
        'Publicitaires', 'Informatives', 'Promotionnelles', 'Événements', 'Services',
        'Produits', 'Tourisme', 'Culture', 'Éducation', 'Santé'
    ],
    'Avis': [
        'Clients', 'Utilisateurs', 'Critiques', 'Produits', 'Services', 'Restaurants',
        'Hôtels', 'Livres', 'Films', 'Applications', 'Jeux', 'Expériences'
    ],
    'Critiques': [
        'Livres', 'Films', 'Restaurants', 'Séries', 'Musique', 'Jeux', 'Produits',
        'Services', 'Spectacles', 'Expositions', 'Art', 'Culture'
    ],
    'Résumés': [
        'Livres', 'Articles', 'Films', 'Séries', 'Conférences', 'Réunions', 'Études',
        'Rapports', 'Recherches', 'Documents'
    ],
    'Citations': [
        'Inspirantes', 'Philosophiques', 'Littéraires', 'Célèbres', 'Motivantes',
        'Réflexions', 'Sagesse', 'Humour', 'Amour', 'Vie', 'Réussite'
    ]
};

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Lecture (niveau 1 et 2)\n');
        
        // 1. Récupérer la catégorie Lecture
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%lecture%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Lecture introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        const now = new Date().toISOString();
        let level1Count = 0;
        let level2Count = 0;
        
        // 2. Créer les sous-catégories niveau 1 et niveau 2
        for (const [level1Name, level2List] of Object.entries(structure)) {
            console.log(`📋 Création de "${level1Name}"...`);
            
            // Vérifier si existe déjà
            const { data: existing } = await supabase
                .from('subcategories')
                .select('id')
                .eq('category_id', category.id)
                .eq('name', level1Name)
                .single();
            
            let level1Id;
            
            if (existing) {
                level1Id = existing.id;
                console.log(`  ℹ️  Niveau 1 existe déjà`);
            } else {
                const { data: level1, error: level1Error } = await supabase
                    .from('subcategories')
                    .insert({
                        name: level1Name,
                        description: `Lecture ${level1Name.toLowerCase()}`,
                        category_id: category.id,
                        created_at: now,
                        updated_at: now
                    })
                    .select()
                    .single();
                
                if (level1Error) {
                    console.error(`  ❌ Erreur: ${level1Error.message}`);
                    continue;
                }
                
                level1Id = level1.id;
                level1Count++;
                console.log(`  ✅ Niveau 1 créé`);
            }
            
            // Vérifier les niveau 2 existants
            const { data: existingLevel2 } = await supabase
                .from('subcategories_level2')
                .select('name')
                .eq('subcategory_id', level1Id);
            
            const existingNames = new Set(existingLevel2?.map(e => e.name.toLowerCase()) || []);
            const toCreate = level2List.filter(l2 => !existingNames.has(l2.toLowerCase()));
            
            if (toCreate.length === 0) {
                console.log(`  ✅ Niveau 2 déjà complet (${level2List.length} éléments)\n`);
                continue;
            }
            
            // Créer les niveau 2
            const level2Data = toCreate.map(l2 => ({
                subcategory_id: level1Id,
                name: l2,
                description: `Lecture ${l2.toLowerCase()}`,
                created_at: now,
                updated_at: now
            }));
            
            const { error: level2Error } = await supabase
                .from('subcategories_level2')
                .insert(level2Data);
            
            if (level2Error) {
                console.error(`  ⚠️  Erreur niveau 2: ${level2Error.message}`);
                // Essayer une par une
                for (const l2 of toCreate) {
                    const { error } = await supabase
                        .from('subcategories_level2')
                        .insert({
                            subcategory_id: level1Id,
                            name: l2,
                            description: `Lecture ${l2.toLowerCase()}`,
                            created_at: now,
                            updated_at: now
                        });
                    if (!error) level2Count++;
                }
            } else {
                level2Count += level2Data.length;
            }
            
            console.log(`  ✅ ${toCreate.length} niveau 2 créé(s) (${level2List.length} au total)\n`);
        }
        
        console.log(`📊 Résumé:`);
        console.log(`   - Niveau 1 créé: ${level1Count}`);
        console.log(`   - Niveau 2 créé: ${level2Count}`);
        
        // 3. Vérification finale
        const { data: finalLevel1 } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        const level1Ids = finalLevel1?.map(s => s.id) || [];
        const { data: finalLevel2, count: countLevel2 } = await supabase
            .from('subcategories_level2')
            .select('id', { count: 'exact' })
            .in('subcategory_id', level1Ids);
        
        console.log(`\n📊 Vérification finale:`);
        console.log(`   - Niveau 1: ${finalLevel1?.length || 0} sous-catégorie(s)`);
        console.log(`   - Niveau 2: ${countLevel2 || finalLevel2?.length || 0} sous-catégorie(s)`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

