"use client";

import { useState, useEffect, useCallback } from "react";
import Toolbar from "@/components/Toolbar";
import CanvasStage from "@/components/CanvasStage";
import PropertiesPanel from "@/components/PropertiesPanel";
import { useEditorState } from "@/hooks/useEditorState";
import { HtmlSanitizerService } from "@/services/HtmlSanitizerService";
import { HtmlParserService } from "@/services/HtmlParserService";
import { ElementManagerService } from "@/services/ElementManagerService";
import { ExportService } from "@/services/ExportService";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [styles, setStyles] = useState("");
  const {
    selectedElement,
    setSelectedElement,
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useEditorState();

  const sanitizer = HtmlSanitizerService.getInstance();
  const parser = HtmlParserService.getInstance();
  const elementManager = ElementManagerService.getInstance();
  const exportService = ExportService.getInstance();

  // Load default example on mount
  useEffect(() => {
    const defaultHtml = `<div class="poster">
    <h1 class="title">Summer Sale</h1>
    <p class="subtitle">Up to <strong>50% off</strong> on select items!</p>
    <img class="hero" src="https://img.freepik.com/free-photo/wet-sphere-reflective-water-abstract-beauty-generated-by-ai_188544-19616.jpg?semt=ais_hybrid&w=740&q=80" alt="Model" />
    </div>`;

    const defaultStyles = `body { margin: 0; padding: 0; }
    .poster {
      width: 720px; 
      height: 720px; 
      position: relative;
      background: #f3f4f6; 
      overflow: hidden; 
      font-family: sans-serif;
    }
    .title {
      position: absolute; 
      top: 80px; 
      left: 40px;
      font-size: 48px; 
      font-weight: bold; 
      color: #111827;
    }
    .subtitle {
      position: absolute; 
      top: 160px; 
      left: 40px;
      font-size: 20px; 
      color: #374151;
    }
    .hero {
      position: absolute; 
      bottom: 0; 
      right: 0; 
      width: 380px; 
      height: 380px;
      object-fit: cover; 
      border-top-left-radius: 16px;
    }`;

    setHtmlContent(defaultHtml);
    setStyles(defaultStyles);
    saveToHistory(defaultHtml);
  }, []);

  const handleImportFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const sanitized = sanitizer.sanitize(text);
      const doc = parser.parseHtml(sanitized);

      const bodyContent = parser.extractBodyContent(doc);
      const extractedStyles = parser.extractStyles(doc);

      setHtmlContent(bodyContent);
      setStyles(extractedStyles);
      setSelectedElement(null);
      saveToHistory(bodyContent);
    },
    [parser, sanitizer, saveToHistory, setSelectedElement]
  );

  const handleImportHtml = useCallback(
    (html: string) => {
      const sanitized = sanitizer.sanitize(html);
      const doc = parser.parseHtml(sanitized);

      const bodyContent = parser.extractBodyContent(doc);
      const extractedStyles = parser.extractStyles(doc);

      setHtmlContent(bodyContent);
      setStyles(extractedStyles);
      setSelectedElement(null);
      saveToHistory(bodyContent);
    },
    [parser, sanitizer, saveToHistory, setSelectedElement]
  );

  const handleExport = useCallback(() => {
    const fullHtml = exportService.exportAsHtml(
      (document.querySelector("[data-stage]") as HTMLElement) ||
        document.createElement("div"),
      styles
    );

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const finalHtml = exportService.exportAsHtml(tempDiv, styles);
    exportService.downloadHtml(finalHtml, "poster.html");
  }, [htmlContent, styles, exportService]);

  const handleAddText = useCallback(() => {
    const textElement = elementManager.createTextElement();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.appendChild(textElement);

    const newHtml = tempDiv.innerHTML;
    setHtmlContent(newHtml);
    saveToHistory(newHtml);
  }, [htmlContent, elementManager, saveToHistory]);

  const handleAddImage = useCallback(() => {
    const imageElement = elementManager.createImageElement();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.appendChild(imageElement);

    const newHtml = tempDiv.innerHTML;
    setHtmlContent(newHtml);
    saveToHistory(newHtml);
  }, [htmlContent, elementManager, saveToHistory]);

  const handleDelete = useCallback(() => {
    if (!selectedElement) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const element = tempDiv.querySelector(
      `[data-element-id="${selectedElement.id}"]`
    );

    if (element) {
      element.remove();
      const newHtml = tempDiv.innerHTML;
      setHtmlContent(newHtml);
      setSelectedElement(null);
      saveToHistory(newHtml);
    }
  }, [selectedElement, htmlContent, saveToHistory, setSelectedElement]);

  const handleUndo = useCallback(() => {
    const previousHtml = undo();
    if (previousHtml) {
      setHtmlContent(previousHtml);
      setSelectedElement(null);
    }
  }, [undo, setSelectedElement]);

  const handleRedo = useCallback(() => {
    const nextHtml = redo();
    if (nextHtml) {
      setHtmlContent(nextHtml);
      setSelectedElement(null);
    }
  }, [redo, setSelectedElement]);

  const handleContentChange = useCallback(
    (newHtml: string) => {
      setHtmlContent(newHtml);
      saveToHistory(newHtml);
    },
    [saveToHistory]
  );

  const handleElementUpdate = useCallback(
    (element: HTMLElement) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const targetElement = tempDiv.querySelector(
        `[data-element-id="${element.getAttribute("data-element-id")}"]`
      );

      if (targetElement) {
        targetElement.replaceWith(element.cloneNode(true));
        const newHtml = tempDiv.innerHTML;
        setHtmlContent(newHtml);
        saveToHistory(newHtml);
      }
    },
    [htmlContent, saveToHistory]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedElement) {
        handleDelete();
      } else if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.ctrlKey && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, handleDelete, handleUndo, handleRedo]);

  return (
    <div className="h-screen flex flex-col">
      <Toolbar
        onImportFile={handleImportFile}
        onImportHtml={handleImportHtml}
        onExport={handleExport}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDelete}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={selectedElement !== null}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto" data-stage>
          <CanvasStage
            htmlContent={htmlContent}
            styles={styles}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            onContentChange={handleContentChange}
          />
        </div>

        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdate={handleElementUpdate}
        />
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            {selectedElement ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    <span className="text-blue-600 font-semibold">&lt;{selectedElement.element.tagName.toLowerCase()}&gt;</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Position:</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                    X: {selectedElement.position.x.toFixed(0)}px
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded border border-gray-200">
                    Y: {selectedElement.position.y.toFixed(0)}px
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                No element selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">720 × 720 px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
