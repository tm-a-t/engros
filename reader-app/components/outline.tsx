'use client';

import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

/* ──────────────────────────────────────────────────────────────
   Types
─────────────────────────────────────────────────────────────── */
export type OutlineNode = {
    title: string;          // e.g. “Introduction”
    anchor: string;         // #id in the article
    summary: string;        // 1-sentence AI bullet
};

/* ──────────────────────────────────────────────────────────────
   id factory
─────────────────────────────────────────────────────────────── */
const createAnchor = (() => {
    const used = new Set<string>();
    return (): string => {
        let id = 'sec-' + uuidv4().slice(0, 8);
        while (used.has(id)) id = 'sec-' + uuidv4().slice(0, 8);
        used.add(id);
        return id;
    };
})();

/* ──────────────────────────────────────────────────────────────
   DOM helpers
─────────────────────────────────────────────────────────────── */
export function addAnchorsCollectSkeleton(
    root: HTMLElement,
): OutlineNode[] {
    const outline: OutlineNode[] = [];

    Array.from(root.querySelectorAll('h1,h2') as NodeListOf<HTMLElement>).forEach(
        h => {
            let id = h.getAttribute('id');
            if (!id) {
                id = createAnchor();
                h.setAttribute('id', id);
            }
            outline.push({
                title: h.textContent?.trim() || 'Untitled',
                anchor: id,
                summary: '⟳ Loading …',
            });
        },
    );

    return outline;
}

/* Return plain text of the section (until next h1/h2 or end) */
export function sectionText(element: HTMLElement): string {
    let ptr: HTMLElement | null = element.nextElementSibling as HTMLElement | null;
    const parts: string[] = [];

    while (ptr && !/^H[12]$/i.test(ptr.tagName)) {
        parts.push(ptr.textContent ?? '');
        ptr = ptr.nextElementSibling as HTMLElement | null;
    }
    return parts.join(' ').replace(/\s+/g, ' ').trim().slice(0, 4000);
}

/* ──────────────────────────────────────────────────────────────
   Drawer UI (unchanged look, but shows `summary`)
─────────────────────────────────────────────────────────────── */
export function OutlineDrawer({outline}: {outline: OutlineNode[]}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed right-4 top-4 z-40 bg-fuchsia-600 text-white px-3 py-1 rounded shadow-lg hover:bg-fuchsia-500"
            >
                {open ? '✕ Close outline' : '🗒 AI outline'}
            </button>

            {open && (
                <aside className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto p-6 z-30 space-y-6">
                    {outline.map(sec => (
                        <div key={sec.anchor}>
                            <h3 className="font-semibold mb-2 text-fuchsia-200">
                                <a href={'#' + sec.anchor} onClick={() => setOpen(false)}>
                                    {sec.title}
                                </a>
                            </h3>
                            <p className="text-sm">{sec.summary}</p>
                        </div>
                    ))}
                </aside>
            )}
        </>
    );
}