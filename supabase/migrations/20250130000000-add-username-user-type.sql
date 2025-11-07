-- Migration pour ajouter username et user_type à la table profiles

-- Ajouter les colonnes username et user_type à la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS user_type text DEFAULT 'creator' CHECK (user_type IN ('creator', 'contributor'));

-- Créer un index sur username pour les recherches rapides
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Mettre à jour la fonction handle_new_user pour inclure username et user_type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, username, user_type)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'username',
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'creator')
  );
  RETURN new;
END;
$$;

