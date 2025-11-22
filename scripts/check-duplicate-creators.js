#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🔍 Vérification des créateurs en double\n');
        
        // Récupérer tous les créateurs
        const { data: creators } = await supabase
            .from('creators')
            .select('id, name')
            .order('name');
        
        if (!creators || creators.length === 0) {
            console.log('ℹ️  Aucun créateur trouvé\n');
            return;
        }
        
        console.log(`📊 Total de créateurs: ${creators.length}\n`);
        
        // Trouver les doublons (même nom, insensible à la casse)
        const nameMap = new Map();
        const duplicates = [];
        
        creators.forEach(creator => {
            const nameLower = creator.name.toLowerCase().trim();
            if (nameMap.has(nameLower)) {
                const existing = nameMap.get(nameLower);
                duplicates.push({
                    original: existing,
                    duplicate: creator
                });
            } else {
                nameMap.set(nameLower, creator);
            }
        });
        
        console.log(`🔴 Créateurs en double trouvés: ${duplicates.length}\n`);
        
        if (duplicates.length > 0) {
            console.log('Liste des doublons:\n');
            duplicates.forEach((dup, index) => {
                console.log(`${index + 1}. "${dup.original.name}" (ID: ${dup.original.id})`);
                console.log(`   Dupliqué par: "${dup.duplicate.name}" (ID: ${dup.duplicate.id})\n`);
            });
        } else {
            console.log('✅ Aucun doublon trouvé\n');
        }
        
        // Vérifier aussi les noms similaires (variations)
        const similarNames = [];
        const names = Array.from(nameMap.keys());
        
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                const name1 = names[i];
                const name2 = names[j];
                
                // Vérifier si les noms sont très similaires (différence de 1-2 caractères)
                if (name1.length > 3 && name2.length > 3) {
                    const similarity = calculateSimilarity(name1, name2);
                    if (similarity > 0.85 && similarity < 1.0) {
                        const creator1 = nameMap.get(name1);
                        const creator2 = nameMap.get(name2);
                        similarNames.push({ creator1, creator2, similarity });
                    }
                }
            }
        }
        
        if (similarNames.length > 0) {
            console.log(`\n⚠️  Noms similaires trouvés: ${similarNames.length}\n`);
            similarNames.slice(0, 10).forEach((sim, index) => {
                console.log(`${index + 1}. "${sim.creator1.name}" ≈ "${sim.creator2.name}" (${Math.round(sim.similarity * 100)}% similaire)`);
            });
            if (similarNames.length > 10) {
                console.log(`   ... et ${similarNames.length - 10} autres`);
            }
        }
        
        console.log(`\n📊 Statistiques:`);
        console.log(`   - Créateurs uniques: ${nameMap.size}`);
        console.log(`   - Doublons exacts: ${duplicates.length}`);
        console.log(`   - Noms similaires: ${similarNames.length}\n`);
        
    } catch (error) {
        console.error('\n❌ Erreur:', error.message);
        process.exit(1);
    }
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

main().catch(console.error);

