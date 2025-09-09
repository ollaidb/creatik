-- =====================================================
-- TABLES POUR LA FONCTIONNALITÉ DE PARTAGE DE RÉSEAUX
-- =====================================================

-- 1. Table pour stocker les partages de réseaux
CREATE TABLE IF NOT EXISTS public.network_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_email VARCHAR(255) NOT NULL,
  permissions VARCHAR(20) NOT NULL CHECK (permissions IN ('view', 'edit')),
  share_token VARCHAR(255) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optionnel : expiration du partage
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table pour lier les partages aux réseaux sociaux spécifiques
CREATE TABLE IF NOT EXISTS public.shared_network_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id UUID NOT NULL REFERENCES public.network_shares(id) ON DELETE CASCADE,
  social_account_id UUID NOT NULL REFERENCES public.user_social_accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(share_id, social_account_id)
);

-- 3. Table pour tracker les actions des utilisateurs partagés
CREATE TABLE IF NOT EXISTS public.shared_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id UUID NOT NULL REFERENCES public.network_shares(id) ON DELETE CASCADE,
  social_account_id UUID NOT NULL REFERENCES public.user_social_accounts(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'challenge_added', 'challenge_completed', 'publication_added', 'publication_deleted', etc.
  action_data JSONB, -- Données spécifiques à l'action
  performed_by_email VARCHAR(255) NOT NULL, -- Email de la personne qui a fait l'action
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES POUR OPTIMISER LES PERFORMANCES
-- =====================================================

-- Index pour les recherches par token de partage
CREATE INDEX IF NOT EXISTS idx_network_shares_token ON public.network_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_network_shares_owner ON public.network_shares(owner_id);
CREATE INDEX IF NOT EXISTS idx_network_shares_email ON public.network_shares(shared_with_email);

-- Index pour les accès partagés
CREATE INDEX IF NOT EXISTS idx_shared_network_access_share ON public.shared_network_access(share_id);
CREATE INDEX IF NOT EXISTS idx_shared_network_access_social ON public.shared_network_access(social_account_id);

-- Index pour les actions partagées
CREATE INDEX IF NOT EXISTS idx_shared_actions_share ON public.shared_actions(share_id);
CREATE INDEX IF NOT EXISTS idx_shared_actions_social ON public.shared_actions(social_account_id);
CREATE INDEX IF NOT EXISTS idx_shared_actions_type ON public.shared_actions(action_type);

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour générer un token de partage unique
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier les permissions d'un partage
CREATE OR REPLACE FUNCTION check_share_permissions(
  p_share_token TEXT,
  p_social_account_id UUID DEFAULT NULL
)
RETURNS TABLE(
  has_access BOOLEAN,
  permissions VARCHAR(20),
  shared_with_email VARCHAR(255),
  owner_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN sna.social_account_id IS NOT NULL OR p_social_account_id IS NULL THEN true
      ELSE false
    END as has_access,
    ns.permissions,
    ns.shared_with_email,
    ns.owner_id
  FROM public.network_shares ns
  LEFT JOIN public.shared_network_access sna ON ns.id = sna.share_id
  WHERE ns.share_token = p_share_token
    AND ns.is_active = true
    AND (ns.expires_at IS NULL OR ns.expires_at > NOW())
    AND (p_social_account_id IS NULL OR sna.social_account_id = p_social_account_id);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer un partage de réseau
CREATE OR REPLACE FUNCTION create_network_share(
  p_owner_id UUID,
  p_shared_with_email VARCHAR(255),
  p_permissions VARCHAR(20),
  p_social_account_ids UUID[] DEFAULT NULL,
  p_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_share_id UUID;
  v_social_account_id UUID;
BEGIN
  -- Créer le partage
  INSERT INTO public.network_shares (
    owner_id,
    shared_with_email,
    permissions,
    expires_at
  ) VALUES (
    p_owner_id,
    p_shared_with_email,
    p_permissions,
    p_expires_at
  ) RETURNING id INTO v_share_id;

  -- Lier les réseaux sociaux si spécifiés
  IF p_social_account_ids IS NOT NULL THEN
    FOREACH v_social_account_id IN ARRAY p_social_account_ids
    LOOP
      INSERT INTO public.shared_network_access (share_id, social_account_id)
      VALUES (v_share_id, v_social_account_id);
    END LOOP;
  END IF;

  RETURN v_share_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour enregistrer une action partagée
CREATE OR REPLACE FUNCTION log_shared_action(
  p_share_token TEXT,
  p_social_account_id UUID,
  p_action_type VARCHAR(50),
  p_action_data JSONB DEFAULT NULL,
  p_performed_by_email VARCHAR(255)
)
RETURNS UUID AS $$
DECLARE
  v_share_id UUID;
  v_action_id UUID;
BEGIN
  -- Récupérer l'ID du partage
  SELECT id INTO v_share_id
  FROM public.network_shares
  WHERE share_token = p_share_token
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW());

  IF v_share_id IS NULL THEN
    RAISE EXCEPTION 'Partage non trouvé ou expiré';
  END IF;

  -- Vérifier que le réseau social est partagé
  IF NOT EXISTS (
    SELECT 1 FROM public.shared_network_access
    WHERE share_id = v_share_id AND social_account_id = p_social_account_id
  ) THEN
    RAISE EXCEPTION 'Réseau social non partagé';
  END IF;

  -- Enregistrer l'action
  INSERT INTO public.shared_actions (
    share_id,
    social_account_id,
    action_type,
    action_data,
    performed_by_email
  ) VALUES (
    v_share_id,
    p_social_account_id,
    p_action_type,
    p_action_data,
    p_performed_by_email
  ) RETURNING id INTO v_action_id;

  RETURN v_action_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLITIQUES RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.network_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_network_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_actions ENABLE ROW LEVEL SECURITY;

-- Politiques pour network_shares
CREATE POLICY "Users can view their own shares" ON public.network_shares
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create shares" ON public.network_shares
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own shares" ON public.network_shares
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own shares" ON public.network_shares
  FOR DELETE USING (auth.uid() = owner_id);

-- Politiques pour shared_network_access
CREATE POLICY "Users can view shared access for their shares" ON public.shared_network_access
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.network_shares ns 
      WHERE ns.id = share_id AND ns.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create shared access for their shares" ON public.shared_network_access
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.network_shares ns 
      WHERE ns.id = share_id AND ns.owner_id = auth.uid()
    )
  );

