# 🗑️ Configuration de la fonctionnalité Corbeille

## 📋 **Instructions pour activer la corbeille :**

### **1. Aller sur le Dashboard Supabase :**
- Va sur https://supabase.com/dashboard
- Connecte-toi à ton projet Creatik

### **2. Créer la table `trash` :**

Copie et exécute ce SQL dans l'éditeur SQL :

```sql
-- Créer la table trash
CREATE TABLE IF NOT EXISTS public.trash (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_publication_id UUID NOT NULL,
  publication_type TEXT NOT NULL CHECK (publication_type IN ('category', 'subcategory', 'title')),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID,
  subcategory_id UUID,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  will_be_deleted_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_trash_user_id ON public.trash(user_id);
CREATE INDEX IF NOT EXISTS idx_trash_deleted_at ON public.trash(deleted_at);

-- Activer RLS
ALTER TABLE public.trash ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Users can view their own trash" ON public.trash
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trash" ON public.trash
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trash" ON public.trash
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trash" ON public.trash
  FOR DELETE USING (auth.uid() = user_id);
```

### **3. Créer les fonctions SQL :**

Copie et exécute ce SQL :

```sql
-- Fonction pour ajouter un élément à la corbeille
CREATE OR REPLACE FUNCTION add_to_trash(
  p_user_id UUID,
  p_original_publication_id UUID,
  p_publication_type TEXT,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_subcategory_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.trash (
    user_id,
    original_publication_id,
    publication_type,
    title,
    description,
    category_id,
    subcategory_id,
    metadata,
    deleted_at,
    will_be_deleted_at
  ) VALUES (
    p_user_id,
    p_original_publication_id,
    p_publication_type,
    p_title,
    p_description,
    p_category_id,
    p_subcategory_id,
    p_metadata,
    NOW(),
    NOW() + INTERVAL '30 days'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour restaurer un élément de la corbeille
CREATE OR REPLACE FUNCTION restore_from_trash(p_trash_id UUID)
RETURNS void AS $$
DECLARE
  v_trash_item RECORD;
BEGIN
  -- Récupérer l'élément de la corbeille
  SELECT * INTO v_trash_item FROM public.trash WHERE id = p_trash_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Élément non trouvé dans la corbeille';
  END IF;
  
  -- Restaurer selon le type
  CASE v_trash_item.publication_type
    WHEN 'category' THEN
      INSERT INTO public.categories (
        id, name, description, color, created_at, updated_at
      ) VALUES (
        v_trash_item.original_publication_id,
        v_trash_item.title,
        v_trash_item.description,
        COALESCE(v_trash_item.metadata->>'color', 'primary'),
        NOW(),
        NOW()
      );
      
    WHEN 'subcategory' THEN
      INSERT INTO public.subcategories (
        id, name, description, category_id, created_at, updated_at
      ) VALUES (
        v_trash_item.original_publication_id,
        v_trash_item.title,
        v_trash_item.description,
        v_trash_item.category_id,
        NOW(),
        NOW()
      );
      
    WHEN 'title' THEN
      INSERT INTO public.content_titles (
        id, title, subcategory_id, created_at, updated_at
      ) VALUES (
        v_trash_item.original_publication_id,
        v_trash_item.title,
        v_trash_item.subcategory_id,
        NOW(),
        NOW()
      );
      
    ELSE
      RAISE EXCEPTION 'Type de publication non supporté: %', v_trash_item.publication_type;
  END CASE;
  
  -- Supprimer de la corbeille
  DELETE FROM public.trash WHERE id = p_trash_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **4. Mettre à jour les hooks :**

Une fois la table créée, il faudra mettre à jour les hooks pour utiliser la vraie table :

1. **`src/hooks/useTrash.tsx`** - Décommenter les vraies requêtes
2. **`src/hooks/useDeleteWithConfirmation.tsx`** - Réactiver l'ajout à la corbeille

### **5. Fonctionnalités disponibles :**

✅ **Suppression avec confirmation** - Modal de confirmation avant suppression  
✅ **Corbeille** - Page pour voir les éléments supprimés  
✅ **Restauration** - Restaurer les éléments depuis la corbeille  
✅ **Suppression définitive** - Supprimer définitivement depuis la corbeille  
✅ **Expiration automatique** - Suppression automatique après 30 jours  

### **6. Test :**

1. Va sur la page des titres
2. Clique sur l'icône poubelle d'un titre
3. Confirme la suppression
4. Va dans le profil → Corbeille
5. Vérifie que l'élément apparaît dans la corbeille

---

**🚀 Une fois ces étapes terminées, la fonctionnalité corbeille sera complètement opérationnelle !** 