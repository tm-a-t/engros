import {Readability} from '@mozilla/readability';
import * as React from '@turtlemay/jsx-dom';
import {buildSlides} from './build-slides';
import './style/style.css';

export default function engros(html: string, referenceLink: string, proxyLink: string): HTMLElement {
  const document = preprocessHeaders(
    Document.parseHTMLUnsafe(html),
  );

  // Temporary fix, delete later
  if (!document.querySelector('base')) {
    document.head.insertBefore(<base
      href={referenceLink}/>, document.head.firstChild);
  }

  const readability = new Readability(
    document,
    {serializer: el => el},
  ).parse();
  const readabilityResult = readability!.content;
  const rawContent = readabilityResult.firstChild?.firstChild!;
  const rawElements = [...rawContent.childNodes].filter(node => node instanceof HTMLElement);
  const elements = [<h1>{readability!.title}</h1> as HTMLElement, ...rawElements];

  // Temporary fix, delete later
  if (readability!.title.includes("Wikibooks, open")) {
    var title = readability!.title.split(" - ")[0];
    title = title.split("/", 2).join("/ ");

    elements[0] = <h1>{title}</h1> as HTMLElement;
  }

  postprocessAnchorLinks(elements, referenceLink);
  if (proxyLink) {
    postprocessRemainingLinks(elements, proxyLink);
  }

  return <div class="container">
    {buildSlides(elements)}
  </div> as HTMLElement;
}

function postprocessAnchorLinks(elements: HTMLElement[], referenceLink: string) {
  elements.forEach(readabilityOutputElement => {
    readabilityOutputElement.querySelectorAll('[href]').forEach(elementWithLink => {
      const href = elementWithLink.getAttribute('href');
      if (href && (
        href.startsWith(`${referenceLink}#`) || 
        href.startsWith(referenceLink.replace('http:', 'https:') + '#') ||
        href.startsWith(referenceLink.replace('https:', 'http:') + '#')
      )) {
        elementWithLink.setAttribute('href', href.replace(/^.*?#/, '#'));
      }
    })
  })
}

function postprocessRemainingLinks(elements: HTMLElement[], proxyLink: string) {
  elements.forEach(readabilityOutputElement => {
    readabilityOutputElement.querySelectorAll('[href]').forEach(elementWithLink => {
      const href = elementWithLink.getAttribute('href');
      if (href && (href.startsWith("https:") || href.startsWith("http:"))) {
        elementWithLink.setAttribute('href', makeProxyLink(href, proxyLink));
      }
    })
  })
}

function makeProxyLink(href: string, proxyLink: string): string {
  return `${proxyLink}${href}`;
}

function preprocessHeaders(
  document: Document,
  mustPruneInsideHeaders: boolean = false,
  mustPruneHeaderDivs: boolean = true,
): Document {
  const BROKEN_HEADER_CLASSES = ['mw-heading'];

  const cleanHeaderMutatation = (header: Element): void => {

    header.removeAttribute("class");
    header.removeAttribute("id");

    // readability.js detects smth else inside <h1> ~~> pruned
    const textContent = header.textContent;
    while (header.firstChild) {
      header.removeChild(header.firstChild);
    }

    header.textContent = textContent;
  };

  const cleanDivHeaderMutation = (div: Element): void => {
    const headers = [...div.childNodes]
      .filter(node =>
        node instanceof Element &&
        node.matches("h1, h2, h3, h4, h5, h6"),
      );


    div.innerHTML = '';
    headers.forEach(header => div.appendChild(header));

    const parent = div.parentNode;
    if (!parent) return;

    headers.forEach(header => parent.insertBefore(header, div));

    parent.removeChild(div);
  };

  const modifiedDocument = document.cloneNode(true) as Document;
  if (mustPruneInsideHeaders) {
    [...modifiedDocument.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .forEach(cleanHeaderMutatation);
  }

  if (mustPruneHeaderDivs) {
    [...modifiedDocument.querySelectorAll("div")]
      .filter(div =>
        BROKEN_HEADER_CLASSES.some(className =>
          div.classList.contains(className),
        ) &&
        div.querySelector('h1, h2, h3, h4, h5, h6'))
      .forEach(cleanDivHeaderMutation);
  }

  return modifiedDocument;
}
