import React, { useState, RefObject } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

interface NoteFormProps {
  onAddNote: (title: string, content: string) => void;
  titleInputRef?: RefObject<HTMLInputElement | null>;
}

export function NoteForm({ onAddNote, titleInputRef }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      setErrorMessage('Please enter a note title or note content before adding.');
      return;
    }

    onAddNote(trimmedTitle || 'Untitled Note', trimmedContent);
    setTitle('');
    setContent('');
    setErrorMessage(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (!trimmedTitle && !trimmedContent) {
        setErrorMessage('Please enter a note title or note content before adding.');
        return;
      }

      onAddNote(trimmedTitle || 'Untitled Note', trimmedContent);
      setTitle('');
      setContent('');
      setErrorMessage(null);
    }
  };

  return (
    <section
      aria-labelledby="add-note-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
    >
      <div className="mb-4">
        <h2
          id="add-note-heading"
          className="text-base font-semibold text-slate-900 tracking-tight"
        >
          Create a Note
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Write down quick thoughts, tasks, or reminders. Everything is saved automatically in your browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="note-title"
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Note Title
          </label>
          <input
            ref={titleInputRef}
            id="note-title"
            name="title"
            type="text"
            value={title}
            maxLength={140}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g., Weekly project checklist or meeting summary"
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15 transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="note-content"
              className="block text-sm font-medium text-slate-800"
            >
              Note Content
            </label>
            <span
              className="text-xs text-slate-500 font-mono tabular-nums"
              aria-live="polite"
            >
              {content.length} chars
            </span>
          </div>
          <textarea
            id="note-content"
            name="content"
            rows={4}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write your note details here..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15 transition-colors resize-y min-h-[104px]"
          />
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500">
            Tip: Press <kbd className="font-mono text-slate-700">Ctrl</kbd> +{' '}
            <kbd className="font-mono text-slate-700">Enter</kbd> to save quickly.
          </span>

          <div className="flex items-center justify-end gap-2.5">
            {(title.length > 0 || content.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setContent('');
                  setErrorMessage(null);
                }}
                className="px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap min-h-[40px]"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 whitespace-nowrap min-h-[40px] cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