-- Politiques pour shared_actions
CREATE POLICY "Users can view actions for their shares" ON public.shared_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.network_shares ns 
      WHERE ns.id = share_id AND ns.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create shared actions with valid token" ON public.shared_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.network_shares ns 
      WHERE ns.id = share_id 
        AND ns.is_active = true
        AND (ns.expires_at IS NULL OR ns.expires_at > NOW())
    )
  );

-- =====================================================
-- TRIGGERS POUR MAINTENIR LA COHÉRENCE
-- =====================================================

-- Trigger pour mettre à jour updated_at sur network_shares
CREATE OR REPLACE FUNCTION update_network_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_network_shares_updated_at
  BEFORE UPDATE ON public.network_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_network_shares_updated_at();

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Commentaire : Pour tester la fonctionnalité, vous pouvez utiliser :
-- SELECT create_network_share(
--   'your-user-id'::UUID,
--   'test@example.com',
--   'edit',
--   ARRAY['social-account-id-1'::UUID, 'social-account-id-2'::UUID],
--   NOW() + INTERVAL '30 days'
-- );

-- =====================================================
-- VUES UTILES POUR L'APPLICATION
-- =====================================================

-- Vue pour récupérer les partages avec les détails des réseaux
CREATE OR REPLACE VIEW public.network_shares_with_details AS
SELECT 
  ns.id,
  ns.owner_id,
  ns.shared_with_email,
  ns.permissions,
  ns.share_token,
  ns.expires_at,
  ns.is_active,
  ns.created_at,
  ns.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', usa.id,
        'platform', usa.platform,
        'display_name', usa.display_name,
        'username', usa.username
      )
    ) FILTER (WHERE usa.id IS NOT NULL),
    '[]'::json
  ) as shared_networks
FROM public.network_shares ns
LEFT JOIN public.shared_network_access sna ON ns.id = sna.share_id
LEFT JOIN public.user_social_accounts usa ON sna.social_account_id = usa.id
GROUP BY ns.id, ns.owner_id, ns.shared_with_email, ns.permissions, 
         ns.share_token, ns.expires_at, ns.is_active, ns.created_at, ns.updated_at;

-- Vue pour récupérer les actions récentes d'un partage
CREATE OR REPLACE VIEW public.recent_shared_actions AS
SELECT 
  sa.id,
  sa.share_id,
  sa.social_account_id,
  sa.action_type,
  sa.action_data,
  sa.performed_by_email,
  sa.created_at,
  usa.platform,
  usa.display_name as network_display_name
FROM public.shared_actions sa
JOIN public.user_social_accounts usa ON sa.social_account_id = usa.id
ORDER BY sa.created_at DESC;

-- =====================================================
-- COMMENTAIRES POUR LA DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.network_shares IS 'Stocke les partages de réseaux sociaux entre utilisateurs';
COMMENT ON TABLE public.shared_network_access IS 'Lie les partages aux réseaux sociaux spécifiques';
COMMENT ON TABLE public.shared_actions IS 'Enregistre les actions effectuées par les utilisateurs partagés';

COMMENT ON COLUMN public.network_shares.share_token IS 'Token unique pour accéder au partage';
COMMENT ON COLUMN public.network_shares.permissions IS 'view: lecture seule, edit: lecture et écriture';
COMMENT ON COLUMN public.shared_actions.action_type IS 'Type d action: challenge_added, challenge_completed, publication_added, etc.';
COMMENT ON COLUMN public.shared_actions.action_data IS 'Données JSON spécifiques à l action effectuée';
