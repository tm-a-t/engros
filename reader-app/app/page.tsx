'use client';

import HomeForm from '@/components/home-form';
import RSSPool from '@/components/rss';
import React, { useState } from 'react';

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
                {/*<h4 className="px-4 mt-6 mb-12 font-extrabold text-center"><span className="text-fuchsia-300">Scholar.Love,</span> Gen Z reading app</h4>*/}
                <div className="px-4 mt-64 mb-8 font-extrabold flex flex-col text-5xl text-gray-500"><h4 className="text-fuchsia-300">Scholar.Love</h4> <span>Gen Z reading app</span></div>
                <div className="mx-4 mb-16">
                    <div className="-mx-0.5">
                        <HomeForm/>
                    </div>
                </div>
                <div className="mx-4 ">
                    <h2 className="font-extrabold text-xl mb-4">Latest on the web</h2>
                </div>
                <div>
                    <div className="flex px-3 gap-2 mb-4 overflow-x-scroll">
                        {categories.map((category) => (
                            <label 
                                key={category}
                                className={`rounded-full px-4 py-3 flex items-center cursor-pointer ${selectedCategory === category ? 'bg-fuchsia-300 text-gray-950' : 'bg-gray-800'}`}
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
