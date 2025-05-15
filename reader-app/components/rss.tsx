import React from 'react';
import RSSPoolClient from './rss-client';

/* ──────────────────────────────────────────────────────────────────────────
   Server component to fetch initial data
────────────────────────────────────────────────────────────────────────── */
export default function RSSPool({ initialLimit = 5 }: { initialLimit?: number } = {}) {
    // const initialPosts = await buildPool(0, initialLimit);

    return <RSSPoolClient initialLimit={initialLimit} />;
}
