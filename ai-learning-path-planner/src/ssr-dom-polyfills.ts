import '@angular/platform-server';

/**
 * Angular SSR uses Domino, which leaves Element.innerHTML unset on SVG nodes.
 * @poluru-labs/enterprise-design-system-angular icons bind [innerHTML] on <svg>.
 */
export function patchSvgInnerHtmlForDomino(): void {
  const svgProto = globalThis.SVGElement?.prototype as
    | (SVGElement & {
        __edsSvgInnerHtmlPatched?: boolean;
        serialize?: () => string;
      })
    | undefined;
  if (!svgProto || svgProto.__edsSvgInnerHtmlPatched) {
    return;
  }

  type MozHtmlParser = {
    parse: (html: string, asFragment: boolean) => void;
    _asDocumentFragment: () => DocumentFragment;
  };

  type DominoDocument = Document & {
    _address: string;
    implementation: {
      mozHTMLParser: (address: string, element: Element) => MozHtmlParser;
    };
  };

  Object.defineProperty(svgProto, 'innerHTML', {
    configurable: true,
    enumerable: false,
    get() {
      return this.serialize?.() ?? '';
    },
    set(value: string) {
      const doc = this.ownerDocument as DominoDocument;
      const parser = doc.implementation.mozHTMLParser(doc._address, this);
      parser.parse(value == null ? '' : String(value), true);

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this.appendChild(parser._asDocumentFragment());
    },
  });

  svgProto.__edsSvgInnerHtmlPatched = true;
}

patchSvgInnerHtmlForDomino();
