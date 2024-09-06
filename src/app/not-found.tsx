"use client";

import Image from 'next/image'
import Link from 'next/link'
import travoltaGif from "@/assets/pulp-fiction-john-travolta.gif";
import claudio from "@/assets/CLAUDIO-ANDRE.jpg";
import { useState } from 'react';

export default function NotFound() {
  const [isTravolta, setIsTravolta] = useState(true)
  return (
    <div className='flex items-center w-full h-full justify-around'>
      { isTravolta ? <Image src={travoltaGif} alt='John Travolta confused' width={400} height={400} onClick={() => {
        setIsTravolta(false)
      }}/> : null }
      { !isTravolta ? (
        <div className='flex flex-col gap-4 items-center justify-center'>
            <h1 className='text-2xl font-bold'>Eu sei onde está a página, mas não vou te falar</h1>
            <Image src={claudio} alt='Claudio André' width={400} height={400} onClick={() => {
                setIsTravolta(true)
            }}/>
        </div>
      ) : null }
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-4xl font-bold'>404</h1>
        <h2 className='text-2xl font-bold'>Página não encontrada</h2>
        <Link href='/dashboard' className='dark:bg-white dark:text-black p-2 rounded font-medium bg-black text-white'>
          <p className='btn btn-primary'>Voltar para a Dashboard</p>
        </Link>
      </div>
    </div>
  )
}