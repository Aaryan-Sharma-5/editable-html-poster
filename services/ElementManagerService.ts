import { EditableElement, Position, Size } from '@/types/editor.types';

export class ElementManagerService {
  private static instance: ElementManagerService;
  private idCounter = 0;

  private constructor() {}

  public static getInstance(): ElementManagerService {
    if (!ElementManagerService.instance) {
      ElementManagerService.instance = new ElementManagerService();
    }
    return ElementManagerService.instance;
  }

  public assignUniqueIds(container: HTMLElement): void {
    const elements = container.querySelectorAll('*');
    elements.forEach((el) => {
      if (el instanceof HTMLElement && !el.hasAttribute('data-element-id')) {
        el.setAttribute('data-element-id', `element-${this.idCounter++}`);
      }
    });
  }

  public createEditableElement(element: HTMLElement): EditableElement {
    const id = element.getAttribute('data-element-id') || `element-${this.idCounter++}`;
    if (!element.hasAttribute('data-element-id')) {
      element.setAttribute('data-element-id', id);
    }

    const rect = element.getBoundingClientRect();
    const parent = element.offsetParent as HTMLElement;
    
    return {
      id,
      type: this.getElementType(element),
      element,
      position: {
        x: element.offsetLeft,
        y: element.offsetTop,
      },
      size: {
        width: rect.width,
        height: rect.height,
      },
    };
  }

  private getElementType(element: HTMLElement): 'text' | 'image' | 'div' | 'other' {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'img') return 'image';
    if (tagName === 'div') return 'div';
    if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'strong', 'em', 'a'].includes(tagName)) {
      return 'text';
    }
    return 'other';
  }

  public updateElementPosition(element: HTMLElement, position: Position): void {
    element.style.position = 'absolute';
    element.style.left = `${position.x}px`;
    element.style.top = `${position.y}px`;
  }

  public deleteElement(element: HTMLElement): void {
    element.remove();
  }

  public createTextElement(content: string = 'New Text'): HTMLElement {
    const p = document.createElement('p');
    p.textContent = content;
    p.style.position = 'absolute';
    p.style.left = '50px';
    p.style.top = '50px';
    p.style.fontSize = '16px';
    p.style.color = '#000000';
    p.setAttribute('data-element-id', `element-${this.idCounter++}`);
    return p;
  }

  public createImageElement(src: string = 'https://via.placeholder.com/150'): HTMLElement {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'New Image';
    img.style.position = 'absolute';
    img.style.left = '50px';
    img.style.top = '50px';
    img.style.width = '150px';
    img.style.height = '150px';
    img.setAttribute('data-element-id', `element-${this.idCounter++}`);
    return img;
  }
}
