export interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteFilter = 'all' | 'active' | 'completed';
