/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, FileText, Plus } from 'lucide-react';
import { Note, NoteFilter } from './types/note';
import { loadNotesFromStorage, saveNotesToStorage } from './utils/storage';
import { NoteForm } from './components/NoteForm';
import { NoteCard } from './components/NoteCard';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteFilter>('all');
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  const handleAddNote = (title: string, content: string) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title,
      content,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  const handleUpdateNote = (id: string, title: string, content: string) => {
    const now = new Date().toISOString();
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              title,
              content,
              updatedAt: now,
            }
          : note
      )
    );
  };

  const handleToggleComplete = (id: string) => {
    const now = new Date().toISOString();
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              completed: !note.completed,
              updatedAt: now,
            }
          : note
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const sortedAndFilteredNotes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return [...notes]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .filter((note) => {
        if (statusFilter === 'active' && note.completed) return false;
        if (statusFilter === 'completed' && !note.completed) return false;

        if (!normalizedQuery) return true;

        const matchesTitle = note.title.toLowerCase().includes(normalizedQuery);
        const matchesContent = note.content
          .toLowerCase()
          .includes(normalizedQuery);

        return matchesTitle || matchesContent;
      });
  }, [notes, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    const total = notes.length;
    const completed = notes.filter((n) => n.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [notes]);

  const focusCreateInput = () => {
    titleInputRef.current?.focus();
    titleInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <a
            href="#top"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
          >
            QuickNotes
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#add-note-heading"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Create Note
            </a>
            <a
              href="#search-section-heading"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Search
            </a>
            <a
              href="#notes-section-heading"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Saved Notes
            </a>
            <a
              href="#about-quicknotes"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={focusCreateInput}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="top"
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8"
      >
        {/* Page Heading & Intro */}
        <section aria-labelledby="page-title" className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <h1
                id="page-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
              >
                QuickNotes
              </h1>
              <p className="text-base font-medium text-slate-700 mt-1">
                Simple notes, right in your browser.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono tabular-nums">
              <span>{counts.total} total</span>
              <span aria-hidden="true">·</span>
              <span>{counts.active} active</span>
              <span aria-hidden="true">·</span>
              <span>{counts.completed} completed</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Capture ideas, meeting notes, and daily tasks effortlessly. Your notes are stored directly in your browser’s local storage so they stay available whenever you refresh or return—with no sign-up required.
          </p>
        </section>

        {/* Add-Note Section */}
        <NoteForm onAddNote={handleAddNote} titleInputRef={titleInputRef} />

        {/* Search & Filter Section */}
        <section
          aria-labelledby="search-section-heading"
          className="space-y-3 pt-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2
              id="search-section-heading"
              className="text-base font-semibold text-slate-900 tracking-tight"
            >
              Find & Filter Notes
            </h2>

            {/* Interactive status filter tabs */}
            <div
              role="group"
              aria-label="Filter notes by status"
              className="inline-flex items-center gap-1 p-1 bg-slate-200/75 rounded-lg self-start sm:self-auto"
            >
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({counts.total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'active'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({counts.active})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({counts.completed})
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="search-notes"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Search Notes
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="search-notes"
                name="search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by title or content..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/15 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Notes List Section */}
        <section
          aria-labelledby="notes-section-heading"
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2
              id="notes-section-heading"
              className="text-lg font-semibold text-slate-900 tracking-tight"
            >
              Your Notes
            </h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Showing {sortedAndFilteredNotes.length} of {notes.length}{' '}
              {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {notes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                No notes yet. Create your first note!
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Use the form above to add a title and note content. Your notes will appear here sorted with the newest first.
              </p>
              <button
                type="button"
                onClick={focusCreateInput}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Write Your First Note</span>
              </button>
            </div>
          ) : sortedAndFilteredNotes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <h3 className="text-base font-semibold text-slate-900">
                No matching notes found
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                No notes matched your current search or status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap min-h-[38px] cursor-pointer"
              >
                Reset Search & Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedAndFilteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdateNote={handleUpdateNote}
                  onToggleComplete={handleToggleComplete}
                  onDeleteNote={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>

        {/* Descriptive SEO / About Section */}
        <section
          id="about-quicknotes"
          aria-labelledby="about-heading"
          className="pt-6 border-t border-slate-200"
        >
          <h2
            id="about-heading"
            className="text-sm font-semibold text-slate-900 tracking-tight"
          >
            About QuickNotes Online Note Taking
          </h2>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed max-w-3xl">
            QuickNotes is a fast, lightweight browser-based note-taking tool designed for instant access. Create structured notes with titles and details, mark items as completed, edit existing entries, and search across all your notes in real time. All information stays strictly inside your web browser using local storage.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <p className="font-medium text-slate-800">
            QuickNotes — Your notes, stored locally.
          </p>
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} QuickNotes. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
