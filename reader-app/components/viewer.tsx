'use client';

import React, {useEffect, useRef, useState} from 'react';
import useOrigin from '@/hooks/use-origin';
import engros from 'engros';
import 'engros/style.css';

import {
  injectAnchorsAndCollectOutline,
  OutlineDrawer,
  OutlineNode,
} from './outline';

interface ViewerProps {
  originalHTML: string;
  url: string;
}

export default function Viewer({originalHTML, url}: ViewerProps) {
  const origin = useOrigin();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [outline, setOutline] = useState<OutlineNode[] | null>(null);

  /* run engros, then anchor+outline */
  useEffect(() => {
    if (!origin) return;

    /* 1. engros -> HTMLElement */
    let article = engros(originalHTML, {
      referenceLink: url,
      proxyLink: origin + '/',
    });

    if (article === null) {
      article = document.createElement('div');
      article.style.textAlign = 'center';
      article.style.marginTop = '0.5rem';
      article.innerText = "We couldn't find an article on this page :c";
    }

    /* 2. mount */
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(article);

      /* 3. inject anchors + build outline on mounted DOM */
      const ol = injectAnchorsAndCollectOutline(article);
      setOutline(ol);
    }
  }, [origin, originalHTML, url]);

  return (
      <>
        {outline && <OutlineDrawer outline={outline} />}
        <div ref={containerRef} className="prose prose-invert max-w-none" />
      </>
  );
}