import {Readability} from '@mozilla/readability';
import Hydra from 'hydra-synth';
import * as React from '@turtlemay/jsx-dom';

export default function build(html: string): Node {
  const document = Document.parseHTMLUnsafe(html);

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

function addHydra(container: DocumentFragment) {
  let hydraActivated = false;
  container.addEventListener('mousemove', () => {
    if (hydraActivated) return;
    hydraActivated = true;
    container.querySelectorAll('.hydra-canvas').forEach((animationContainer, i) => {
      const h = new Hydra({
        canvas: animationContainer,
        makeGlobal: false,
        detectAudio: false,
      }).synth;
      if (i % 2 == 0) {
        h.osc(18, 0.1, 0).color(2, 0.1, 2)
          .mult(h.osc(20, 0.01, 0)).repeat(2, 20).rotate(0.5).modulate(h.o1)
          .scale(1, () => (h.a.fft[0] * 0.9 + 2)).diff(h.o1).out(h.o0);
        h.osc(20, 0.2, 0).color(2, 0.7, 0.1).mult(h.osc(40)).modulateRotate(h.o0, 0.2)
          .rotate(0.2).out(h.o1);
      }
      else {
        h.osc(100,-0.0018,0.17).diff(h.osc(20,0.00008).rotate(Math.PI/0.00003))
          .modulateScale(h.noise(1.5,0.18).modulateScale(h.osc(13).rotate(()=>Math.sin(h.time/22))),3)
          .color(11,0.5,0.4, 0.9, 0.2, 0.011, 5, 22,  0.5, -1).contrast(1.4)
          .add(h.src(h.o0).modulate(h.o0,.04),.6, .9)
          //.pixelate(0.4, 0.2, 0.1)
          .invert().brightness(0.0003, 2).contrast( 0.5, 2, 0.1, 2).color(4, -2, 0.1)
          .modulateScale(h.osc(2),-0.2, 2, 1, 0.3)
          .posterize(200) .rotate(1, 0.2, 0.01, 0.001)
          .color(22, -2, 0.5, 0.5, 0.0001,  0.1, 0.2, 8).contrast(0.18, 0.3, 0.1, 0.2, 0.03, 1) . brightness(0.0001, -1, 10)
          .out()
      }
    });
  });
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
      <div class="slide px-3 bg-rose-500 gap-y-4">
        <canvas class="hydra-canvas"></canvas>
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
      <div class="slide px-2 gap-y-0 bg-blue-500">
        <canvas class="hydra-canvas"></canvas>
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

