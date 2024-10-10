import Sidebar from '@/components/Sidebar';
import React from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

async function getClaims(){
    const claims = await prisma.claim.findMany({
        take: 100,
        skip: 0,
    });
    return claims;
    
}


export default async function Data(){
    const dataTable = await getClaims();
    const session = await auth();
    if (!session) {
        redirect('/access-denied');
    }
    
    return (
        <>
            <Sidebar />
            <div className='w-full'>
                <div className='ml-[100px] w-[100vw - 100px] px-12'>
                    <div className="header py-8">
                        <h1 className='font-bold text-2xl text-primary-900 dark:text-white'>Tabela dos dados</h1>
                    </div>
                    <div className="table-shadcn">
                        <DataTable columns={columns} data={dataTable} />
                    </div>
                </div>
            </div>
        </>
    )
}