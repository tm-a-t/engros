import {Readability} from '@mozilla/readability';

export default function build(html: string): Node {
  const document = Document.parseHTMLUnsafe(html);
  const readability = new Readability(
    document,
    {serializer: el => el}
  ).parse();
  const readabilityResult = readability!.content;
  const rawContent = readabilityResult.firstChild?.firstChild!;
  const rawElements = [...rawContent.childNodes].filter(node => node.nodeType !== Node.TEXT_NODE)

  const container = document.createElement('div');
  container.classList.add('container');
  const slides = [...Array(Math.ceil(rawElements.length / 3))]
    .map((_,i) => rawElements.slice(i * 3, (i + 1) * 3))
    .map(elements => {
      const slide = document.createElement('div');
      slide.classList.add('slide');
      slide.replaceChildren(...elements);
      return slide;
    });
  container.append(...slides);
  return container;
}
