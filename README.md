# Editable HTML Poster

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

A modern web application for importing, editing, and exporting HTML posters with a visual drag-and-drop editor. Built with Next.js 14, TypeScript, and Tailwind CSS following SOLID design principles.

## 🎯 Overview

This application enables users to:
- Import HTML files and edit them visually on a 720×720 canvas
- Add, modify, and delete text and image elements
- Export edited posters as standalone HTML files
- Maintain full control over styling and positioning

Perfect for creating promotional posters, social media graphics, and marketing materials.

## ✨ Features

### Core Functionality
- ✅ **HTML Import**: Upload `.html` files or paste raw HTML content
- ✅ **720×720 Canvas**: Fixed-size editing stage with boundary constraints
- ✅ **Element Selection**: Click to select elements with visual highlighting
- ✅ **Drag & Drop**: Reposition elements anywhere within the canvas
- ✅ **Text Editing**: Double-click text or use properties panel to edit content
- ✅ **Image Replacement**: Upload new images or update via URL
- ✅ **Element Management**: Add new text blocks and images dynamically
- ✅ **Delete Elements**: Remove selected elements with Delete key or toolbar button
- ✅ **Export HTML**: Download edited poster as a complete HTML file
- ✅ **Undo/Redo**: Full history management with Ctrl+Z/Ctrl+Y shortcuts
- ✅ **Keyboard Shortcuts**: Delete, Undo (Ctrl+Z), Redo (Ctrl+Y/Ctrl+Shift+Z)

### User Interface
- 🎨 **Modern Toolbar**: Import, add elements, undo/redo, delete, and export actions
- 🖼️ **Canvas Stage**: 720×720 pixel editable area with animated selection overlay
- ⚙️ **Properties Panel**: Context-sensitive editor for selected elements
- 📊 **Status Bar**: Real-time display of selected element info and canvas dimensions

### Security
- 🔒 **HTML Sanitization**: All input sanitized with DOMPurify to prevent XSS attacks
- ✅ **Safe HTML Only**: Only whitelisted tags and attributes are allowed
- 🛡️ **Data Preservation**: Custom data attributes preserved for functionality

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Aaryan-Sharma-5/editable-html-poster.git
cd editable-html-poster
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will load with a sample poster

## Project Structure

```
editable-html-poster/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── Toolbar.tsx         # Top toolbar with actions
│   ├── CanvasStage.tsx     # 720×720 editable canvas
│   └── PropertiesPanel.tsx # Element properties editor
├── services/               # Business logic (SOLID principles)
│   ├── HtmlSanitizerService.ts    # HTML sanitization
│   ├── HtmlParserService.ts       # HTML parsing
│   ├── ElementManagerService.ts   # DOM element operations
│   └── ExportService.ts           # HTML export & download
├── hooks/
│   └── useEditorState.ts   # Editor state management
├── types/
│   └── editor.types.ts     # TypeScript interfaces
└── package.json
```

## Architecture & SOLID Design

### Single Responsibility Principle (SRP)
Each service class has a single, well-defined purpose:
- `HtmlSanitizerService`: Sanitizes HTML to prevent XSS attacks
- `HtmlParserService`: Parses and extracts HTML content
- `ElementManagerService`: Manages DOM element operations
- `ExportService`: Handles HTML export and file download

### Open/Closed Principle (OCP)
Services are open for extension but closed for modification:
- Services use singleton pattern with getInstance()
- New element types can be added without modifying existing code
- Parser and sanitizer can be extended with new rules

### Liskov Substitution Principle (LSP)
Components accept interfaces rather than concrete implementations:
- `EditableElement` interface abstracts element details
- Services can be swapped with compatible implementations

### Interface Segregation Principle (ISP)
Focused interfaces for specific needs:
- `ImageProperties` for image-specific attributes
- `TextProperties` for text-specific attributes
- `Position` and `Size` for geometric data

### Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:
- Components use service interfaces
- Services are injected via getInstance() pattern
- React hooks encapsulate state management logic

## Key Technical Decisions

### 1. Service Layer Architecture
All business logic is encapsulated in service classes, separating concerns from React components. This makes the code:
- More testable
- Easier to maintain
- Reusable across components

