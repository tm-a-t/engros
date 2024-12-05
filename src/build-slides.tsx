import {type Layout, LAYOUTS} from './layouts';
import {isHeading, last, sum} from './utils';

export function buildSlides(elements: HTMLElement[]): JSX.Element[] {
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

function groupElements(elements: HTMLElement[]): HTMLElement[][] {
  const MAX_ELEMENTS = 4;
  const MAX_LETTERS = 1024;

  const groupedElements: HTMLElement[][] = [[]];
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
