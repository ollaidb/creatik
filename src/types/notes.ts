// Types pour le système de notes avancé

export interface UserFolder {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'content' | 'account_ideas';
  parent_folder_id?: string;
  color: string;
  icon: string;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  parent_folder?: UserFolder;
  sub_folders?: UserFolder[];
  documents?: UserDocument[];
}

export interface UserDocument {
  id: string;
  user_id: string;
  folder_id?: string;
  title: string;
  content: string;
  type: 'content' | 'account_idea';
  format: 'markdown' | 'rich_text' | 'plain_text';
  tags: string[];
  is_favorite: boolean;
  is_archived: boolean;
  is_pinned: boolean;
  word_count: number;
  reading_time: number;
  last_edited_at: string;
  created_at: string;
  updated_at: string;
  // Relations
  folder?: UserFolder;
  social_settings?: DocumentSocialSettings;
  account_settings?: DocumentAccountSettings;
  versions?: DocumentVersion[];
}

export interface DocumentSocialSettings {
  id: string;
  document_id: string;
  social_network: 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'youtube' | 'facebook' | 'pinterest';
  target_audience?: string;
  content_goals: string[];
  hashtags: string[];
  posting_time_suggestion?: string;
  engagement_strategy?: string;
  call_to_action?: string;
  visual_requirements?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentAccountSettings {
  id: string;
  document_id: string;
  account_area: 'bio' | 'profile' | 'strategy' | 'growth' | 'engagement' | 'content_planning' | 'analytics' | 'monetization';
  priority_level: 'low' | 'medium' | 'high';
  implementation_status: 'idea' | 'planning' | 'in_progress' | 'completed' | 'on_hold';
  target_date?: string;
  resources_needed: string[];
  success_metrics: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  title: string;
  content: string;
  change_summary?: string;
  created_at: string;
}

export interface DocumentTemplate {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  type: 'content' | 'account_idea';
  template_content: string;
  social_network?: string;
  account_area?: string;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// Types pour les formulaires et l'UI
export interface CreateFolderData {
  name: string;
  description?: string;
  type: 'content' | 'account_ideas';
  parent_folder_id?: string;
  color?: string;
  icon?: string;
}

export interface CreateDocumentData {
  title: string;
  content?: string;
  type: 'content' | 'account_idea';
  folder_id?: string;
  format?: 'markdown' | 'rich_text' | 'plain_text';
  tags?: string[];
}

export interface UpdateDocumentData {
  title?: string;
  content?: string;
  folder_id?: string;
  tags?: string[];
  is_favorite?: boolean;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export interface DocumentSearchFilters {
  query?: string;
  type?: 'content' | 'account_idea';
  folder_id?: string;
  tags?: string[];
  is_favorite?: boolean;
  is_pinned?: boolean;
  is_archived?: boolean;
  date_from?: string;
  date_to?: string;
  social_network?: string;
  account_area?: string;
  priority_level?: string;
  implementation_status?: string;
}

export interface DocumentSearchResult {
  id: string;
  title: string;
  content: string;
  type: string;
  folder_name?: string;
  tags: string[];
  is_favorite: boolean;
  is_pinned: boolean;
  word_count: number;
  reading_time: number;
  last_edited_at: string;
  created_at: string;
  rank: number;
}

// Types pour les statistiques
export interface DocumentStats {
  total_documents: number;
  total_folders: number;
  total_words: number;
  total_reading_time: number;
  documents_by_type: {
    content: number;
    account_idea: number;
  };
  documents_by_status: {
    idea: number;
    planning: number;
    in_progress: number;
    completed: number;
    on_hold: number;
  };
  recent_activity: {
    documents_created: number;
    documents_updated: number;
    words_written: number;
  };
}

// Types pour les templates prédéfinis
export interface ContentTemplate {
  name: string;
  description: string;
  content: string;
  social_network: string;
  category: string;
}

export interface AccountTemplate {
  name: string;
  description: string;
  content: string;
  account_area: string;
  category: string;
}

// Types pour l'éditeur
export interface EditorState {
  content: string;
  title: string;
  cursorPosition: number;
  selectedText: string;
  wordCount: number;
  readingTime: number;
  hasUnsavedChanges: boolean;
  lastAutoSave?: Date;
}

export interface EditorSettings {
  showToolbar: boolean;
  showSidebar: boolean;
  showPreview: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'auto';
  lineHeight: number;
  showWordCount: boolean;
  showReadingTime: boolean;
}

// Types pour les raccourcis clavier
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: string;
  description: string;
}

// Types pour les notifications
export interface EditorNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Types pour l'export/import
export interface ExportOptions {
  format: 'markdown' | 'html' | 'pdf' | 'docx' | 'txt';
  includeMetadata: boolean;
  includeVersions: boolean;
  includeSettings: boolean;
  folderStructure: boolean;
}

export interface ImportOptions {
  format: 'markdown' | 'html' | 'txt';
  createFolders: boolean;
  preserveStructure: boolean;
  mergeDuplicates: boolean;
}

// Types pour la collaboration (futur)
export interface DocumentCollaborator {
  id: string;
  user_id: string;
  document_id: string;
  role: 'viewer' | 'editor' | 'admin';
  permissions: {
    can_edit: boolean;
    can_comment: boolean;
    can_share: boolean;
    can_delete: boolean;
  };
  invited_at: string;
  accepted_at?: string;
}

export interface DocumentComment {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  position?: {
    start: number;
    end: number;
  };
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}

// Types pour l'API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Types pour les hooks
export interface UseDocumentsOptions {
  type?: 'content' | 'account_idea';
  folder_id?: string;
  search?: string;
  tags?: string[];
  is_favorite?: boolean;
  is_pinned?: boolean;
  is_archived?: boolean;
  pagination?: PaginationParams;
}

export interface UseFoldersOptions {
  type?: 'content' | 'account_ideas';
  parent_folder_id?: string;
  include_subfolders?: boolean;
  include_documents?: boolean;
}

// Types pour les composants
export interface FolderTreeProps {
  folders: UserFolder[];
  selectedFolderId?: string;
  onFolderSelect: (folder: UserFolder) => void;
  onFolderCreate: (parentId?: string) => void;
  onFolderEdit: (folder: UserFolder) => void;
  onFolderDelete: (folder: UserFolder) => void;
  onFolderMove: (folder: UserFolder, newParentId?: string) => void;
}

export interface DocumentListProps {
  documents: UserDocument[];
  selectedDocumentId?: string;
  onDocumentSelect: (document: UserDocument) => void;
  onDocumentCreate: (folderId?: string) => void;
  onDocumentEdit: (document: UserDocument) => void;
  onDocumentDelete: (document: UserDocument) => void;
  onDocumentMove: (document: UserDocument, newFolderId?: string) => void;
  onDocumentDuplicate: (document: UserDocument) => void;
  onDocumentExport: (document: UserDocument) => void;
}

export interface DocumentEditorProps {
  document?: UserDocument;
  onSave: (document: UserDocument) => void;
  onAutoSave?: (document: Partial<UserDocument>) => void;
  onClose?: () => void;
  readOnly?: boolean;
  showSidebar?: boolean;
  showToolbar?: boolean;
}

// Types pour les utilitaires
export interface DocumentMetadata {
  wordCount: number;
  readingTime: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  lastModified: Date;
  created: Date;
  tags: string[];
  socialNetwork?: string;
  accountArea?: string;
}

export interface DocumentAnalytics {
  views: number;
  edits: number;
  shares: number;
  timeSpent: number;
  completionRate: number;
  engagementScore: number;
}

// Types pour les plugins (futur)
export interface EditorPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  settings: Record<string, unknown>;
  commands: EditorCommand[];
  shortcuts: KeyboardShortcut[];
}

export interface EditorCommand {
  id: string;
  name: string;
  description: string;
  execute: (editor: unknown, params?: unknown) => void;
  canExecute?: (editor: unknown, params?: unknown) => boolean;
}