### 2. Client-Side Rendering
Using Next.js App Router with client-side components ('use client') for:
- DOM manipulation requirements
- Interactive editing features
- Browser-specific APIs (FileReader, DOMParser)

### 3. Minimal Dependencies
Only essential libraries used:
- `isomorphic-dompurify`: HTML sanitization (security)
- `lucide-react`: Consistent icon set
- No heavy page builders or WYSIWYG editors

### 4. State Management
Custom React hooks for state management:
- `useEditorState`: Manages selection, history, and zoom
- Avoids unnecessary Redux/MobX complexity
- Keeps state co-located with usage

### 5. Element Identification
Using `data-element-id` attributes:
- Unique identification across re-renders
- Enables precise element selection and manipulation
- Maintains references through HTML serialization

## 📖 Usage Guide

### Importing HTML

**Method 1: Upload File**
1. Click "Upload HTML" button in toolbar
2. Select a `.html` file from your computer
3. Content will be parsed and rendered in canvas

**Method 2: Paste HTML**
1. Click "Paste HTML" button
2. Paste your HTML code in the modal text area
3. Click "Import" button

### Editing Elements

- **Select**: Click on any element in the canvas
- **Move**: Click and drag selected element to reposition
- **Edit Text**: Double-click text element or use Properties Panel
- **Edit Image**: Select image and use Properties Panel to change src, alt, width, or height
- **Delete**: Select element and press Delete key or click trash icon in toolbar

### Adding Elements

- Click **"Add Text"** button to add a new text block
- Click **"Add Image"** button to add a new image placeholder
- New elements appear at position (50, 50) and can be dragged anywhere

### Exporting

1. Click **"Export HTML"** button in toolbar
2. A `.html` file will be downloaded to your computer
3. The exported file includes metadata tag: `<meta data-generated-by="editable-html-poster" />`

## 🔒 Security

- **HTML Sanitization**: All HTML input is sanitized using DOMPurify
- **XSS Prevention**: Malicious scripts are automatically removed
- **Safe Tags Only**: Only whitelisted HTML tags and attributes are allowed
- **Data Preservation**: Custom `data-*` attributes are preserved for functionality

## ⚠️ Known Limitations

1. **Complex CSS**: External stylesheets are not fully supported; styles must be inline or in `<style>` tags within the HTML
2. **Nested Elements**: Deep nesting may affect drag-and-drop precision and selection accuracy
3. **Responsive Design**: Canvas is fixed at 720×720px and does not support responsive layouts
4. **Browser Compatibility**: Requires modern browsers with ES6+ support (Chrome 90+, Firefox 88+, Safari 14+)
5. **Large Files**: Very large HTML files (>1MB) may impact performance during parsing and rendering

## 🚀 Potential Improvements

### Short-term Enhancements
- [ ] **Zoom & Pan**: Canvas zoom controls and pan functionality for detailed editing
- [ ] **Element Tree**: Hierarchical panel showing all elements and their nesting
- [ ] **Alignment Guides**: Snap-to-grid and smart alignment guides
- [ ] **Copy/Paste**: Duplicate elements with Ctrl+C/Ctrl+V
- [ ] **Multi-select**: Select multiple elements with Shift+Click

### Medium-term Features
- [ ] **Layer Management**: Z-index control and visual layer stacking
- [ ] **Element Grouping**: Group/ungroup elements for batch operations
- [ ] **Text Formatting**: Extended options (alignment, line-height, letter-spacing)
- [ ] **Advanced Styling**: Gradient backgrounds and shadow support
- [ ] **Template Library**: Pre-built poster templates for quick start

### Long-term Vision
- [ ] **Real-time Collaboration**: Multiple users editing simultaneously
- [ ] **Cloud Storage**: Save and load projects from cloud storage
- [ ] **Multiple Export Formats**: Export to PNG, PDF, and SVG
- [ ] **Animation Support**: Add CSS animations and transitions
- [ ] **Plugin System**: Extensible architecture for custom elements
- [ ] **Responsive Editor**: Multi-breakpoint canvas for responsive designs
