import {redirect} from 'next/navigation';

export default async function Share({searchParams}: { searchParams: Promise<{ link: string }> }) {
  const {link} = await searchParams;
  redirect('/' + decodeURI(link));
}
