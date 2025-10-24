'use client';

import React, { useState, useEffect } from 'react';
import { EditableElement, ImageProperties, TextProperties } from '@/types/editor.types';

interface PropertiesPanelProps {
  selectedElement: EditableElement | null;
  onUpdate: (element: HTMLElement) => void;
}

export default function PropertiesPanel({
  selectedElement,
  onUpdate,
}: PropertiesPanelProps) {
  const [imageProps, setImageProps] = useState<ImageProperties>({
    src: '',
    alt: '',
    width: '',
    height: '',
  });

  const [textProps, setTextProps] = useState<TextProperties>({
    content: '',
    fontSize: '',
    color: '',
    fontWeight: '',
  });

  useEffect(() => {
    if (selectedElement) {
      if (selectedElement.type === 'image') {
        const img = selectedElement.element as HTMLImageElement;
        setImageProps({
          src: img.src,
          alt: img.alt,
          width: img.style.width || img.width.toString(),
          height: img.style.height || img.height.toString(),
        });
      } else if (selectedElement.type === 'text' || selectedElement.type === 'div') {
        const element = selectedElement.element;
        setTextProps({
          content: element.textContent || '',
          fontSize: window.getComputedStyle(element).fontSize,
          color: window.getComputedStyle(element).color,
          fontWeight: window.getComputedStyle(element).fontWeight,
        });
      }
    }
  }, [selectedElement]);

  const handleImageUpdate = (key: keyof ImageProperties, value: string) => {
    if (!selectedElement || selectedElement.type !== 'image') return;

    const img = selectedElement.element as HTMLImageElement;
    
    switch (key) {
      case 'src':
        img.src = value;
        break;
      case 'alt':
        img.alt = value;
        break;
      case 'width':
        img.style.width = value.includes('px') ? value : `${value}px`;
        break;
      case 'height':
        img.style.height = value.includes('px') ? value : `${value}px`;
        break;
    }

    setImageProps({ ...imageProps, [key]: value });
    onUpdate(img);
  };

  const handleTextUpdate = (key: keyof TextProperties, value: string) => {
    if (!selectedElement) return;

    const element = selectedElement.element;
    
    switch (key) {
      case 'content':
        element.textContent = value;
        break;
      case 'fontSize':
        element.style.fontSize = value.includes('px') ? value : `${value}px`;
        break;
      case 'color':
        element.style.color = value;
        break;
      case 'fontWeight':
        element.style.fontWeight = value;
        break;
    }

    setTextProps({ ...textProps, [key]: value });
    onUpdate(element);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleImageUpdate('src', result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 shadow-sm">
        <div className="text-center text-gray-400 mt-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500">No element selected</p>
          <p className="text-xs mt-2 text-gray-400">Click an element to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar shadow-sm">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h2 className="text-lg font-bold text-gray-800">Properties</h2>
        <p className="text-xs text-gray-500 mt-1">Edit selected element</p>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Element Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Element Type</p>
          <p className="font-bold text-lg text-gray-800">&lt;{selectedElement.element.tagName.toLowerCase()}&gt;</p>
        </div>

        {/* Position Info */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">Position</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <label className="text-xs text-gray-500 block mb-1">X Axis</label>
              <p className="font-semibold text-gray-800">{selectedElement.position.x.toFixed(0)}px</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <label className="text-xs text-gray-500 block mb-1">Y Axis</label>
              <p className="font-semibold text-gray-800">{selectedElement.position.y.toFixed(0)}px</p>
            </div>
          </div>
        </div>

      {selectedElement.type === 'image' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image Source
            </label>
            <input
              type="text"
              value={imageProps.src}
              onChange={(e) => handleImageUpdate('src', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={imageProps.alt}
              onChange={(e) => handleImageUpdate('alt', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Description"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Width
              </label>
              <input
                type="text"
                value={imageProps.width}
                onChange={(e) => handleImageUpdate('width', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="150px"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Height
              </label>
              <input
                type="text"
                value={imageProps.height}
                onChange={(e) => handleImageUpdate('height', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="150px"
              />
            </div>
          </div>
        </div>
      )}

      {(selectedElement.type === 'text' || selectedElement.type === 'div') && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Content
            </label>
            <textarea
              value={textProps.content}
              onChange={(e) => handleTextUpdate('content', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Enter text..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Font Size
            </label>
            <input
              type="text"
              value={textProps.fontSize}
              onChange={(e) => handleTextUpdate('fontSize', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="16px"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textProps.color.startsWith('rgb') ? '#000000' : textProps.color}
                onChange={(e) => handleTextUpdate('color', e.target.value)}
                className="w-14 h-11 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={textProps.color}
                onChange={(e) => handleTextUpdate('color', e.target.value)}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Font Weight
            </label>
            <select
              value={textProps.fontWeight}
              onChange={(e) => handleTextUpdate('fontWeight', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer bg-white"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="100">100 - Thin</option>
              <option value="200">200 - Extra Light</option>
              <option value="300">300 - Light</option>
              <option value="400">400 - Normal</option>
              <option value="500">500 - Medium</option>
              <option value="600">600 - Semi Bold</option>
              <option value="700">700 - Bold</option>
              <option value="800">800 - Extra Bold</option>
              <option value="900">900 - Black</option>
            </select>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
