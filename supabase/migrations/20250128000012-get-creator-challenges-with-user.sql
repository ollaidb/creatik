-- Migration: Get Creator Challenges with User Info
-- Description: Create RPC function to get creator challenges with user metadata

-- Fonction RPC pour récupérer les défis d'un créateur avec les informations de l'utilisateur
-- Utilise la table profiles au lieu de auth.users pour éviter les problèmes de permissions
CREATE OR REPLACE FUNCTION get_creator_challenges_with_user(p_creator_id UUID)
RETURNS TABLE (
  id UUID,
  challenge_id UUID,
  creator_id UUID,
  user_id UUID,
  content TEXT,
  social_network_id UUID,
  status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE,
  challenge JSONB,
  network JSONB,
  user_info JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id,
    cc.challenge_id,
    cc.creator_id,
    cc.user_id,
    cc.content,
    cc.social_network_id,
    cc.status,
    cc.created_at,
    jsonb_build_object(
      'title', c.title,
      'description', c.description,
      'category', c.category
    ) as challenge,
    jsonb_build_object(
      'name', sn.name,
      'display_name', sn.display_name
    ) as network,
    jsonb_build_object(
      'first_name', p.first_name,
      'last_name', p.last_name
    ) as user_info
  FROM creator_challenges cc
  LEFT JOIN challenges c ON cc.challenge_id = c.id
  LEFT JOIN social_networks sn ON cc.social_network_id = sn.id
  LEFT JOIN public.profiles p ON cc.user_id = p.id
  WHERE cc.creator_id = p_creator_id
    AND cc.status = 'active'
  ORDER BY cc.created_at DESC;
END;
$$;

-- Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION get_creator_challenges_with_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_creator_challenges_with_user(UUID) TO anon;

