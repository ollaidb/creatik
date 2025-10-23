import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type {
  UserFolder,
  UserDocument,
  DocumentSocialSettings,
  DocumentAccountSettings,
  DocumentTemplate,
  CreateFolderData,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentSearchFilters,
  DocumentSearchResult,
  DocumentStats,
  UseDocumentsOptions,
  UseFoldersOptions
} from '@/types/notes';

// Hook pour gérer les dossiers
export const useFolders = (options: UseFoldersOptions = {}) => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<UserFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('user_folders')
        .select(`
          *,
          parent_folder:user_folders!parent_folder_id(*),
          sub_folders:user_folders!parent_folder_id(*),
          documents:user_documents(*)
        `)
        .eq('user_id', user.id)
        .eq('is_archived', false);

      if (options.type) {
        query = query.eq('type', options.type);
      }

      if (options.parent_folder_id !== undefined) {
        if (options.parent_folder_id === null) {
          query = query.is('parent_folder_id', null);
        } else {
          query = query.eq('parent_folder_id', options.parent_folder_id);
        }
      }

      query = query.order('sort_order', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setFolders(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  }, [user, options.type, options.parent_folder_id]);

  const createFolder = useCallback(async (folderData: CreateFolderData) => {
      if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('user_folders')
        .insert({
          ...folderData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création du dossier');
    }
  }, [user]);

  const updateFolder = useCallback(async (folderId: string, updates: Partial<UserFolder>) => {
      if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('user_folders')
        .update(updates)
        .eq('id', folderId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => prev.map(folder => 
        folder.id === folderId ? { ...folder, ...data } : folder
      ));

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du dossier');
    }
  }, [user]);

  const deleteFolder = useCallback(async (folderId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('user_folders')
        .delete()
        .eq('id', folderId)
        .eq('user_id', user.id);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== folderId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression du dossier');
    }
  }, [user]);

  const moveFolder = useCallback(async (folderId: string, newParentId?: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('user_folders')
        .update({ parent_folder_id: newParentId })
        .eq('id', folderId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => prev.map(folder => 
        folder.id === folderId ? { ...folder, ...data } : folder
      ));

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du déplacement du dossier');
    }
  }, [user]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    createFolder,
    updateFolder,
    deleteFolder,
    moveFolder,
    refetch: fetchFolders
  };
};

