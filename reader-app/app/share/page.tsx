import {redirect} from 'next/navigation';

export default function Share({searchParams}: { searchParams: {link: string} }) {
  redirect('/' + decodeURI(searchParams.link))
}
