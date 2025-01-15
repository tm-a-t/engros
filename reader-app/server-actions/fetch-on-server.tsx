'use server';

export async function fetchOnServer(path: string): Promise<string> {
  const response = await fetch(path);
  return await response.text();
}
