import { Note } from '../types/note';

const STORAGE_KEY = 'quicknotes_saved_notes_v1';

export function loadNotesFromStorage(): Note[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          (typeof item.title === 'string' || typeof item.content === 'string')
      )
      .map((item) => ({
        id: String(item.id),
        title: typeof item.title === 'string' ? item.title : '',
        content: typeof item.content === 'string' ? item.content : '',
        completed: Boolean(item.completed),
        createdAt:
          typeof item.createdAt === 'string'
            ? item.createdAt
            : new Date().toISOString(),
        updatedAt:
          typeof item.updatedAt === 'string'
            ? item.updatedAt
            : typeof item.createdAt === 'string'
              ? item.createdAt
              : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Gracefully ignore storage quota or private browsing errors
  }
}

export function formatNoteDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}
