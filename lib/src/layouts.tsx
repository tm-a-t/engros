import * as React from '@turtlemay/jsx-dom';

export type Layout = {
  isApplicable: (nodes: HTMLElement[]) => boolean
  apply: (nodes: HTMLElement[]) => JSX.Element
}

export const LAYOUTS: Layout[] = [
  {
    isApplicable: nodes => nodes.length === 2 && (nodes[0].textContent?.length ?? 0) + (nodes[1].textContent?.length ?? 0) < 512,
    apply: nodes =>
      <div class="engros-slide px-3 gap-y-4">
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
      <div class="engros-slide px-2 gap-y-0">
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
      <div class="engros-slide text-2xl leading-8">
        <div class="bg-white px-4 py-6 mr-4 rounded-r-xl">
          {nodes}
        </div>
      </div>,
  },
  {
    isApplicable: () => true,
    apply: nodes =>
      <div class="engros-slide">
        <div class="bg-white px-4 py-7 mx-2 rounded-xl flex flex-col gap-4">
          {nodes}
        </div>
      </div>,
  },
];
