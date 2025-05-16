import * as React from '@turtlemay/jsx-dom';
import {buildSlides} from './build-slides';
import './style/style.css';
import {DefuddleResponse} from 'defuddle/full';


export type ProcessOptions = {
    referenceLink: string,
    proxyLink?: string,
}

export function preprocessDocument(html: Document, options: ProcessOptions) {
    preprocessHeaders(html);

    if (!document.querySelector('base')) {
        document.head.insertBefore(<base href={options.referenceLink}/>, document.head.firstChild);
    }
}

export function process(htmlContent: Document, parseResult: DefuddleResponse, options: ProcessOptions): HTMLElement | null {
    function getNonContainerElements(element: Element): Array<Element> {
        const containerTags = ['BODY', 'DIV', 'SPAN', 'ARTICLE', 'MAIN', 'SECTION', 'TITLE'];
        if (containerTags.includes(element.tagName)) {
            return [...element.children].flatMap(getNonContainerElements)
        }

        return [element];
    }

    let rawElementsUnfiltered = getNonContainerElements(htmlContent.body);
    if (!rawElementsUnfiltered) {
        return null;
    }

    const rawElements = [...rawElementsUnfiltered].filter(node => node instanceof HTMLElement);
    if (rawElements.length == 0) {
        return null
    }

    const elements = [<h1>{parseResult.title}</h1> as HTMLElement, ...rawElements];
    // Parsing Wikibooks titles
    // if (defuddle.title.includes("Wikibooks, open")) {
    //     var title = defuddle.title.split(" - ")[0];
    //     title = title.split("/", 2).join("/ ");
    //
    //     elements[0] = <h1>{title}</h1> as HTMLElement;
    // }

    postprocessAnchorLinks(elements, options.referenceLink);
    if (options.proxyLink) {
        postprocessRemainingLinks(elements, options.proxyLink);
    }

    return <div class="engros">
        {buildSlides(elements)}
    </div> as HTMLElement;
}


function postprocessAnchorLinks(elements: HTMLElement[], referenceLink: string) {
    elements.forEach(readabilityOutputElement => {
        readabilityOutputElement.querySelectorAll('[href]').forEach(elementWithLink => {
            const href = elementWithLink.getAttribute('href');
            if (href && (
                href.startsWith(`${referenceLink}#`) ||
                href.startsWith(referenceLink.replace('http:', 'https:') + '#') ||
                href.startsWith(referenceLink.replace('https:', 'http:') + '#')
            )) {
                elementWithLink.setAttribute('href', href.replace(/^.*?#/, '#'));
            }
        })
    })
}

function postprocessRemainingLinks(elements: HTMLElement[], proxyLink: string) {
    elements.forEach(readabilityOutputElement => {
        readabilityOutputElement.querySelectorAll('[href]').forEach(elementWithLink => {
            const href = elementWithLink.getAttribute('href');
            if (href && (href.startsWith("https:") || href.startsWith("http:"))) {
                elementWithLink.setAttribute('href', makeProxyLink(href, proxyLink));
            }
        })
    })
}

function makeProxyLink(href: string, proxyLink: string): string {
    return `${proxyLink}${href}`;
}

function preprocessHeaders(
    document: Document,
    mustPruneInsideHeaders: boolean = false,
    mustPruneHeaderDivs: boolean = true,
) {
    const BROKEN_HEADER_CLASSES = ['mw-heading'];

    const cleanHeaderMutation = (header: Element): void => {

        header.removeAttribute("class");
        header.removeAttribute("id");

        // readability.js detects smth else inside <h1> ~~> pruned
        const textContent = header.textContent;
        while (header.firstChild) {
            header.removeChild(header.firstChild);
        }

        header.textContent = textContent;
    };

    const cleanDivHeaderMutation = (div: Element): void => {
        const headers = [...div.childNodes]
            .filter(node =>
                node instanceof Element &&
                node.matches("h1, h2, h3, h4, h5, h6"),
            );


        div.innerHTML = '';
        headers.forEach(header => div.appendChild(header));

        const parent = div.parentNode;
        if (!parent) return;

        headers.forEach(header => parent.insertBefore(header, div));

        parent.removeChild(div);
    };

    if (mustPruneInsideHeaders) {
        [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
            .forEach(cleanHeaderMutation);
    }

    if (mustPruneHeaderDivs) {
        [...document.querySelectorAll("div")]
            .filter(div =>
                BROKEN_HEADER_CLASSES.some(className =>
                    div.classList.contains(className),
                ) &&
                div.querySelector('h1, h2, h3, h4, h5, h6'))
            .forEach(cleanDivHeaderMutation);
    }
}

// function removeUnnecessaryDivs(elements: HTMLElement[]) {
//     // Remove divs that have text leaves
//
//     const newElements: HTMLElement[] = elements
//         .map(element => {
//             if (element.tagName !== 'DIV') return [element];
//
//             for (let node of element.childNodes) {
//                 if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim().length) {
//                     return [element];
//                 }
//             }
//
//             return [...element.children] as HTMLElement[];
//         })
//         .flat()
//     ;
//
//     console.log(newElements)
//
//     elements.splice(0, elements.length, ...newElements);
// }
