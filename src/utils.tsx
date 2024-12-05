export function sum(array: number[]) {
  return array.reduce((partialSum, value) => partialSum + value, 0);
}

export function last<T>(array: T[]): T {
  return array[array.length - 1];
}

export function isHeading(element: HTMLElement): boolean {
  return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.nodeName)
}

