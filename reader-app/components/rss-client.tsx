'use client';

import React, { useState, useEffect } from 'react';
import { Item } from '@/lib/rss-utils';

interface RSSPoolClientProps {
    initialPosts: Item[];
    totalCount: number;
    initialLimit?: number;
}

export default function RSSPoolClient({ 
    initialPosts, 
    totalCount, 
    initialLimit = 10 
}: RSSPoolClientProps) {
    const [posts, setPosts] = useState<Item[]>(initialPosts);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(offset < totalCount);

    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            // Use fetch to call an API endpoint that will return more posts
            const response = await fetch(`/api/rss?offset=${offset}&limit=${initialLimit}`);
            const newPosts = await response.json();
            
            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setOffset(prevOffset => prevOffset + newPosts.length);
            setHasMore(offset + newPosts.length < totalCount);
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMorePosts();
                }
            },
            { threshold: 0.1 }
        );

        const loadMoreElement = document.getElementById('load-more-trigger');
        if (loadMoreElement) {
            observer.observe(loadMoreElement);
        }

        return () => {
            if (loadMoreElement) {
                observer.unobserve(loadMoreElement);
            }
        };
    }, [hasMore, loading, offset, initialLimit]);

    return (
        <section className="">
            <ul className="">
                {posts.map(item => (
                    <a key={item.Link} href={'/' + item.Link} className="block rounded-xl bg-fuchsia-200 p-4 font-medium mb-1.5">
                        {item.llm_overview && (
                            <p className="mb-2">{item.llm_overview}</p>
                        )}

                        <div className="pl-2 pt-0.5 pb-1 border-l-2 border-fuchsia-300 leading-5">
                            <div className="text-sm text-fuchsia-700">{item.Source}</div>

                            <h3 className="font-bold">{item.Title}</h3>
                        </div>
                    </a>
                ))}
            </ul>
            
            {hasMore && (
                <div id="load-more-trigger" className="text-center py-4">
                    {loading ? (
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-fuchsia-500"></div>
                    ) : (
                        <button 
                            onClick={loadMorePosts}
                            className="px-4 py-2 bg-fuchsia-200 hover:bg-fuchsia-300 rounded-lg font-medium"
                        >
                            Load More
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}