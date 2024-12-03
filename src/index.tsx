import {Readability} from '@mozilla/readability';
import * as React from '@turtlemay/jsx-dom'

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
        layout.isApplicable(groupedElements)
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
    const group = groupedElements[groupedElements.length - 1];
    const groupWithCurrentElement = [...group, element];
    if (
      groupWithCurrentElement.length > MAX_ELEMENTS
      || sum(groupWithCurrentElement.map(el => el.textContent?.length ?? 0)) > MAX_LETTERS
    ) {
      // Start a new group
      groupedElements.push([element]);
    } else {
      // Add to the existing group
      group.push(element);
    }
  }
  return groupedElements;
}

function sum(array: number[]) {
  return array.reduce((partialSum, value) => partialSum + value, 0);
}

type Layout = {
  isApplicable: (nodes: Node[]) => boolean
  apply: (nodes: Node[]) => Node
}

const LAYOUTS: Layout[] = [
  {
    isApplicable: nodes => nodes.length === 2,
    apply: nodes =>
      <div class="slide bg-violet-500 justify-between px-3">
        <div class="bg-white px-4 py-6 rounded-xl">
          {nodes[0]}
        </div>
        <div class="bg-white px-4 py-6 rounded-xl">
          {nodes[1]}
        </div>
      </div>,
  },
  {
    isApplicable: nodes => nodes.length === 2,
    apply: nodes =>
      <div class="slide bg-blue-500 px-2 gap-y-0">
        <div class="bg-white mr-6 px-4 py-6 rounded-xl rounded-br-none">
          {nodes[0]}
        </div>
        <div class="bg-white ml-6 px-4 py-6 rounded-xl rounded-tl-none -mt-6">
          {nodes[1]}
        </div>
      </div>,
  },
  {
    isApplicable: nodes => nodes.length === 1,
    apply: nodes =>
      <div class="slide bg-fuchsia-700 text-2xl text-white px-4 leading-8">
        {nodes}
      </div>
  },
  {
    isApplicable: () => true,
    apply: nodes =>
      <div class="slide px-4">
        {nodes}
      </div>,
  },
];

