import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function getDescribeValues(clusterId: number) {
    const values = await prisma.$queryRaw`
        SELECT
            AVG("claimAmount") as average,
            STDDEV_POP("claimAmount") as stddev,
            SUM("claimAmount") as total,
            COUNT("id") as number
        FROM "Claim"
        WHERE "cluster" = ${clusterId}

    ` as any[];
    console.log(values);
    return values[0];
}

export default async function DescribeKpi({ clusterId } : { clusterId: number }) {
    const describeValues = await getDescribeValues(clusterId);
    return (
        <Card key={0}>
            <CardHeader>
                <CardTitle>Descrição dos valores</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <span>Média: {Number(describeValues.average).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</span>
                <span>Desvio padrão: {Number(describeValues.stddev).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</span>
                <span>Valor total: {Number(describeValues.total).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</span>
                <span>Quantidade de sinistros: {parseInt(describeValues.number).toLocaleString("pt-br")}</span>
            </CardContent>
        </Card>
    )
}