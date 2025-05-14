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
    <Form action={go} className="flex flex-wrap w-full bg-fuchsia-300">
      <input ref={inputRef} placeholder="https://example.com"
             className="flex-grow box-border bg-transparent h-12 px-2 text-lg placeholder:text-fuchsia-300 outline-0 focus:border-fuchsia-400"/>
      <button className="bg-white h-10 px-4 text-lg font-medium rounded-lg text-black">Go</button>
    </Form>
  );
}