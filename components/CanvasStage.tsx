'use client';

import React, { useRef, useEffect, useState } from 'react';
import { EditableElement } from '@/types/editor.types';
import { ElementManagerService } from '@/services/ElementManagerService';

interface CanvasStageProps {
  htmlContent: string;
  styles: string;
  selectedElement: EditableElement | null;
  onElementSelect: (element: EditableElement | null) => void;
  onContentChange: (html: string) => void;
}

export default function CanvasStage({
  htmlContent,
  styles,
  selectedElement,
  onElementSelect,
  onContentChange,
}: CanvasStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementManager = ElementManagerService.getInstance();

  useEffect(() => {
    if (stageRef.current && htmlContent) {
      stageRef.current.innerHTML = htmlContent;
      elementManager.assignUniqueIds(stageRef.current);
    }
  }, [htmlContent]);

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target === stageRef.current) {
      onElementSelect(null);
      return;
    }

    const element = target.closest('[data-element-id]') as HTMLElement;
    if (element && element !== stageRef.current) {
      e.stopPropagation();
      const editableElement = elementManager.createEditableElement(element);
      onElementSelect(editableElement);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedElement || e.button !== 0) return;

    const target = e.target as HTMLElement;
    const element = target.closest('[data-element-id]') as HTMLElement;

    if (element && element.getAttribute('data-element-id') === selectedElement.id) {
      setIsDragging(true);
      const rect = element.getBoundingClientRect();
      const stageRect = stageRef.current!.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElement || !stageRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const element = stageRef.current.querySelector(
      `[data-element-id="${selectedElement.id}"]`
    ) as HTMLElement;

    if (element) {
      const newX = e.clientX - stageRect.left - dragOffset.x;
      const newY = e.clientY - stageRect.top - dragOffset.y;

      // Boundary constraints
      const maxX = 720 - element.offsetWidth;
      const maxY = 720 - element.offsetHeight;

      const constrainedX = Math.max(0, Math.min(newX, maxX));
      const constrainedY = Math.max(0, Math.min(newY, maxY));

      elementManager.updateElementPosition(element, {
        x: constrainedX,
        y: constrainedY,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (stageRef.current) {
        onContentChange(stageRef.current.innerHTML);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const element = target.closest('[data-element-id]') as HTMLElement;

    if (element && (element.tagName.match(/^(P|H[1-6]|DIV|SPAN|STRONG|EM)$/i))) {
      element.contentEditable = 'true';
      element.focus();
      e.stopPropagation();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target.contentEditable === 'true') {
      target.contentEditable = 'false';
      if (stageRef.current) {
        onContentChange(stageRef.current.innerHTML);
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 min-h-full">
      <div className="relative">
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        
        <div className="relative bg-white rounded-xl shadow-2xl p-4">
          <div
            ref={stageRef}
            className="relative bg-white overflow-hidden cursor-default rounded-lg"
            style={{
              width: '720px',
              height: '720px',
            }}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
          />
          
          <div className="absolute -top-2 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-full shadow-md">
            720 x 720 Canvas
          </div>
        </div>
        
        {selectedElement && stageRef.current && (
          <SelectionOverlay
            element={selectedElement}
            stageRef={stageRef.current}
          />
        )}
      </div>
    </div>
  );
}

interface SelectionOverlayProps {
  element: EditableElement;
  stageRef: HTMLElement;
}

function SelectionOverlay({ element, stageRef }: SelectionOverlayProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const el = stageRef.querySelector(
        `[data-element-id="${element.id}"]`
      ) as HTMLElement;
      if (el) {
        const elementRect = el.getBoundingClientRect();
        const stageRect = stageRef.getBoundingClientRect();
        
        const relativeRect = new DOMRect(
          elementRect.left - stageRect.left,
          elementRect.top - stageRect.top,
          elementRect.width,
          elementRect.height
        );
        setRect(relativeRect);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 100);
    return () => clearInterval(interval);
  }, [element, stageRef]);

  if (!rect) return null;

  return (
    <div
      className="absolute pointer-events-none border-2 border-blue-500 rounded transition-all duration-200"
      style={{
        left: `${rect.left + 16}px`,
        top: `${rect.top + 16}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.3)',
      }}
    >
      <div className="absolute -top-8 left-0 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
        {element.element.tagName.toLowerCase()}
      </div>
      
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
    </div>
  );
}
