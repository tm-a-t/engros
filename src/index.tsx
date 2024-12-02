import {Readability} from '@mozilla/readability';
import {h} from 'tsx-dom';

export default function build(html: string): Node {
  const document = Document.parseHTMLUnsafe(html);

  document.querySelectorAll('h2').forEach(h2 => {
    const p = document.createElement('p');
    for (const { name, value } of h2.attributes) {
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

  const groupedElements = groupElements([<h1>{readability!.title}</h1>, ...rawElements]);
  console.log(groupedElements);

  const container = <div class="container">
    {groupedElements
      .map(elements => <div class="slide">{elements}</div>)}
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
