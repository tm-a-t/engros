import {redirect} from 'next/navigation';

export default async function Share(
  {searchParams}:
    { searchParams: Promise<{ [key: string]: string | string[] | undefined }> },
) {
  const params = await searchParams;
  const linkParam = params.description ?? params.link;
  const link = Array.isArray(linkParam) ? linkParam[0] : linkParam;
  redirect('/' + decodeURI(link || ''));
}
