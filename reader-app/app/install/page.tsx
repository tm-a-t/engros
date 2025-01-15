import Image from "next/image";
import HomeForm from '@/components/home-form';
import InstallButton from '@/components/install-button';
import Link from 'next/link';

export default function Install() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-start max-w-96">
        <div>
          <p>Install this app to open links by sharing from other places. You can install it from your browser: on mobile,
          select “Share” → “Add to homescreen”.</p>
        </div>
        <Link href="/" className="font-bold">Home</Link>
      </main>
    </div>
  );
}
