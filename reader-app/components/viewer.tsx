'use client';

import useOrigin from '@/hooks/use-origin';
import engros from 'engros';
import {useEffect, useRef} from 'react';
import 'engros/style.css'

export default function Viewer({originalHTML, url}: {originalHTML: string, url: string}) {
  const origin = useOrigin();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (origin == null) {
      return
    }

    const content = engros(originalHTML, url, origin + '/');
    if (containerRef.current) {
      containerRef.current.appendChild(content);
    }
  }, [origin]);

  return (
    <div ref={containerRef}></div>
  )
}