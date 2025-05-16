import * as colorconvert from 'color-convert';

export function sum(array: number[]) {
    return array.reduce((partialSum, value) => partialSum + value, 0);
}

export function last<T>(array: T[]): T {
    return array[array.length - 1];
}

export function isHeading(element: HTMLElement): boolean {
    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.nodeName)
}

export function isH1(element: HTMLElement): boolean {
    return element.nodeName === 'H1';
}

export function isP(element: HTMLElement): boolean {
    return element.nodeName === 'P';
}

export function chooseColorFromHueRanges(ranges: number[][], saturation: number, lightness: number): string {
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    const [min, max] = range[0] > range[1] ? [range[1], range[0]] : [range[0], range[1]];
    const choice = Math.floor(Math.random() * (max - min + 1)) + min;

    const rgb_color = colorconvert.hsl.rgb([choice, saturation, lightness]);
    return `#${colorconvert.rgb.hex(rgb_color)}`;
}

export function textLength(elements: HTMLElement[]): number {
    const lengths = elements.map(element => element.textContent?.length ?? 0);
    return sum(lengths);
}
