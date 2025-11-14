#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const subcategories = [
    // Par type de handicap
    { name: 'Handicap visuel', description: 'Accessibilité pour les malvoyants et aveugles' },
    { name: 'Handicap auditif', description: 'Accessibilité pour les malentendants et sourds' },
    { name: 'Handicap moteur', description: 'Accessibilité pour les handicaps moteurs' },
    { name: 'Handicap cognitif', description: 'Accessibilité pour les handicaps cognitifs' },
    { name: 'Handicap mental', description: 'Accessibilité pour les handicaps mentaux' },
    { name: 'Polyhandicap', description: 'Accessibilité pour les polyhandicaps' },
    
    // Par domaine d'accessibilité
    { name: 'Numérique', description: 'Accessibilité numérique et web' },
    { name: 'Physique', description: 'Accessibilité physique et architecture' },
    { name: 'Transport', description: 'Accessibilité dans les transports' },
    { name: 'Éducation', description: 'Accessibilité dans l\'éducation' },
    { name: 'Travail', description: 'Accessibilité dans le monde du travail' },
    { name: 'Culture', description: 'Accessibilité culturelle' },
    { name: 'Sport', description: 'Accessibilité dans le sport' },
    { name: 'Loisirs', description: 'Accessibilité dans les loisirs' },
    { name: 'Santé', description: 'Accessibilité dans la santé' },
    { name: 'Commerce', description: 'Accessibilité dans le commerce' },
    
    // Technologies et outils
    { name: 'Technologies d\'assistance', description: 'Technologies d\'aide et d\'assistance' },
    { name: 'Lecteur d\'écran', description: 'Lecteurs d\'écran et outils de lecture' },
    { name: 'Sous-titres', description: 'Sous-titres et transcription' },
    { name: 'Langue des signes', description: 'Langue des signes (LSF)' },
    { name: 'Braille', description: 'Système braille et écriture tactile' },
    { name: 'Navigation clavier', description: 'Navigation au clavier' },
    { name: 'Voice over', description: 'Voice over et synthèse vocale' },
    { name: 'Design inclusif', description: 'Design inclusif et universel' },
    { name: 'Interface adaptative', description: 'Interfaces adaptatives' },
    
    // Standards et réglementation
    { name: 'WCAG', description: 'Standards WCAG (Web Content Accessibility Guidelines)' },
    { name: 'RGAA', description: 'Référentiel Général d\'Amélioration de l\'Accessibilité' },
    { name: 'Législation', description: 'Législation et droits d\'accessibilité' },
    { name: 'Normes', description: 'Normes d\'accessibilité' },
    
    // Sensibilisation et éducation
    { name: 'Sensibilisation', description: 'Sensibilisation à l\'accessibilité' },
    { name: 'Formation', description: 'Formation à l\'accessibilité' },
    { name: 'Bonnes pratiques', description: 'Bonnes pratiques d\'accessibilité' },
    { name: 'Tests', description: 'Tests d\'accessibilité' },
    { name: 'Audit', description: 'Audit d\'accessibilité' }
];

async function main() {
    try {
        console.log('🚀 Insertion automatique des sous-catégories Accessibilité\n');
        
        // 1. Vérifier/Créer la catégorie
        console.log('📋 Vérification de la catégorie Accessibilité...');
        let { data: category, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', 'Accessibilité')
            .single();
        
        if (catError && catError.code === 'PGRST116') {
            console.log('➕ Création de la catégorie Accessibilité...');
            const { data: theme } = await supabase
                .from('themes')
                .select('id')
                .in('name', ['Société', 'Lifestyle', 'Tout'])
                .limit(1)
                .single();
            
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert({
                    name: 'Accessibilité',
                    color: 'blue',
                    description: 'Contenus sur l\'accessibilité et l\'inclusion',
                    theme_id: theme?.id || null
                })
                .select()
                .single();
            
            if (createError) throw createError;
            category = newCat;
        }
        
        const categoryId = category.id;
        console.log(`✅ Catégorie ID: ${categoryId}\n`);
        
        // 2. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('name')
            .eq('category_id', categoryId);
        
        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        console.log(`📊 ${existingNames.size} sous-catégorie(s) existante(s)\n`);
        
        const toAdd = subcategories.filter(s => !existingNames.has(s.name.toLowerCase()));
        
        if (toAdd.length === 0) {
            console.log('✅ Toutes les sous-catégories existent déjà !');
            return;
        }
        
        console.log(`➕ ${toAdd.length} nouvelle(s) sous-catégorie(s) à ajouter\n`);
        
        // 3. Insertion directe avec la clé service_role (contourne RLS)
        console.log('💾 Insertion directe des sous-catégories...');
        const now = new Date().toISOString();
        let success = 0;
        let failed = 0;
        
        for (const sub of toAdd) {
            const { error } = await supabase
                .from('subcategories')
                .insert({
                    name: sub.name,
                    description: sub.description,
                    category_id: categoryId,
                    created_at: now,
                    updated_at: now
                });
            
            if (error) {
                // Si c'est une erreur de doublon, c'est OK
                if (error.message.includes('duplicate') || error.code === '23505') {
                    success++;
                } else {
                    console.log(`⚠️  "${sub.name}": ${error.message}`);
                    failed++;
                }
            } else {
                success++;
            }
        }
        
        console.log(`\n✅ ${success} ajoutée(s), ⚠️  ${failed} échouée(s)`);
        
        // 4. Vérification finale
        const { data: all } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', categoryId)
            .order('name');
        
        console.log(`\n📊 Total final: ${all?.length || 0} sous-catégorie(s) Accessibilité`);
        console.log('\n🎉 Terminé avec succès !');
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);

