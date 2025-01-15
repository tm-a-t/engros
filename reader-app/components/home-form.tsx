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
    <Form action={go} className="flex gap-1 flex-wrap">
      <input ref={inputRef} placeholder="https://example.com"
             className="box-border bg-transparent h-10 px-2 text-lg border-2 border-white/30 rounded-lg placeholder:text-white/30 outline-0 focus:border-white"/>
      <button className="bg-white h-10 px-4 text-lg font-medium rounded-lg text-black">Go</button>
    </Form>
  );
}