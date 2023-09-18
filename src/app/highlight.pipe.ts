import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) { }

    transform(text: string, search: string): SafeHtml {
      if (!text || !search) { return text; }
  
      const pattern = new RegExp(`(${search})`, 'gi'); 
      const highlighted = text.replace(pattern, `<span style='background-color:yellow'>$1</span>`);
  
      return this._sanitizer.bypassSecurityTrustHtml(highlighted);
    }
}
