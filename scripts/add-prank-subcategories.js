#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // PAR PERSONNE (Famille)
    { name: 'Ma mère', description: 'Pranks sur ma mère' },
    { name: 'Mon père', description: 'Pranks sur mon père' },
    { name: 'Ma sœur', description: 'Pranks sur ma sœur' },
    { name: 'Mon frère', description: 'Pranks sur mon frère' },
    { name: 'Mon mari', description: 'Pranks sur mon mari' },
    { name: 'Ma femme', description: 'Pranks sur ma femme' },
    { name: 'Mes enfants', description: 'Pranks sur mes enfants' },
    { name: 'Ma cousine', description: 'Pranks sur ma cousine' },
    { name: 'Mon cousin', description: 'Pranks sur mon cousin' },
    { name: 'Ma tante', description: 'Pranks sur ma tante' },
    { name: 'Mon oncle', description: 'Pranks sur mon oncle' },
    { name: 'Ma grand-mère', description: 'Pranks sur ma grand-mère' },
    { name: 'Mon grand-père', description: 'Pranks sur mon grand-père' },
    { name: 'Ma nièce', description: 'Pranks sur ma nièce' },
    { name: 'Mon neveu', description: 'Pranks sur mon neveu' },
    { name: 'Ma belle-mère', description: 'Pranks sur ma belle-mère' },
    { name: 'Mon beau-père', description: 'Pranks sur mon beau-père' },
    { name: 'Ma belle-sœur', description: 'Pranks sur ma belle-sœur' },
    { name: 'Mon beau-frère', description: 'Pranks sur mon beau-frère' },
    { name: 'Ma famille', description: 'Pranks sur ma famille' },
    
    // PAR PERSONNE (Amis & Relations)
    { name: 'Mes amis', description: 'Pranks sur mes amis' },
    { name: 'Mon meilleur ami', description: 'Pranks sur mon meilleur ami' },
    { name: 'Ma meilleure amie', description: 'Pranks sur ma meilleure amie' },
    { name: 'Mon copain', description: 'Pranks sur mon copain' },
    { name: 'Ma copine', description: 'Pranks sur ma copine' },
    { name: 'Mon ex', description: 'Pranks sur mon ex' },
    { name: 'Mon voisin', description: 'Pranks sur mon voisin' },
    { name: 'Ma voisine', description: 'Pranks sur ma voisine' },
    
    // PAR PERSONNE (Travail)
    { name: 'Mes collègues', description: 'Pranks sur mes collègues' },
    { name: 'Mon patron', description: 'Pranks sur mon patron' },
    { name: 'Mon boss', description: 'Pranks sur mon boss' },
    { name: 'Mon supérieur', description: 'Pranks sur mon supérieur' },
    { name: 'Mon collègue', description: 'Pranks sur mon collègue' },
    { name: 'Ma collègue', description: 'Pranks sur ma collègue' },
    { name: 'Mon équipe', description: 'Pranks sur mon équipe' },
    
    // PAR PERSONNE (Autres)
    { name: 'Mon professeur', description: 'Pranks sur mon professeur' },
    { name: 'Mon prof', description: 'Pranks sur mon prof' },
    { name: 'Mon médecin', description: 'Pranks sur mon médecin' },
    { name: 'Mon vétérinaire', description: 'Pranks sur mon vétérinaire' },
    { name: 'Mon coiffeur', description: 'Pranks sur mon coiffeur' },
    { name: 'Ma coiffeuse', description: 'Pranks sur ma coiffeuse' },
    { name: 'Des inconnus', description: 'Pranks sur des inconnus' },
    { name: 'Des passants', description: 'Pranks sur des passants' },
    
    // PAR ENDROIT (Maison)
    { name: 'À la maison', description: 'Pranks à la maison' },
    { name: 'Dans la chambre', description: 'Pranks dans la chambre' },
    { name: 'Dans la cuisine', description: 'Pranks dans la cuisine' },
    { name: 'Dans le salon', description: 'Pranks dans le salon' },
    { name: 'Dans la salle de bain', description: 'Pranks dans la salle de bain' },
    { name: 'Dans le jardin', description: 'Pranks dans le jardin' },
    { name: 'Dans le garage', description: 'Pranks dans le garage' },
    
    // PAR ENDROIT (Extérieur)
    { name: 'Dans la rue', description: 'Pranks dans la rue' },
    { name: 'Dans un parc', description: 'Pranks dans un parc' },
    { name: 'Sur la plage', description: 'Pranks sur la plage' },
    { name: 'Dans un magasin', description: 'Pranks dans un magasin' },
    { name: 'Dans un supermarché', description: 'Pranks dans un supermarché' },
    { name: 'Dans un centre commercial', description: 'Pranks dans un centre commercial' },
    { name: 'Sur un parking', description: 'Pranks sur un parking' },
    
    // PAR ENDROIT (Restaurant & Bars)
    { name: 'Dans un restaurant', description: 'Pranks dans un restaurant' },
    { name: 'Dans un fast-food', description: 'Pranks dans un fast-food' },
    { name: 'Dans un café', description: 'Pranks dans un café' },
    { name: 'Dans un bar', description: 'Pranks dans un bar' },
    { name: 'Dans une pizzeria', description: 'Pranks dans une pizzeria' },
    
    // PAR ENDROIT (Transports)
    { name: 'Dans les transports', description: 'Pranks dans les transports' },
    { name: 'Dans le métro', description: 'Pranks dans le métro' },
    { name: 'Dans le bus', description: 'Pranks dans le bus' },
    { name: 'Dans le train', description: 'Pranks dans le train' },
    { name: 'Dans la voiture', description: 'Pranks dans la voiture' },
    { name: 'Dans un taxi', description: 'Pranks dans un taxi' },
    { name: 'Dans un avion', description: 'Pranks dans un avion' },
    { name: 'À l\'aéroport', description: 'Pranks à l\'aéroport' },
    { name: 'Dans une gare', description: 'Pranks dans une gare' },
    
    // PAR ENDROIT (Travail & École)
    { name: 'Au travail', description: 'Pranks au travail' },
    { name: 'Au bureau', description: 'Pranks au bureau' },
    { name: 'Dans une réunion', description: 'Pranks dans une réunion' },
    { name: 'À l\'école', description: 'Pranks à l\'école' },
    { name: 'À l\'université', description: 'Pranks à l\'université' },
    { name: 'Dans une salle de classe', description: 'Pranks dans une salle de classe' },
    { name: 'Dans les couloirs', description: 'Pranks dans les couloirs' },
    
    // PAR ENDROIT (Loisirs)
    { name: 'Au cinéma', description: 'Pranks au cinéma' },
    { name: 'Dans un musée', description: 'Pranks dans un musée' },
    { name: 'Dans une salle de sport', description: 'Pranks dans une salle de sport' },
    { name: 'Dans une piscine', description: 'Pranks dans une piscine' },
    { name: 'Dans un parc d\'attractions', description: 'Pranks dans un parc d\'attractions' },
    { name: 'À la plage', description: 'Pranks à la plage' },
    { name: 'Dans un hôtel', description: 'Pranks dans un hôtel' },
    
    // PAR ENDROIT (Autres)
    { name: 'Dans un hôpital', description: 'Pranks dans un hôpital' },
    { name: 'Dans une pharmacie', description: 'Pranks dans une pharmacie' },
    { name: 'Dans une banque', description: 'Pranks dans une banque' },
    { name: 'Dans une poste', description: 'Pranks dans une poste' },
    { name: 'Dans une station-service', description: 'Pranks dans une station-service' }
];

