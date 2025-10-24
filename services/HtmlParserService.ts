export class HtmlParserService {
  private static instance: HtmlParserService;

  private constructor() {}

  public static getInstance(): HtmlParserService {
    if (!HtmlParserService.instance) {
      HtmlParserService.instance = new HtmlParserService();
    }
    return HtmlParserService.instance;
  }

  public parseHtml(htmlString: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
  }

  public extractBodyContent(doc: Document): string {
    const body = doc.body;
    return body ? body.innerHTML : '';
  }

  public extractStyles(doc: Document): string {
    const styles: string[] = [];
    
    const styleElements = doc.querySelectorAll('style');
    styleElements.forEach(style => {
      styles.push(style.textContent || '');
    });

    return styles.join('\n');
  }

  public serializeElement(element: HTMLElement): string {
    return element.outerHTML;
  }

  public getElementById(container: HTMLElement, id: string): HTMLElement | null {
    return container.querySelector(`[data-element-id="${id}"]`);
  }
}
