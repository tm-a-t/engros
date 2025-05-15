'use client';

import {useRef} from 'react';
import Form from 'next/form';
import {useRouter} from 'next/navigation';

export default function HomeForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function go() {
    const url = window.location.href + inputRef.current!.value;
    router.push(url);
  }

  return (
    <Form action={go} className="flex flex-wrap items-center pr-2 w-full bg-gray-950 rounded-xl">
      <input ref={inputRef} placeholder="https://example.com"
             className="flex-grow box-border bg-transparent h-14 pl-4 text-lg placeholder:text-gray-600 outline-0 focus:border-fuchsia-400"/>
      <button className="bg-white h-10 px-6 text-lg font-medium rounded-lg text-black">Go</button>
    </Form>
  );
}