export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'div' | 'other';
  element: HTMLElement;
  position: Position;
  size: Size;
}

export interface ImageProperties {
  src: string;
  alt: string;
  width: string;
  height: string;
}

export interface TextProperties {
  content: string;
  fontSize: string;
  color: string;
  fontWeight: string;
}

export interface HistoryState {
  html: string;
  timestamp: number;
}

export type EditorMode = 'select' | 'text-edit' | 'drag';

export interface EditorState {
  selectedElement: EditableElement | null;
  mode: EditorMode;
  history: HistoryState[];
  historyIndex: number;
  zoom: number;
}
