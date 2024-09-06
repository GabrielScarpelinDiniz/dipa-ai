"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Sinistro = {
  id: string
  elegibilidade: string
  sexo: "F" | "M"
  faixa_etaria: string
  plano: string
  descricao_sinistro: string
  tipo_utilizacao: string
  valor_pago: number
  quantidade: number
  nome_grupo_empresa: string
  no_ano_mes: string
  categoria_geral: string
}

export const columns: ColumnDef<Sinistro>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Elegibilidade",
        accessorKey: "elegibilidade",
    },
    {
        header: "Sexo",
        accessorKey: "sexo",
    },
    {
        header: "Faixa Etária",
        accessorKey: "faixa_etaria",
    },
    {
        header: "Plano",
        accessorKey: "plano",
    },
    {
        header: "Descrição do Sinistro",
        accessorKey: "descricao_sinistro",
    },
    {
        header: "Tipo de Utilização",
        accessorKey: "tipo_utilizacao",
    },
    {
        header: ({ column }) => {
            return (
                <Button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} variant="ghost">
                    Valor Pago
                    <ArrowUpDown size={16} />
                </Button>
            )
        },
        accessorKey: "valor_pago",
        cell: (row) => {
            const value = row.getValue() as number
            return <span>{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        },
    },
    {
        header: "Quantidade",
        accessorKey: "quantidade",
    },
    {
        header: "Nome do Grupo/Empresa",
        accessorKey: "nome_grupo_empresa",
    },
    {
        header: "No Ano/Mês",
        accessorKey: "no_ano_mes",
    },
    {
        header: "Categoria Geral",
        accessorKey: "categoria_geral",
    },
]