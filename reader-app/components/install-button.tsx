'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function InstallButton() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) return null;

  return (
    <>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/install"
      >
        <Image
          aria-hidden
          src="/window.svg"
          alt="Window icon"
          width={16}
          height={16}
        />
        Install app
      </Link>
    </>
  );
}