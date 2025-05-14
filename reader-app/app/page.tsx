import Image from "next/image";
import HomeForm from '@/components/home-form';
import InstallButton from '@/components/install-button';
import RSSPool from '@/components/rss';


export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-start">
                <div>
                    <h1 className="text-4xl font-extrabold mb-1">Good evening</h1>
                    <p className="text-xl">What are you going to read today?</p>
                </div>
                <HomeForm/>
                <RSSPool/>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <InstallButton/>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://github.com/tm-a-t/engros"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Source code
                </a>
            </footer>
        </div>
    );
}
