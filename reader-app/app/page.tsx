'use client';

import HomeForm from '@/components/home-form';
import RSSPool from '@/components/rss';
import { useState } from 'react';

export default function Home() {
    const categories = ['Gadgets', 'Papers', 'News', 'Tech', 'Science'];
    const [selectedCategory, setSelectedCategory] = useState<string>('Gadgets');

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        // In the future, this could trigger filtering of the RSS feed
        console.log(`Selected category: ${category}`);
    };

    return (
        <div
            className="mx-auto w-[32rem] max-w-full min-h-screen pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
            <main>
                <h4 className="px-4 mt-6"><span className="font-bold">Scholar.Love</span> • Gen Z article reader</h4>
                <div className="mx-4 mt-48 mb-8">
                    <h1 className="text-4xl font-extrabold mb-1">Good evening</h1>
                    <p className="text-xl">What are you going to read today?</p>
                    <div className="mt-4 -mx-1">
                        <HomeForm/>
                    </div>
                </div>
                <div>
                    <div className="flex px-3 gap-2 mb-4 overflow-x-scroll">
                        {categories.map((category) => (
                            <label 
                                key={category}
                                className={`rounded-full px-4 py-3 flex items-center cursor-pointer ${selectedCategory === category ? 'bg-fuchsia-400 text-gray-950' : 'bg-gray-800'}`}
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    value={category}
                                    checked={selectedCategory === category}
                                    onChange={() => handleCategoryChange(category)}
                                    className="sr-only" // Hide the actual radio button
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                </div>
                <RSSPool/>
            </main>
            {/*<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">*/}
            {/*    <InstallButton/>*/}
            {/*    <a*/}
            {/*        className="flex items-center gap-2 hover:underline hover:underline-offset-4"*/}
            {/*        href="https://github.com/tm-a-t/engros"*/}
            {/*        target="_blank"*/}
            {/*        rel="noopener noreferrer"*/}
            {/*    >*/}
            {/*        <Image*/}
            {/*            aria-hidden*/}
            {/*            src="/globe.svg"*/}
            {/*            alt="Globe icon"*/}
            {/*            width={16}*/}
            {/*            height={16}*/}
            {/*        />*/}
            {/*        Source code*/}
            {/*    </a>*/}
            {/*</footer>*/}
        </div>
    );
}
