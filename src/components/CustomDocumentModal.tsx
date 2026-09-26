import React, { useState } from 'react';
import { X, Upload, FileText, Check } from 'lucide-react';

interface CustomDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, text: string) => void;
}

export const CustomDocumentModal: React.FC<CustomDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(title.trim() || 'Custom Legal Document', text.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-stone-700" />
            <h3 className="font-semibold text-stone-900 text-base">Analyze Custom Legal Document</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Document Title / Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Master Consulting Agreement v2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* File Upload Option */}
          <div className="border border-dashed border-stone-300 rounded-lg p-4 bg-stone-50/50 flex flex-col items-center justify-center text-center">
            <Upload className="w-6 h-6 text-stone-400 mb-1" />
            <span className="text-xs text-stone-700 font-medium">Upload Contract File (.txt, .md)</span>
            <span className="text-[11px] text-stone-500 mt-0.5">Or paste text below directly</span>
            <label className="mt-2 text-xs font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer">
              Choose File
              <input
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {fileName && (
              <span className="text-[11px] text-emerald-700 mt-1 font-medium">
                Loaded: {fileName}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Contract Text / Content:
            </label>
            <textarea
              rows={9}
              placeholder="Paste contract terms, NDA clauses, employment offer terms, or lease provisions here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              className="w-full text-xs font-legal-serif p-3 bg-stone-50 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-700 leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-md cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-4 py-2 text-xs font-semibold bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-md cursor-pointer shadow-xs transition-colors"
            >
              Load & Run Analysis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
