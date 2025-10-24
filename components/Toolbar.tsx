'use client';

import React, { useRef } from 'react';
import { 
  Upload, 
  Download, 
  Type, 
  Image, 
  Trash2, 
  Undo, 
  Redo,
  FileCode
} from 'lucide-react';

interface ToolbarProps {
  onImportFile: (file: File) => void;
  onImportHtml: (html: string) => void;
  onExport: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export default function Toolbar({
  onImportFile,
  onImportHtml,
  onExport,
  onAddText,
  onAddImage,
  onDelete,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasSelection,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHtmlInput, setShowHtmlInput] = React.useState(false);
  const [htmlText, setHtmlText] = React.useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
  };

  const handleHtmlSubmit = () => {
    if (htmlText.trim()) {
      onImportHtml(htmlText);
      setHtmlText('');
      setShowHtmlInput(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo/Title */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <FileCode size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">HTML Poster</span>
          </div>
          
          {/* Import Section */}
          <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow border border-gray-200"
              title="Upload HTML File"
            >
              <Upload size={18} />
              <span>Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => setShowHtmlInput(!showHtmlInput)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow border border-gray-200"
              title="Paste HTML"
            >
              <FileCode size={18} />
              <span>Paste HTML</span>
            </button>
          </div>

          {/* Add Elements Section */}
          <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
            <button
              onClick={onAddText}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow border border-gray-200"
              title="Add Text"
            >
              <Type size={18} />
              <span>Text</span>
            </button>
            
            <button
              onClick={onAddImage}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow border border-gray-200"
              title="Add Image"
            >
              <Image size={18} />
              <span>Image</span>
            </button>
          </div>

          {/* Edit Actions */}
          <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2.5 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm border border-gray-200"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2.5 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm border border-gray-200"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={18} />
            </button>
            
            <button
              onClick={onDelete}
              disabled={!hasSelection}
              className="p-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm border border-red-200"
              title="Delete Selected Element (Delete)"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Export Section */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
          title="Export HTML"
        >
          <Download size={18} />
          <span>Export HTML</span>
        </button>
      </div>

      {/* HTML Input Modal */}
      {showHtmlInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <FileCode size={24} className="text-blue-600" />
              Paste HTML Content
            </h2>
            <textarea
              value={htmlText}
              onChange={(e) => setHtmlText(e.target.value)}
              className="w-full h-80 p-4 border border-gray-300 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Paste your HTML code here..."
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowHtmlInput(false);
                  setHtmlText('');
                }}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleHtmlSubmit}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
