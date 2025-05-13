import {preprocessDocument, process, ProcessOptions} from "./processing";
import {JSDOM} from 'jsdom';
import {Defuddle} from "defuddle/node";

export default async function engros(html: string | JSDOM, options: ProcessOptions): Promise<HTMLElement | null> {
    const jsdom = (html instanceof JSDOM) ? html : new JSDOM(html);
    preprocessDocument(jsdom.window.document, options);
    const parseResult = await Defuddle(
        jsdom,
        options.referenceLink,
        {url: options.referenceLink},
    );
    if (parseResult.content.length === 0) return null;

    const cleanJsdom = new JSDOM(parseResult.content);
    return process(cleanJsdom.window.document, parseResult, options);
}

export async function engrosFromUrl(url: string, options: ProcessOptions): Promise<HTMLElement | null> {
    const jsdom = await JSDOM.fromURL(url);
    return engros(jsdom, options);
}