// Hook pour gérer les documents
export const useDocuments = (options: UseDocumentsOptions = {}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('user_documents')
        .select(`
          *,
          folder:user_folders(*),
          social_settings:document_social_settings(*),
          account_settings:document_account_settings(*)
        `)
        .eq('user_id', user.id)
        .eq('is_archived', false);

      if (options.type) {
        query = query.eq('type', options.type);
      }

      if (options.folder_id) {
        query = query.eq('folder_id', options.folder_id);
      }

      if (options.is_favorite !== undefined) {
        query = query.eq('is_favorite', options.is_favorite);
      }

      if (options.is_pinned !== undefined) {
        query = query.eq('is_pinned', options.is_pinned);
      }

      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,content.ilike.%${options.search}%`);
      }

      if (options.tags && options.tags.length > 0) {
        query = query.overlaps('tags', options.tags);
      }

      query = query.order('is_pinned', { ascending: false })
                  .order('last_edited_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDocuments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  }, [user, options]);

  const createDocument = useCallback(async (documentData: CreateDocumentData) => {
      if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          ...documentData,
          user_id: user.id,
          content: documentData.content || '',
          format: documentData.format || 'markdown',
          tags: documentData.tags || []
        })
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création du document');
    }
  }, [user]);

  const updateDocument = useCallback(async (documentId: string, updates: UpdateDocumentData) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .update(updates)
        .eq('id', documentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, ...data } : doc
      ));

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du document');
    }
  }, [user]);

  const deleteDocument = useCallback(async (documentId: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression du document');
    }
  }, [user]);

  const duplicateDocument = useCallback(async (documentId: string) => {
      if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data: originalDoc, error: fetchError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('id', documentId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      const { data, error } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          folder_id: originalDoc.folder_id,
          title: `${originalDoc.title} (Copie)`,
          content: originalDoc.content,
          type: originalDoc.type,
          format: originalDoc.format,
          tags: originalDoc.tags
        })
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la duplication du document');
    }
  }, [user]);

  const moveDocument = useCallback(async (documentId: string, newFolderId?: string) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .update({ folder_id: newFolderId })
        .eq('id', documentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, ...data } : doc
      ));

      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du déplacement du document');
    }
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    createDocument,
    updateDocument,
    deleteDocument,
    duplicateDocument,
    moveDocument,
    refetch: fetchDocuments
  };
};

// Hook pour la recherche de documents
export const useDocumentSearch = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<DocumentSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDocuments = useCallback(async (filters: DocumentSearchFilters) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase
        .rpc('search_documents', {
          search_query: filters.query || null,
          user_uuid: user.id,
          document_type: filters.type || null,
          folder_id_filter: filters.folder_id || null,
          tags_filter: filters.tags || null,
          show_archived: filters.is_archived || false
        });

      if (searchError) throw searchError;

      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    results,
    loading,
    error,
    searchDocuments
  };
};

// Hook pour les paramètres sociaux
export const useDocumentSocialSettings = (documentId?: string) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DocumentSocialSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user || !documentId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('document_social_settings')
        .select('*')
        .eq('document_id', documentId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  }, [user, documentId]);

  const updateSettings = useCallback(async (updates: Partial<DocumentSocialSettings>) => {
    if (!user || !documentId) throw new Error('Document non spécifié');

    try {
      if (settings) {
        // Mise à jour
        const { data, error } = await supabase
          .from('document_social_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
      } else {
        // Création
        const { data, error } = await supabase
          .from('document_social_settings')
          .insert({
            document_id: documentId,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des paramètres');
    }
  }, [user, documentId, settings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};

// Hook pour les paramètres de compte
export const useDocumentAccountSettings = (documentId?: string) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DocumentAccountSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user || !documentId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('document_account_settings')
        .select('*')
        .eq('document_id', documentId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  }, [user, documentId]);

  const updateSettings = useCallback(async (updates: Partial<DocumentAccountSettings>) => {
    if (!user || !documentId) throw new Error('Document non spécifié');

    try {
      if (settings) {
        // Mise à jour
        const { data, error } = await supabase
          .from('document_account_settings')
          .update(updates)
          .eq('id', settings.id)
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
      } else {
        // Création
        const { data, error } = await supabase
          .from('document_account_settings')
          .insert({
            document_id: documentId,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;
        setSettings(data);
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des paramètres');
    }
  }, [user, documentId, settings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

    return {
    settings,
    loading,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};

// Hook pour les templates
export const useDocumentTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('document_templates')
        .select('*')
        .or(`user_id.eq.${user.id},is_public.eq.true`)
        .order('usage_count', { ascending: false });

      if (fetchError) throw fetchError;

      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des modèles');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTemplate = useCallback(async (templateData: Partial<DocumentTemplate>) => {
    if (!user) throw new Error('Utilisateur non connecté');

    try {
      const { data, error } = await supabase
        .from('document_templates')
        .insert({
          ...templateData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création du modèle');
    }
  }, [user]);

  const updateTemplateUsage = useCallback(async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .eq('id', templateId);

      if (error) throw error;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du compteur d\'utilisation:', err);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplateUsage,
    refetch: fetchTemplates
  };
};

// Hook pour les statistiques
export const useDocumentStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Récupérer les statistiques de base
      const { data: documents, error: docsError } = await supabase
        .from('user_documents')
        .select('type, word_count, created_at, updated_at')
        .eq('user_id', user.id)
        .eq('is_archived', false);

      if (docsError) throw docsError;

      const { data: folders, error: foldersError } = await supabase
        .from('user_folders')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_archived', false);

      if (foldersError) throw foldersError;

      // Calculer les statistiques
      const totalWords = documents?.reduce((sum, doc) => sum + (doc.word_count || 0), 0) || 0;
      const totalReadingTime = Math.ceil(totalWords / 200);

      const documentsByType = documents?.reduce((acc, doc) => {
        acc[doc.type as keyof typeof acc] = (acc[doc.type as keyof typeof acc] || 0) + 1;
        return acc;
      }, { content: 0, account_idea: 0 }) || { content: 0, account_idea: 0 };

      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentActivity = {
        documents_created: documents?.filter(doc => new Date(doc.created_at) >= weekAgo).length || 0,
        documents_updated: documents?.filter(doc => new Date(doc.updated_at) >= weekAgo).length || 0,
        words_written: documents?.filter(doc => new Date(doc.updated_at) >= weekAgo)
          .reduce((sum, doc) => sum + (doc.word_count || 0), 0) || 0
      };

      setStats({
        total_documents: documents?.length || 0,
        total_folders: folders?.length || 0,
        total_words: totalWords,
        total_reading_time: totalReadingTime,
        documents_by_type: documentsByType,
        documents_by_status: {
          idea: 0,
          planning: 0,
          in_progress: 0,
          completed: 0,
          on_hold: 0
        },
        recent_activity: recentActivity
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};