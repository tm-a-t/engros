import {preprocessDocument, process, ProcessOptions} from "./processing";
import Defuddle from "defuddle/full";

export default function engros(html: Document | string, options: ProcessOptions): HTMLElement | null {
    const htmlContent = (html instanceof Document) ? html : Document.parseHTMLUnsafe(html);
    preprocessDocument(htmlContent, options);
    const parseResult = new Defuddle(
        htmlContent,
        {url: options.referenceLink},
    ).parse();
    if (parseResult.content.length === 0) return null;

    const cleanHtmlContent = Document.parseHTMLUnsafe(parseResult.content);
    return process(cleanHtmlContent, parseResult, options);
}