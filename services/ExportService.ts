import { HtmlSanitizerService } from './HtmlSanitizerService';

export class ExportService {
  private static instance: ExportService;
  private sanitizer: HtmlSanitizerService;

  private constructor() {
    this.sanitizer = HtmlSanitizerService.getInstance();
  }

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  public exportAsHtml(container: HTMLElement, styles: string): string {
    const bodyContent = container.innerHTML;
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta data-generated-by="editable-html-poster" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Editable Poster</title>
  <style>
${styles}
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;

    return fullHtml;
  }

  public downloadHtml(html: string, filename: string = 'poster.html'): void {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
