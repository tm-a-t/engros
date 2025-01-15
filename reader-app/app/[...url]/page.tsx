import Viewer from '@/components/viewer';

export default async function Page({params}: { params: Promise<{ url: string[] }> }) {
  const urlParts = (await params).url;
  if (['https%3A', 'http%3A'].includes(urlParts[0])) {
    urlParts.shift();
  }
  const url = 'https://' + urlParts.map(decodeURIComponent).join('/');

  const response = await fetch(url);
  const text = await response.text();

  return (
    <div>
      <Viewer originalHTML={text} url={url}/>
    </div>
  );
}
