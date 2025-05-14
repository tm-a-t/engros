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

    let content = engros(originalHTML, {referenceLink: url, proxyLink: origin +'/'})
    if (content === null) {
      content = document.createElement("div");
      content.style.textAlign = "center";
      content.style.marginTop = "0.5rem";
      content.innerText = "We couldn't find an article on this page :c";
    }

    if (containerRef.current) {
      containerRef.current.appendChild(content);
    }
  }, [origin, originalHTML, url]);

  return (
    <div ref={containerRef}></div>
  )
}