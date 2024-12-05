import {Readability} from '@mozilla/readability';
import * as React from '@turtlemay/jsx-dom';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import {buildSlides} from './build-slides';
import { chooseColorFromHueRanges } from './utils';

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

  // Temporary fix
  if (readability!.title.includes("Wikibooks, open")) {
    var title = readability!.title.split(" - ")[0];
    title = title.split("/", 2).join("/ ");

    elements[0] = <h1>{title}</h1> as HTMLElement;
  }

  return <div class="container">
    {buildSlides(elements)}
  </div> as HTMLElement;
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

  const cleanDivHeaderMutation = (div: Element): void => {
    const headers = [...div.childNodes]
      .filter(node =>
        node instanceof Element &&
        node.matches("h1, h2, h3, h4, h5, h6")
      );

    
    div.innerHTML = '';
    headers.forEach(header => div.appendChild(header));

    const parent = div.parentNode;
    if (!parent) return;

    headers.forEach(header => parent.insertBefore(header, div));
    
    parent.removeChild(div);
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

    const lowlightColorRanges = [[0, 251]];
    const lowlightBase = [100, 50];

    const midtoneColorRanges = [[7, 55]];
    const midtoneColorBase = [100, 50];
    
    const highlightColorRanges = [[0, 50], [246, 342]];
    const highlightColoBase = [100, 50];

    container.querySelectorAll('.vanta-fog').forEach((animationContainer) => {
      FOG({
        el: animationContainer as HTMLElement,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        lowlightColor: chooseColorFromHueRanges(lowlightColorRanges, lowlightBase[0], lowlightBase[1]),
        midtoneColor: chooseColorFromHueRanges(midtoneColorRanges, midtoneColorBase[0], midtoneColorBase[1]),
        highlightColor: chooseColorFromHueRanges(highlightColorRanges, highlightColoBase[0], highlightColoBase[1])
      });
    });
  });
}
