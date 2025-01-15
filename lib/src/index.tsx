import {Readability} from '@mozilla/readability';
import * as React from '@turtlemay/jsx-dom';
import {buildSlides} from './build-slides';
import './style/style.css';

export default function engros(html: string, referenceLink: string, proxyLink: string): HTMLElement | null {
  const document = preprocessHeaders(
    Document.parseHTMLUnsafe(html),
  );

  if (!document.querySelector('base')) {
    document.head.insertBefore(<base href={referenceLink}/>, document.head.firstChild);
  }

  const readability = new Readability(
    document,
    {serializer: el => el},
  ).parse();
  if (readability === null) {
    return null;
  }

  const readabilityResult = readability.content;

  let rawElementsUnfiltered: ChildNode[] = [];

  if (readabilityResult.firstChild?.firstChild?.childNodes.length == 1) {
    let temporary_storage: ChildNode[] = [];
    const allReadabilityChildNodes = readabilityResult.firstChild!.childNodes;

    for (const node of allReadabilityChildNodes) {
      if (node.childNodes.length > 1) {
        rawElementsUnfiltered = temporary_storage.concat([...node.childNodes]);
        break;
      } 
      temporary_storage.push(node);
    }
    
  } else {
    const node = readabilityResult.firstChild?.firstChild!;
    rawElementsUnfiltered = [...node.childNodes]
  }

  const rawElements = rawElementsUnfiltered.filter(node => node instanceof HTMLElement);

  if (rawElements.length == 0) {

  }
  
  const elements = [<h1>{readability.title}</h1> as HTMLElement, ...rawElements];
  // Parsing Wikibooks titles
  if (readability.title.includes("Wikibooks, open")) {
    var title = readability.title.split(" - ")[0];
    title = title.split("/", 2).join("/ ");

    elements[0] = <h1>{title}</h1> as HTMLElement;
  }

  postprocessAnchorLinks(elements, referenceLink);
  if (proxyLink) {
    postprocessRemainingLinks(elements, proxyLink);
  }

  removeUnnecessaryDivs(elements);

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

  const cleanHeaderMutation = (header: Element): void => {

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
      .forEach(cleanHeaderMutation);
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

function removeUnnecessaryDivs(elements: HTMLElement[]) {
  // Remove divs that have text leaves

  const newElements: HTMLElement[] = elements
    .map(element => {
      if (element.tagName !== 'DIV') return [element];

      for (let node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length) {
          return [element];
        }
      }

      return [...element.children] as HTMLElement[];
    })
    .flat()
  ;

  console.log(newElements)

  elements.splice(0, elements.length, ...newElements);
}
