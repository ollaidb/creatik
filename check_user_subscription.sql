-- Script pour vérifier l'abonnement/plan actuel de l'utilisateur
-- Remplacez 'VOTRE_USER_ID' par votre ID utilisateur Supabase

-- Option 1: Vérifier les commandes actives de l'utilisateur
SELECT 
  o.id,
  o.amount,
  o.currency,
  o.status,
  o.payment_date,
  o.created_at,
  p.name as product_name,
  p.type as product_type,
  p.description as product_description,
  p.price
FROM orders o
LEFT JOIN products p ON o.product_id = p.id
WHERE o.user_id = auth.uid()  -- Utilise l'ID de l'utilisateur connecté
ORDER BY o.created_at DESC;

-- Option 2: Vérifier toutes les commandes (si vous êtes admin)
-- SELECT 
--   o.id,
--   o.user_id,
--   o.amount,
--   o.currency,
--   o.status,
--   o.payment_date,
--   o.created_at,
--   p.name as product_name,
--   p.type as product_type
-- FROM orders o
-- LEFT JOIN products p ON o.product_id = p.id
-- ORDER BY o.created_at DESC;

-- Option 3: Vérifier s'il existe une table d'abonnements (si elle existe)
-- SELECT * FROM user_subscriptions WHERE user_id = auth.uid();

-- Option 4: Vérifier le profil utilisateur pour des informations d'abonnement
SELECT 
  id,
  email,
  first_name,
  last_name,
  created_at
FROM profiles
WHERE id = auth.uid();

