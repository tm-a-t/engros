import {redirect} from 'next/navigation';

export default async function Share(
  {searchParams}:
    { searchParams: Promise<{ [key: string]: string | string[] | undefined }> },
) {
  const params = await searchParams;

  return <>
    {params}
  </>

  // const link = Array.isArray(params.link) ? params.link[0] : params.link;
  // redirect('/' + decodeURI(link || ''));
}
