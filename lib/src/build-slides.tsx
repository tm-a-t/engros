import {type Layout, LAYOUTS} from './layouts';
import * as THREE from 'three';
import {isH1, isHeading, last, sum} from './utils';
import {addBackground} from './animated-background';

export function buildSlides(elements: HTMLElement[]): HTMLElement[] {
    const BACKGROUND_COLOR_CLASSES = ['bg-violet-400', 'bg-blue-400', 'bg-rose-400', 'bg-amber-400'];

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

        addBackground(slide);

        /* Alternate between plain-colored and animated backgrounds */
        // const lastBackgrounds = usedBackgrounds.slice(usedBackgrounds.length - 2, usedBackgrounds.length);
        // if ((slide.querySelector('h1,h2,h3,h4,h5,h6,blockquote') !== null && lastBackgrounds.some(bg => bg !== 'animation'))
        //   || lastBackgrounds.every(bg => bg !== 'animation')) {
        //   usedBackgrounds.push('animation');
        //   addBackground(slide);
        // } else {
        //   usedBackgrounds.push('color');
        //   slide.classList.add(BACKGROUND_COLOR_CLASSES[index % BACKGROUND_COLOR_CLASSES.length]);
        // }
    });

    addScrollAnimations(slides);
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
                    last(lastGroup).textContent?.endsWith(':\n')
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

            if (isH1(element)) {
                groupedElements.push([]);
            }
        } else {
            // Add to the existing group
            lastGroup.push(element);
        }
    }
    return groupedElements;
}

function addScrollAnimations(elements: HTMLElement[]) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // entry.target.classList.remove('visible');
            }
        });
    });

    const animatedElements = elements.flatMap(element => [...element.querySelectorAll('.engros-slide>*:not(canvas)')]);
    animatedElements.forEach(element => element.classList.add('engros-animated'));

    animatedElements.forEach(element => {
        observer.observe(element)
    });
}
