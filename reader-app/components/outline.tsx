'use client';

import React, {useState} from 'react';
import {v4 as uuidv4} from 'uuid';

/* ──────────────────────────────────────────────────────────────
   Types
─────────────────────────────────────────────────────────────── */
export type Bullet = { text: string; anchor: string };

export type OutlineNode = {
    title: string;
    anchor: string;
    bullets: Bullet[];
};

/* ──────────────────────────────────────────────────────────────
   Unique-id factory
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
   Helper – first “real” sentence after an element
─────────────────────────────────────────────────────────────── */
function firstSentenceAfter(el: Element | null): string {
    while (el) {
        const txt = el.textContent?.trim() ?? '';
        if (txt.length > 40) {
            const period = txt.indexOf('.');
            const sentence =
                period !== -1 ? txt.slice(0, period + 1) : txt.slice(0, 160);
            return sentence;
        }
        el = el.nextElementSibling;
    }
    return '';
}

/* ──────────────────────────────────────────────────────────────
   MAIN:  inject ids + create outline with 1-sentence bullets
─────────────────────────────────────────────────────────────── */
export function injectAnchorsAndCollectOutline(
    root: HTMLElement,
): OutlineNode[] {
    const headings = Array.from(
        root.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ) as HTMLElement[];

    const sections: OutlineNode[] = [];
    let current: OutlineNode | null = null;

    headings.forEach(h => {
        /* ensure id ------------------------------------------------ */
        let id = h.getAttribute('id');
        if (!id) {
            id = createAnchor();
            h.setAttribute('id', id);
        }

        const lvl = Number(h.tagName[1]); // 1–6
        const title = h.textContent?.trim() || 'Untitled';

        /* top-level section --------------------------------------- */
        if (lvl <= 2) {
            current = {title, anchor: id, bullets: []};
            sections.push(current);
            return;
        }

        /* sub-heading → bullet for current section ---------------- */
        if (current) {
            current.bullets.push({text: title, anchor: id});
        }
    });

    /* sections w/o sub-headings get auto-generated one-sentence */
    sections.forEach(sec => {
        if (sec.bullets.length === 0) {
            const headingEl =
                (root.querySelector('#' + CSS.escape(sec.anchor)) as HTMLElement) ??
                null;
            const text = firstSentenceAfter(headingEl?.nextElementSibling ?? null);
            sec.bullets.push({
                text: text || '↳ section start',
                anchor: sec.anchor,
            });
        }
    });

    return sections;
}

/* ──────────────────────────────────────────────────────────────
   Drawer UI
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
                <aside className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto p-6 z-30">
                    {outline.map(sec => (
                        <div key={sec.anchor} className="mb-6">
                            <h3 className="font-semibold mb-2 text-fuchsia-200">
                                <a href={'#' + sec.anchor} onClick={() => setOpen(false)}>
                                    {sec.title}
                                </a>
                            </h3>

                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                {sec.bullets.map(b => (
                                    <li key={b.anchor}>
                                        <a
                                            href={'#' + b.anchor}
                                            className="hover:underline"
                                            onClick={() => setOpen(false)}
                                        >
                                            {b.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </aside>
            )}
        </>
    );
}