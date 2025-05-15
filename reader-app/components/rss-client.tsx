'use client';

import React, {useState, useEffect, useCallback} from 'react';
import {Item} from '@/lib/rss-utils';

interface RSSPoolClientProps {
    initialLimit?: number;
}

export default function RSSPoolClient({
                                          initialLimit = 10
                                      }: RSSPoolClientProps) {
    const [posts, setPosts] = useState<Item[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadMorePosts = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        try {
            // Use fetch to call an API endpoint that will return more posts
            const response = await fetch(`/api/rss?offset=${offset}&limit=${initialLimit}`);
            const newPosts = await response.json();

            setPosts(prevPosts => [...prevPosts, ...newPosts]);
            setOffset(prevOffset => prevOffset + newPosts.length);
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoading(false);
        }
    }, [initialLimit, loading, offset]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loading) {
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
    }, [loading, offset, initialLimit, loadMorePosts]);

    return (
        <section className="">
            {posts.map(item => (
                <div key={item.Link}>
                    <hr className="border-gray-800 mx-1"/>
                    <a href={'/' + item.Link} className="block px-4 py-4 hover:bg-gray-700">
                        <span className="text-sm text-gray-400 mb-2 block">{new Intl.DateTimeFormat("en-US").format(new Date(item.Date))}</span>

                        {item.llm_overview && (
                            <p className="mb-4">{item.llm_overview}</p>
                        )}

                        <div className="rounded-xl bg-gray-800 p-4 leading-5 -mx-0.5">
                            <span className="text-sm text-fuchsia-300">{item.Source}</span>

                            <h3 className="font-bold">{item.Title}</h3>
                        </div>
                    </a>
                </div>
            ))}

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
        </section>
    );
}