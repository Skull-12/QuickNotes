import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Note } from '../types/note';
import { formatNoteDateTime } from '../utils/storage';

interface NoteCardProps {
  note: Note;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onToggleComplete: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

const LONG_NOTE_CHAR_LIMIT = 360;

export function NoteCard({
  note,
  onUpdateNote,
  onToggleComplete,
  onDeleteNote,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editError, setEditError] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isUpdated = note.updatedAt !== note.createdAt;
  const displayTimestamp = formatNoteDateTime(
    isUpdated ? note.updatedAt : note.createdAt
  );

  const isLongContent = note.content.length > LONG_NOTE_CHAR_LIMIT;
  const displayedContent =
    isLongContent && !isExpanded
      ? `${note.content.slice(0, LONG_NOTE_CHAR_LIMIT).trimEnd()}…`
      : note.content;

  const handleStartEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditError(null);
    setIsConfirmingDelete(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditError(null);
    setIsEditing(false);
  };

  const handleSaveEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = editTitle.trim();
    const trimmedContent = editContent.trim();

    if (!trimmedTitle && !trimmedContent) {
      setEditError('A note cannot be completely empty.');
      return;
    }

    onUpdateNote(
      note.id,
      trimmedTitle || 'Untitled Note',
      trimmedContent
    );
    setEditError(null);
    setIsEditing(false);
  };

  return (
    <article
      aria-label={`Note: ${note.title}`}
      className={`bg-white border rounded-xl p-5 transition-colors flex flex-col justify-between ${
        note.completed
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleSaveEdit} noValidate className="space-y-3.5">
          <div>
            <label
              htmlFor={`edit-title-${note.id}`}
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Edit Title
            </label>
            <input
              id={`edit-title-${note.id}`}
              type="text"
              value={editTitle}
              maxLength={140}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editError) setEditError(null);
              }}
              placeholder="Note title"
              autoFocus
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
            />
          </div>

          <div>
            <label
              htmlFor={`edit-content-${note.id}`}
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Edit Content
            </label>
            <textarea
              id={`edit-content-${note.id}`}
              rows={4}
              value={editContent}
              onChange={(e) => {
                setEditContent(e.target.value);
                if (editError) setEditError(null);
              }}
              placeholder="Note content"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 leading-relaxed focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15 resize-y min-h-[96px]"
            />
          </div>

          {editError && (
            <p role="alert" className="text-xs font-medium text-red-600">
              {editError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <>
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3
                className={`text-base font-semibold tracking-tight break-words ${
                  note.completed
                    ? 'line-through text-slate-500'
                    : 'text-slate-900'
                }`}
              >
                {note.title}
              </h3>

              <button
                type="button"
                onClick={() => onToggleComplete(note.id)}
                aria-pressed={note.completed}
                aria-label={
                  note.completed
                    ? `Mark "${note.title}" as active`
                    : `Mark "${note.title}" as completed`
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 whitespace-nowrap cursor-pointer min-h-[34px] ${
                  note.completed
                    ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {note.completed ? (
                  <>
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle
                      className="w-3.5 h-3.5 text-slate-500 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Complete</span>
                  </>
                )}
              </button>
            </div>

            {note.content ? (
              <div className="mt-2.5">
                <p
                  className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    note.completed ? 'text-slate-500' : 'text-slate-700'
                  }`}
                >
                  {displayedContent}
                </p>
                {isLongContent && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="mt-1.5 text-xs font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-700 cursor-pointer"
                  >
                    {isExpanded ? 'Show less' : 'Read full note'}
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs italic text-slate-400">
                No additional content.
              </p>
            )}
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            {isConfirmingDelete ? (
              <div
                role="alertdialog"
                aria-label={`Confirm deletion of ${note.title}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-red-50/80 border border-red-200 rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-red-900">
                  <AlertTriangle
                    className="w-4 h-4 text-red-600 shrink-0"
                    aria-hidden="true"
                  />
                  <span>Delete this note permanently?</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap min-h-[34px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors whitespace-nowrap min-h-[34px] cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono tabular-nums">
                  <span>{isUpdated ? 'Updated' : 'Created'}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={isUpdated ? note.updatedAt : note.createdAt}>
                    {displayTimestamp}
                  </time>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    aria-label={`Edit note "${note.title}"`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    aria-label={`Delete note "${note.title}"`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap min-h-[36px] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
}
