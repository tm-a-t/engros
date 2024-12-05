import {type Layout, LAYOUTS} from './layouts';
import * as THREE from 'three';
import {isHeading, last, sum} from './utils';
import {addBackground} from './animated-background';

export function buildSlides(elements: HTMLElement[]): HTMLElement[] {
  const BACKGROUND_COLOR_CLASSES = ['bg-violet-500', 'bg-blue-500', 'bg-rose-500', 'bg-amber-500'];

  const groups = groupElements(elements);

  const usedLayouts: Layout[] = [];
  const usedBackgrounds: Array<'color' | 'animation'> = [];
  const slides: HTMLElement[] = [];

  groups.forEach((groupedElements, index) => {
    const layout = LAYOUTS.find(layout =>
        layout.isApplicable(groupedElements) && layout !== usedLayouts[usedLayouts.length - 1],
      )
      || LAYOUTS.find(layout =>
        layout.isApplicable(groupedElements),
      )!;

    usedLayouts.push(layout);
    const slide = layout.apply(groupedElements) as HTMLElement;
    slides.push(slide);

    const lastBackgrounds = usedBackgrounds.slice(usedBackgrounds.length - 2, usedBackgrounds.length);
    if ((slide.querySelector('h1,h2,h3,h4,h5,h6,blockquote') !== null && lastBackgrounds.some(bg => bg !== 'animation'))
      || lastBackgrounds.every(bg => bg !== 'animation')) {
      usedBackgrounds.push('animation');
      addBackground(slide);
    } else {
      usedBackgrounds.push('color');
      slide.classList.add(BACKGROUND_COLOR_CLASSES[index % BACKGROUND_COLOR_CLASSES.length]);
    }
  });

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