async function main() {
    try {
        console.log('🚀 Ajout des sous-catégories Prank\n');
        
        // 1. Récupérer la catégorie Prank
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .ilike('name', '%prank%')
            .single();
        
        if (catError || !category) {
            throw new Error('Catégorie Prank introuvable');
        }
        
        console.log(`✅ Catégorie ID: ${category.id}\n`);
        
        // 2. Vérifier les sous-catégories existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', category.id);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insertion
        console.log('💾 Insertion des sous-catégories...');
        const now = new Date().toISOString();
        let success = 0;
        let failed = 0;
        
        // Insérer par batch de 50
        const batchSize = 50;
        for (let i = 0; i < toAdd.length; i += batchSize) {
            const batch = toAdd.slice(i, i + batchSize);
            const batchData = batch.map(sub => ({
                name: sub.name,
                description: sub.description,
                category_id: category.id,
                created_at: now,
                updated_at: now
            }));
            
            const { error } = await supabase
                .from('subcategories')
                .insert(batchData);
            
            if (error) {
                // Si erreur batch, essayer une par une
                for (const sub of batch) {
                    const { error: singleError } = await supabase
                        .from('subcategories')
                        .insert({
                            name: sub.name,
                            description: sub.description,
                            category_id: category.id,
                            created_at: now,
                            updated_at: now
                        });
                    
                    if (singleError) {
                        if (singleError.message.includes('duplicate') || singleError.code === '23505') {
                            success++;
                        } else {
                            console.log(`⚠️  "${sub.name}": ${singleError.message}`);
                            failed++;
                        }
                    } else {
                        success++;
                    }
                }
            } else {
                success += batch.length;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Prank`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

