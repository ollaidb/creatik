
-- Permettre aux admins de voir toutes les publications (pas seulement les leurs)
CREATE POLICY "Admins can view all publications"
  ON public.user_publications
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Permettre aux admins de modifier le statut des publications
CREATE POLICY "Admins can update all publications"
  ON public.user_publications
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
