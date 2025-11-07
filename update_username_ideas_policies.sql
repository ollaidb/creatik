-- Script pour mettre à jour les politiques RLS de username_ideas
-- Permet les insertions automatiques avec user_id = NULL

-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Username ideas are insertable by authenticated users" ON public.username_ideas;

-- Créer une nouvelle politique qui permet les insertions avec user_id = NULL
CREATE POLICY "Username ideas are insertable by everyone" 
ON public.username_ideas 
FOR INSERT 
WITH CHECK (true);

-- Mettre à jour la politique de modification pour permettre la modification des entrées sans user_id
DROP POLICY IF EXISTS "Users can update own username ideas" ON public.username_ideas;

CREATE POLICY "Users can update own username ideas" 
ON public.username_ideas 
FOR UPDATE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- Mettre à jour la politique de suppression pour permettre la suppression des entrées sans user_id
DROP POLICY IF EXISTS "Users can delete own username ideas" ON public.username_ideas;

CREATE POLICY "Users can delete own username ideas" 
ON public.username_ideas 
FOR DELETE 
USING (
  (auth.uid() = user_id) OR 
  (user_id IS NULL)
);

-- Message de confirmation
SELECT 'Politiques RLS mises à jour avec succès!' as message;

