import {Readability} from '@mozilla/readability';
import * as React from '@turtlemay/jsx-dom';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

export default function build(html: string): Node {
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
  const elements = [<h1>{readability!.title}</h1>, ...rawElements];

  const container = <div class="container">
    {buildSlides(elements)}
  </div>;

  activateVanta(container);

  return container;
}

function activateVanta(container: JSX.Element) {
  let vantaActivated = false;
  container.addEventListener('mousemove', () => {
    if (vantaActivated) return;
    vantaActivated = true;
    container.querySelectorAll('.vanta-fog').forEach((animationContainer, i) => {
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


function buildSlides(elements: Node[]): Node[] {
  const groups = groupElements(elements);

  const usedLayouts: Layout[] = [];
  const slides = [];

  for (const groupedElements of groups) {
    const layout = LAYOUTS.find(layout =>
        layout.isApplicable(groupedElements) && layout !== usedLayouts[usedLayouts.length - 1],
      )
      || LAYOUTS.find(layout =>
        layout.isApplicable(groupedElements),
      )!;

    usedLayouts.push(layout);
    slides.push(layout.apply(groupedElements));
  }

  return slides;
}

function groupElements(elements: Node[]): Node[][] {
  const MAX_ELEMENTS = 4;
  const MAX_LETTERS = 1024;

  const groupedElements: Node[][] = [[]];
  for (const element of elements) {
    const lastGroup = groupedElements[groupedElements.length - 1];
    const groupWithCurrentElement = [...lastGroup, element];
    if (
      isHeading(element)
      || groupWithCurrentElement.length > MAX_ELEMENTS
      || sum(groupWithCurrentElement.map(el => el.textContent?.length ?? 0)) > MAX_LETTERS
    ) {
      // Start a new group
      const newGroup = [];

      const lastGroupCurryElements = [];
      while (lastGroup.length && (
        last(lastGroup).textContent?.endsWith(':')
        || isHeading(last(lastGroup)))
      ) {
        lastGroupCurryElements.push(last(lastGroup));
        lastGroup.pop();
      }
      if (lastGroup.length === 0) {
        // Remove lastGroup
        groupedElements.pop();
      }
      newGroup.push(...lastGroupCurryElements.reverse());

      newGroup.push(element);
      groupedElements.push(newGroup);
    } else {
      // Add to the existing group
      lastGroup.push(element);
    }
  }
  return groupedElements;
}

function sum(array: number[]) {
  return array.reduce((partialSum, value) => partialSum + value, 0);
}

function last<T>(array: T[]): T {
  return array[array.length - 1];
}

function isHeading(element: Node): boolean {
  return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.nodeName)
}

type Layout = {
  isApplicable: (nodes: Node[]) => boolean
  apply: (nodes: Node[]) => Node
}

const LAYOUTS: Layout[] = [
  {
    isApplicable: nodes => nodes.length === 2 && (nodes[0].textContent?.length ?? 0) + (nodes[1].textContent?.length ?? 0) < 512,
    apply: nodes =>
      <div class="slide vanta-fog px-3 bg-rose-500 gap-y-4">
        <div class="bg-white px-4 py-6 ml-2 rounded-xl rotate-1">
          {nodes[0]}
        </div>
        <div class="bg-white px-4 py-6 mr-2 rounded-xl -rotate-2">
          {nodes[1]}
        </div>
      </div>,
  },
  {
    isApplicable: nodes => nodes.length === 2,
    apply: nodes =>
      <div class="slide vanta-fog px-2 gap-y-0">
        <div class="bg-white mr-6 px-4 py-6 rounded-xl rounded-br-none">
          {nodes[0]}
        </div>
        <div class="bg-white ml-6 px-4 py-6 rounded-xl rounded-tl-none -mt-6">
          {nodes[1]}
        </div>
      </div>,
  },
  {
    isApplicable: nodes => nodes.length === 1 && (nodes[0].textContent?.length ?? 0) < 512,
    apply: nodes =>
      <div class="slide bg-violet-500 text-2xl leading-8">
        <div class="bg-white px-4 py-6">
          {nodes}
        </div>
      </div>,
  },
  {
    isApplicable: () => true,
    apply: nodes =>
      <div class="slide px-4">
        {nodes}
      </div>,
  },
];

