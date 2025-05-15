import React from 'react';
import RSSPoolClient from './rss-client';
import { getTotalItemsCount } from '@/lib/rss-utils';

/* ──────────────────────────────────────────────────────────────────────────
   Server component to fetch initial data
────────────────────────────────────────────────────────────────────────── */
export default async function RSSPool({ initialLimit = 10 }: { initialLimit?: number } = {}) {
    // const initialPosts = await buildPool(0, initialLimit);
    const totalCount = await getTotalItemsCount();

    return <RSSPoolClient initialPosts={[]} totalCount={totalCount} initialLimit={initialLimit} />;
}
