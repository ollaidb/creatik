export interface PendingPublication {
  id: string;
  user_id: string;
  content_type: 'category' | 'subcategory' | 'title';
  title: string;
  category_id?: string;
  subcategory_id?: string;
  status: 'checking' | 'approved' | 'rejected' | 'duplicate';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PendingPublicationInsert {
  user_id: string;
  content_type: 'category' | 'subcategory' | 'title';
  title: string;
  category_id?: string;
  subcategory_id?: string;
  status?: 'checking' | 'approved' | 'rejected' | 'duplicate';
  rejection_reason?: string;
}

export interface PendingPublicationUpdate {
  status?: 'checking' | 'approved' | 'rejected' | 'duplicate';
  rejection_reason?: string;
} 