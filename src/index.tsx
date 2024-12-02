import {Readability} from '@mozilla/readability';
import {h} from 'tsx-dom';

export default function build(html: string): Node {
  const document = Document.parseHTMLUnsafe(html);

  document.querySelectorAll('h2').forEach(h2 => {
    const p = document.createElement('p');
    for (const {name, value} of h2.attributes) {
      p.setAttribute(name, value);
    }
    p.classList.add('layout-h2');
    p.innerHTML = h2.innerHTML;
    h2.replaceWith(p);
  });

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

  // const slides = groupedElements
  //   .map(elements => {
  //     const slide = document.createElement('div');
  //     slide.classList.add('slide');
  //     slide.replaceChildren(...elements);
  //     return slide;
  //   });
  // container.append(...slides);

  return container;
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
      <div class="slide bg-blue-500 px-2 gap-y-3">
        <div class="bg-white mr-4 px-6 py-5 rounded-xl">
          {nodes[0]}
        </div>
        <div class="bg-white ml-4 px-6 py-5 rounded-xl">
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

