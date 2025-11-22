#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eiuhcgvvexoshuopvska.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdWhjZ3Z2ZXhvc2h1b3B2c2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODM0MzkyMywiZXhwIjoyMDYzOTE5OTIzfQ.J2IxfNpdlQvm1o99kKw73ytmmJG47PV0Kir8RCzCLJo";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
    try {
        console.log('🚀 === AJOUT DES SOUS-CATÉGORIES FINANCE ===\n');

        // 1. Récupérer la catégorie Finance
        console.log('🔍 Recherche de la catégorie "Finance"...');
        const { data: category, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .ilike('name', '%finance%')
            .maybeSingle();

        if (catError || !category) {
            console.error('❌ Catégorie "Finance" introuvable:', catError?.message);
            return;
        }

        console.log(`✅ Catégorie trouvée: ${category.name} (ID: ${category.id})\n`);

        // 2. Liste complète des sous-catégories finance
        console.log('📋 Préparation de la liste des sous-catégories...\n');

        const financeSubcategories = [
            // Investissement général
            { name: 'Investissement', description: 'Conseils et stratégies d\'investissement général' },
            { name: 'Investissement débutant', description: 'Guide pour débuter en investissement' },
            { name: 'Investissement avancé', description: 'Stratégies d\'investissement avancées' },
            { name: 'Gestion de portefeuille', description: 'Gérer et diversifier son portefeuille' },
            { name: 'Diversification', description: 'Techniques de diversification des investissements' },
            { name: 'Planification financière', description: 'Planifier ses finances à long terme' },
            
            // Actions et bourse
            { name: 'Actions', description: 'Investir en actions et bourse' },
            { name: 'Bourse', description: 'Trading et investissement en bourse' },
            { name: 'Actions françaises', description: 'Investir dans les actions françaises' },
            { name: 'Actions américaines', description: 'Investir dans les actions américaines' },
            { name: 'Actions européennes', description: 'Investir dans les actions européennes' },
            { name: 'Actions asiatiques', description: 'Investir dans les actions asiatiques' },
            { name: 'Dividendes', description: 'Stratégies d\'investissement en dividendes' },
            { name: 'Value investing', description: 'Investissement basé sur la valeur' },
            { name: 'Growth investing', description: 'Investissement dans la croissance' },
            
            // Trading
            { name: 'Trading', description: 'Trading et opérations à court terme' },
            { name: 'Day trading', description: 'Trading intraday' },
            { name: 'Swing trading', description: 'Trading à moyen terme' },
            { name: 'Scalping', description: 'Trading à très court terme' },
            { name: 'Trading débutant', description: 'Apprendre le trading' },
            { name: 'Analyse technique', description: 'Analyser les graphiques et indicateurs' },
            { name: 'Analyse fondamentale', description: 'Analyser les fondamentaux des entreprises' },
            { name: 'Indicateurs techniques', description: 'Utiliser les indicateurs de trading' },
            { name: 'Gestion du risque trading', description: 'Gérer les risques en trading' },
            { name: 'Psychologie du trading', description: 'Mentalité et psychologie du trader' },
            
            // Cryptomonnaies
            { name: 'Cryptomonnaies', description: 'Investir dans les cryptomonnaies' },
            { name: 'Bitcoin', description: 'Tout sur Bitcoin' },
            { name: 'Ethereum', description: 'Tout sur Ethereum' },
            { name: 'Altcoins', description: 'Autres cryptomonnaies que Bitcoin' },
            { name: 'DeFi', description: 'Finance décentralisée' },
            { name: 'NFT', description: 'Tokens non fongibles' },
            { name: 'Blockchain', description: 'Technologie blockchain' },
            { name: 'Smart contracts', description: 'Contrats intelligents' },
            { name: 'Mining crypto', description: 'Minage de cryptomonnaies' },
            { name: 'Wallets crypto', description: 'Portefeuilles cryptomonnaies' },
            { name: 'Exchanges crypto', description: 'Plateformes d\'échange de cryptomonnaies' },
            { name: 'Staking crypto', description: 'Staking de cryptomonnaies' },
            { name: 'Trading crypto', description: 'Trading de cryptomonnaies' },
            
            // Forex et devises
            { name: 'Forex', description: 'Trading de devises' },
            { name: 'Paires de devises', description: 'Analyser les paires de devises' },
            { name: 'Taux de change', description: 'Comprendre les taux de change' },
            
            // Obligations et produits à revenu fixe
            { name: 'Obligations', description: 'Investir en obligations' },
            { name: 'Obligations d\'État', description: 'Obligations gouvernementales' },
            { name: 'Obligations d\'entreprise', description: 'Obligations d\'entreprises' },
            { name: 'Produits à revenu fixe', description: 'Investissements à revenu fixe' },
            
            // Immobilier
            { name: 'Investissement immobilier', description: 'Investir dans l\'immobilier' },
            { name: 'Immobilier locatif', description: 'Investir en location' },
            { name: 'SCPI', description: 'Sociétés Civiles de Placement Immobilier' },
            { name: 'REIT', description: 'Fonds de placement immobiliers' },
            { name: 'Rénovation immobilière', description: 'Investir dans la rénovation' },
            { name: 'Flipping immobilier', description: 'Acheter, rénover, revendre' },
            
            // Épargne
            { name: 'Épargne', description: 'Stratégies d\'épargne' },
            { name: 'Livret A', description: 'Épargne sur Livret A' },
            { name: 'LDDS', description: 'Livret de Développement Durable et Solidaire' },
            { name: 'PEL', description: 'Plan Épargne Logement' },
            { name: 'CEL', description: 'Compte Épargne Logement' },
            { name: 'Livret jeune', description: 'Épargne pour les jeunes' },
            { name: 'Compte à terme', description: 'Épargne à terme' },
            { name: 'Épargne salariale', description: 'Plans d\'épargne salariale' },
            
            // Assurance-vie et épargne retraite
            { name: 'Assurance-vie', description: 'Investir via l\'assurance-vie' },
            { name: 'Fonds euros', description: 'Fonds en euros de l\'assurance-vie' },
            { name: 'Unités de compte', description: 'Unités de compte en assurance-vie' },
            { name: 'Retraite', description: 'Préparer sa retraite' },
            { name: 'PERP', description: 'Plan d\'Épargne Retraite Populaire' },
            { name: 'PER', description: 'Plan d\'Épargne Retraite' },
            { name: 'Épargne retraite', description: 'Épargner pour la retraite' },
            
            // Fonds et ETF
            { name: 'Fonds d\'investissement', description: 'Investir via des fonds' },
            { name: 'ETF', description: 'Fonds négociés en bourse' },
            { name: 'Fonds indiciels', description: 'Fonds qui suivent un indice' },
            { name: 'Fonds actifs', description: 'Fonds gérés activement' },
            { name: 'Fonds passifs', description: 'Fonds gérés passivement' },
            { name: 'Fonds diversifiés', description: 'Fonds diversifiés' },
            { name: 'Fonds sectoriels', description: 'Fonds spécialisés par secteur' },
            { name: 'Fonds géographiques', description: 'Fonds par zone géographique' },
            
            // Matières premières et commodities
            { name: 'Matières premières', description: 'Investir dans les matières premières' },
            { name: 'Or', description: 'Investir dans l\'or' },
            { name: 'Argent', description: 'Investir dans l\'argent' },
            { name: 'Pétrole', description: 'Investir dans le pétrole' },
            { name: 'Commodities', description: 'Produits de base et matières premières' },
            
            // Crédit et dette
            { name: 'Crédit', description: 'Comprendre et gérer le crédit' },
            { name: 'Crédit immobilier', description: 'Prêts immobiliers' },
            { name: 'Crédit consommation', description: 'Crédits à la consommation' },
            { name: 'Rachat de crédit', description: 'Regrouper ses crédits' },
            { name: 'Gestion de la dette', description: 'Gérer et réduire ses dettes' },
            { name: 'Endettement', description: 'Comprendre l\'endettement' },
            { name: 'Surendettement', description: 'Sortir du surendettement' },
            
            // Assurance
            { name: 'Assurance', description: 'Comprendre les assurances' },
            { name: 'Assurance habitation', description: 'Assurer son logement' },
            { name: 'Assurance auto', description: 'Assurer son véhicule' },
            { name: 'Assurance santé', description: 'Complémentaire santé' },
            { name: 'Assurance décès', description: 'Assurance vie et décès' },
            { name: 'Assurance invalidité', description: 'Protection en cas d\'invalidité' },
            { name: 'Assurance dépendance', description: 'Protection dépendance' },
            
            // Budget et gestion
            { name: 'Budget', description: 'Gérer son budget' },
            { name: 'Gestion budgétaire', description: 'Planifier et suivre son budget' },
            { name: 'Économies', description: 'Réduire ses dépenses et économiser' },
            { name: 'Épargne de précaution', description: 'Épargne pour les urgences' },
            { name: 'Gestion des dépenses', description: 'Contrôler ses dépenses' },
            { name: 'Réduction des coûts', description: 'Réduire ses frais' },
            
            // Fiscalité
            { name: 'Fiscalité', description: 'Optimisation fiscale' },
            { name: 'Impôts', description: 'Comprendre et optimiser ses impôts' },
            { name: 'Défiscalisation', description: 'Réduire ses impôts légalement' },
            { name: 'ISF', description: 'Impôt sur la fortune' },
            { name: 'Impôt sur le revenu', description: 'Optimiser l\'impôt sur le revenu' },
            { name: 'Plus-values', description: 'Gérer les plus-values' },
            { name: 'Déductions fiscales', description: 'Déductions et crédits d\'impôt' },
            
            // Fintech et innovations
            { name: 'Fintech', description: 'Technologies financières' },
            { name: 'Banque en ligne', description: 'Services bancaires en ligne' },
            { name: 'Applications financières', description: 'Apps pour gérer ses finances' },
            { name: 'Paiements mobiles', description: 'Payer avec son téléphone' },
            { name: 'Crowdfunding', description: 'Financement participatif' },
            { name: 'Prêt entre particuliers', description: 'Emprunter entre particuliers' },
            { name: 'Robo-advisor', description: 'Conseillers financiers automatisés' },
            
            // Économie et macroéconomie
            { name: 'Économie', description: 'Actualités et analyses économiques' },
            { name: 'Macroéconomie', description: 'Tendances économiques globales' },
            { name: 'Microéconomie', description: 'Économie au niveau individuel' },
            { name: 'Inflation', description: 'Comprendre l\'inflation' },
            { name: 'Taux d\'intérêt', description: 'Impact des taux d\'intérêt' },
            { name: 'Politique monétaire', description: 'Décisions des banques centrales' },
            { name: 'Indicateurs économiques', description: 'Analyser les indicateurs' },
            
            // Marchés financiers
            { name: 'Marchés financiers', description: 'Comprendre les marchés' },
            { name: 'Bulle financière', description: 'Identifier les bulles' },
            { name: 'Krach boursier', description: 'Comprendre les krachs' },
            { name: 'Volatilité', description: 'Gérer la volatilité des marchés' },
            { name: 'Tendances de marché', description: 'Identifier les tendances' },
            
            // Éducation financière
            { name: 'Éducation financière', description: 'Apprendre la finance' },
            { name: 'Finance pour débutants', description: 'Bases de la finance' },
            { name: 'Conseils financiers', description: 'Conseils d\'experts' },
            { name: 'Livres finance', description: 'Livres sur la finance' },
            { name: 'Formation finance', description: 'Se former à la finance' },
            
            // Objectifs financiers
            { name: 'Indépendance financière', description: 'Atteindre l\'indépendance financière' },
            { name: 'FIRE', description: 'Financial Independence, Retire Early' },
            { name: 'Objectifs financiers', description: 'Définir ses objectifs financiers' },
            { name: 'Épargne projet', description: 'Épargner pour un projet' },
            { name: 'Achat immobilier', description: 'Financer un achat immobilier' },
            { name: 'Création d\'entreprise', description: 'Financer sa création d\'entreprise' },
            
            // Psychologie et comportement
            { name: 'Psychologie financière', description: 'Comportement et finances' },
            { name: 'Biais cognitifs finance', description: 'Éviter les biais en finance' },
            { name: 'Émotions et investissement', description: 'Gérer ses émotions' },
            { name: 'Discipline financière', description: 'Développer la discipline' },
            
            // Actualités et analyses
            { name: 'Actualités financières', description: 'News du monde financier' },
            { name: 'Analyses de marché', description: 'Analyses approfondies' },
            { name: 'Prévisions économiques', description: 'Prévoir les tendances' },
            { name: 'Rapports financiers', description: 'Analyser les rapports' },
            
            // Spécialisé
            { name: 'Finance islamique', description: 'Finance conforme à la charia' },
            { name: 'Finance durable', description: 'Investissement responsable' },
            { name: 'ESG', description: 'Investissement environnemental, social et gouvernance' },
            { name: 'Finance solidaire', description: 'Finance éthique et solidaire' }
        ];

        console.log(`📊 ${financeSubcategories.length} sous-catégories préparées\n`);

        // 3. Vérifier les existantes
        console.log('🔍 Vérification des sous-catégories existantes...');
        const { data: existing } = await supabase
            .from('subcategories')
            .select('id, name')
            .eq('category_id', category.id);

        const existingNames = new Set(existing?.map(s => s.name.toLowerCase()) || []);
        const toAdd = financeSubcategories.filter(s => !existingNames.has(s.name.toLowerCase()));

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

        console.log(`📋 Total: ${finalSubcategories?.length || 0} sous-catégorie(s) pour "Finance"`);
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

