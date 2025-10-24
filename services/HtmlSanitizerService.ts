import DOMPurify from 'isomorphic-dompurify';

export class HtmlSanitizerService {
  private static instance: HtmlSanitizerService;

  private constructor() {}

  public static getInstance(): HtmlSanitizerService {
    if (!HtmlSanitizerService.instance) {
      HtmlSanitizerService.instance = new HtmlSanitizerService();
    }
    return HtmlSanitizerService.instance;
  }

  public sanitize(html: string): string {
    return DOMPurify.sanitize(html, {
      ADD_TAGS: ['meta'],
      ADD_ATTR: ['style', 'class', 'id', 'data-element-id'],
      ALLOW_DATA_ATTR: true,
      KEEP_CONTENT: true,
    });
  }

  public addMetadata(html: string): string {
    if (!html.includes('data-generated-by="editable-html-poster"')) {
      const metaTag = '<meta data-generated-by="editable-html-poster" />';
      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>\n  ${metaTag}`);
      } else if (html.includes('<!DOCTYPE html>')) {
        html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n<head>\n  ${metaTag}\n</head>`);
      } else {
        html = `<!DOCTYPE html>\n<html>\n<head>\n  ${metaTag}\n</head>\n<body>\n${html}\n</body>\n</html>`;
      }
    }
    return html;
  }
}
