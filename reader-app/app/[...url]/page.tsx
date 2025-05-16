import Viewer from '@/components/viewer';
import Link from 'next/link';
import {Globe, House} from "lucide-react";

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
      <div className="absolute font-bold flex bg-gray-900 text-fuchsia-300 rounded-full px-2 z-10 left-2 top-2 ">
        <Link className="text-inherit hover:text-inherit hover:opacity-50 px-1 py-2" href="/">
          <House />
        </Link>
        <a className="text-inherit hover:text-inherit hover:opacity-50 px-1 py-2" href={url} target="_blank">
          <Globe />
        </a>
      </div>

      {content}
    </div>
  );
}
