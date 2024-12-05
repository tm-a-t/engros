import {Readability} from '@mozilla/readability';
import * as React from '@turtlemay/jsx-dom';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import {buildSlides} from './build-slides';

export default function build(html: string): HTMLElement {
  const document = preprocessHeaders(
    Document.parseHTMLUnsafe(html)
  );

  const readability = new Readability(
    document,
    {serializer: el => el},
  ).parse();
  const readabilityResult = readability!.content;
  const rawContent = readabilityResult.firstChild?.firstChild!;
  const rawElements = [...rawContent.childNodes].filter(node => node.nodeType !== Node.TEXT_NODE);
  const elements = [<h1>{readability!.title}</h1>, ...rawElements] as HTMLElement[];

  const container = <div class="container">
    {buildSlides(elements)}
  </div> as HTMLElement;

  activateVanta(container);

  return container;
}

function preprocessHeaders(
  document: Document,
  mustPruneInsideHeaders: boolean = false,
  mustPruneHeaderDivs: boolean = true
): Document {
  const BROKEN_HEADER_CLASSES = ['mw-heading']

  const cleanHeaderMutatation = (header: Element): void => {

    header.removeAttribute("class");
    header.removeAttribute("id");

    // readability.js detects smth else inside <h1> ~~> pruned
    const textContent  = header.textContent;
    while (header.firstChild) {
      header.removeChild(header.firstChild);
    }

    header.textContent = textContent
  }

  const cleanDivHeaderMutation = (div: HTMLElement): void => {
    const headers = [...div.childNodes]
      .filter(node =>
        node instanceof HTMLElement &&
        node.matches("h1, h2, h3, h4, h5, h6")
      );

    div.innerHTML = '';
    headers.forEach(header => div.appendChild(header));
  }

  const modifiedDocument = document.cloneNode(true) as Document;
  if (mustPruneInsideHeaders) {
    [...modifiedDocument.querySelectorAll("h1, h2, h3, h4, h5, h6")]
      .forEach(cleanHeaderMutatation);
  }

  if (mustPruneHeaderDivs) {
    [...modifiedDocument.querySelectorAll("div")]
      .filter(div =>
        BROKEN_HEADER_CLASSES.some(className =>
          div.classList.contains(className)
        ) &&
        div.querySelector('h1, h2, h3, h4, h5, h6'))
      .forEach(cleanDivHeaderMutation);
  }

  return modifiedDocument;
}


function activateVanta(container: JSX.Element) {
  let vantaActivated = false;
  container.addEventListener('mousemove', () => {
    if (vantaActivated) return;
    vantaActivated = true;
    container.querySelectorAll('.vanta-fog').forEach((animationContainer) => {
      FOG({
        el: animationContainer as HTMLElement,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00
      });
    });
  });
}
