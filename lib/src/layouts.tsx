import * as React from '@turtlemay/jsx-dom';
import {isH1, isP, textLength} from "./utils";

export type Layout = {
    isApplicable: (nodes: HTMLElement[]) => boolean
    apply: (nodes: HTMLElement[]) => JSX.Element
}

export const LAYOUTS: Layout[] = [
    {
        isApplicable: nodes => nodes.length === 1 && isH1(nodes[0]),
        apply: nodes =>
            <div class="engros-slide px-3 gap-y-4">
                <div class="text-white mix-blend-difference">
                    {nodes[0]}
                </div>
            </div>,
    },
    {
        isApplicable: nodes => nodes.length === 2 && textLength(nodes) < 512,
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
        isApplicable: nodes => nodes.length === 1 && textLength(nodes) < 256,
        apply: nodes =>
            <div class="engros-slide text-2xl leading-8">
                <div class="[&>*]:inline [&>*]:bg-black [&>*]:py-1 text-white px-4">
                    {nodes}
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
        isApplicable: nodes => nodes.length === 1 && textLength(nodes) < 512,
        apply: nodes =>
            <div class="engros-slide text-2xl leading-8">
                <div class="bg-white px-4 py-6 mr-4 rounded-r-xl">
                    {nodes}
                </div>
            </div>,
    },
    {
        isApplicable: nodes => nodes.every(isP) && textLength(nodes) < 512,
        apply: nodes =>
            <div class="engros-slide text-xl leading-7">
                <div class="bg-white px-4 py-7 mx-2 rounded-xl flex flex-col gap-4">
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
