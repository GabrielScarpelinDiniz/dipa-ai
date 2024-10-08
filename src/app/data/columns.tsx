"use client"

import { Button } from "@/components/ui/button"
import { Prisma } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Claims = Prisma.ClaimGetPayload<{}>

export const columns: ColumnDef<Claims>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Elegibilidade",
        accessorKey: "role",
    },
    {
        header: "Sexo",
        accessorKey: "gender",
    },
    {
        header: "Faixa Etária",
        accessorKey: "ageGroup",
        cell: (row) => {
            const value = row.getValue() as number
            return <span className="text-nowrap">{value}</span>
        },
        
    },
    {
        header: "Plano",
        accessorKey: "planDescription",
    },
    {
        header: "Descrição do Sinistro",
        accessorKey: "claimServiceDescription",
    },
    {
        header: "Tipo de Utilização",
        accessorKey: "usageType",
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
        accessorKey: "claimAmount",
        cell: (row) => {
            const value = row.getValue() as number
            return <span>{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        },
    },
    {
        header: "Quantidade",
        accessorKey: "quantity",
    },
    {
        header: "Nome do Grupo/Empresa",
        accessorKey: "enterpriseName",
    },
    {
        header: "No Ano/Mês",
        accessorKey: "yearMonth",
    },
    {
        header: "Categoria Geral",
        accessorKey: "claimServiceCategory",
    },
    {
        header: "Possível doença relacionada",
        accessorKey: "relatedDisease",
    }
]