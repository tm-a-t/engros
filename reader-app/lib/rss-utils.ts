import Parser from 'rss-parser';
import {Readability} from '@mozilla/readability';
import {JSDOM} from 'jsdom';

/* ──────────────────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────────────────── */
export type BaseItem = {
    Title: string;
    Author: string;
    Link: string;
    Source: string;           // arXiv / Hacker News / LessWrong
    Date: string;
};

export type LLMData = {
    llm_summary: string;
    llm_author: string;
    llm_complexity: 'deep';
    llm_overview: string;
    llm_entertainment: string;
};

export type Item = BaseItem & Partial<LLMData>;

/* ──────────────────────────────────────────────────────────────────────────
   Helpers – RSS
────────────────────────────────────────────────────────────────────────── */
const parser = new Parser({
    customFields: {item: ['author', 'dc:creator']},
});

const normalise = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rssItem: any,
    source: string,
    authorFallback: string,
): BaseItem => ({
    Title: rssItem.title?.trim() ?? 'Untitled',
    Author: (rssItem.creator ??
        rssItem['dc:creator'] ??
        rssItem.author ??
        authorFallback).trim(),
    Link: rssItem.link,
    Source: source,
    Date: rssItem.isoDate,
});

async function fetchFeed(
    url: string,
    limit: number,
    source: string,
    authorFallback?: string,
): Promise<BaseItem[]> {
    const feed = await parser.parseURL(url);
    return (feed.items ?? [])
        .slice(0, limit)
        .map(i => normalise(i, source, authorFallback ?? feed.title ?? 'Unknown'));
}

/* ──────────────────────────────────────────────────────────────────────────
   Site-specific fetchers
────────────────────────────────────────────────────────────────────────── */
const ARXIV_CATS = ['cs.AI', 'eess.AS', 'eess.IV'];
const fetchArxiv = async (): Promise<BaseItem[]> => {
    const out: BaseItem[] = [];
    await Promise.all(
        ARXIV_CATS.map(async cat => {
            const items = await fetchFeed(
                `https://export.arxiv.org/rss/${cat}`,
                10,
                'arXiv',
                cat,
            );
            out.push(...items);
        }),
    );
    return out;
};

const fetchHackerNews = () =>
    fetchFeed('https://news.ycombinator.com/rss', 10, 'Hacker News', 'HackerNews');

const fetchLessWrong = () =>
    fetchFeed('http://lesserwrong.com/feed.xml', 10, 'LessWrong', 'LessWrong');

/* ──────────────────────────────────────────────────────────────────────────
   Readability – extract clean article text
────────────────────────────────────────────────────────────────────────── */
async function getReadableText(url: string): Promise<string> {
    try {
        const html = await (await fetch(url)).text();
        const dom = new JSDOM(html, {url});
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        return (article?.textContent ?? '').slice(0, 8000).trim(); // 8 k cap
    } catch (err) {
        console.error('Readability failed →', url, err);
        return '';
    }
}

/* ──────────────────────────────────────────────────────────────────────────
   OpenRouter summarisation
────────────────────────────────────────────────────────────────────────── */
async function summarise(item: BaseItem): Promise<LLMData> {
    const articleText = await getReadableText(item.Link);

    const prompt = `
You will receive an article. Respond with VALID JSON only, containing:
summary        – 1 sentence
author         – original author / blog
complexity     – ALWAYS the string "deep"
overview       – 1-sentence wider context
entertainment  – 1-sentence fun remark
Example:
{"summary":"...","author":"...","complexity":"deep","overview":"...","entertainment":"..."}
Article:
"""${articleText}"""
`.trim();

    try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://reader-app',
                'X-Title': 'RSS summariser',
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                temperature: 0.2,
                messages: [
                    {role: 'system', content: 'You are a concise helpful assistant.'},
                    {role: 'user', content: prompt},
                ],
            }),
        });

        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content ?? '{}';
        const json = JSON.parse(raw);

        return {
            llm_summary: json.summary ?? '',
            llm_author: json.author ?? '',
            llm_complexity: (json.complexity ?? 'deep') as 'deep',
            llm_overview: json.overview ?? '',
            llm_entertainment: json.entertainment ?? '',
        };
    } catch (err) {
        console.error('LLM error on', item.Link, err);
        return {
            llm_summary: '', llm_author: '', llm_complexity: 'deep',
            llm_overview: '', llm_entertainment: '',
        };
    }
}

/* ──────────────────────────────────────────────────────────────────────────
   Unified pool builder
────────────────────────────────────────────────────────────────────────── */
export async function buildPool(offset: number = 0, limit: number = 10): Promise<Item[]> {
    const basics = await Promise.all([
        fetchArxiv(),
        fetchHackerNews(),
        fetchLessWrong(),
    ]).then(arr => arr.flat().sort((a, b) => b.Date.localeCompare(a.Date)));

    // Apply pagination to the basic items
    const paginatedBasics = basics.slice(offset, offset + limit);

    const queue = [...paginatedBasics];
    const output: Item[] = [];
    const MAX_CONCURRENT = 3;

    const worker = async () => {
        for (; ;) {
            const next = queue.shift();
            if (!next) return;
            const llm = await summarise(next);
            output.push({...next, ...llm});
        }
    };

    await Promise.all(Array.from({length: MAX_CONCURRENT}, worker));
    return output;
}
