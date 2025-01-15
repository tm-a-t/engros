import Viewer from '@/components/viewer';
import Link from 'next/link';

export default async function Page({params}: { params: Promise<{ url: string[] }> }) {
  const urlParts = (await params).url;
  if (['https%3A', 'http%3A'].includes(urlParts[0])) {
    urlParts.shift();
  }
  const url = 'https://' + urlParts.map(decodeURIComponent).join('/');

  let content;
  try {
    const response = await fetch(url);
    const text = await response.text();
    content = <Viewer originalHTML={text} url={url}/>;
  } catch (e) {
    console.log(e);
    content = <div className="p-4 text-center">We got an error :c</div>;
  }

  return (
    <div>
      <Link className="absolute text-4xl px-2 text-inherit hover:text-inherit hover:opacity-50 z-10" href="/"
            aria-label="Home">←</Link>
      {content}
    </div>
  );
}
