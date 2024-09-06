import Sidebar from '@/components/Sidebar';
import React from 'react';
import { Sinistro, columns } from './columns';
import { DataTable } from './data-table';

async function getData(): Promise<Sinistro[]> {
    // Mockando os dados
    return [
        {
            id: "1",
            elegibilidade: "Elegível",
            sexo: "F",
            faixa_etaria: "18-24",
            plano: "Plano 1",
            descricao_sinistro: "Descrição do Sinistro 1",
            tipo_utilizacao: "Tipo de Utilização 1",
            valor_pago: 100,
            quantidade: 1,
            nome_grupo_empresa: "Grupo Empresa 1",
            no_ano_mes: "2021-01",
            categoria_geral: "Categoria Geral 1",
        },
        {
            id: "2",
            elegibilidade: "Elegível",
            sexo: "M",
            faixa_etaria: "25-34",
            plano: "Plano 2",
            descricao_sinistro: "Descrição do Sinistro 2",
            tipo_utilizacao: "Tipo de Utilização 2",
            valor_pago: 200,
            quantidade: 2,
            nome_grupo_empresa: "Grupo Empresa 2",
            no_ano_mes: "2021-02",
            categoria_geral: "Categoria Geral 2",
        },
        {
            id: "3",
            elegibilidade: "Elegível",
            sexo: "F",
            faixa_etaria: "35-44",
            plano: "Plano 3",
            descricao_sinistro: "Descrição do Sinistro 3",
            tipo_utilizacao: "Tipo de Utilização 3",
            valor_pago: 300,
            quantidade: 3,
            nome_grupo_empresa: "Grupo Empresa 3",
            no_ano_mes: "2021-03",
            categoria_geral: "Categoria Geral 3",
        },
        {
            id: "4",
            elegibilidade: "Elegível",
            sexo: "M",
            faixa_etaria: "45-54",
            plano: "Plano 4",
            descricao_sinistro: "Descrição do Sinistro 4",
            tipo_utilizacao: "Tipo de Utilização 4",
            valor_pago: 400,
            quantidade: 4,
            nome_grupo_empresa: "Grupo Empresa 4",
            no_ano_mes: "2021-04",
            categoria_geral: "Categoria Geral 4",
        },
        {
            id: "5",
            elegibilidade: "Elegível",
            sexo: "F",
            faixa_etaria: "55-64",
            plano: "Plano 5",
            descricao_sinistro: "Descrição do Sinistro 5",
            tipo_utilizacao: "Tipo de Utilização 5",
            valor_pago: 500,
            quantidade: 5,
            nome_grupo_empresa: "Grupo Empresa 5",
            no_ano_mes: "2021-05",
            categoria_geral: "Categoria Geral 5",
        },
    ]
    
}


export default async function Data(){
    const dataTable = await getData();
    
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