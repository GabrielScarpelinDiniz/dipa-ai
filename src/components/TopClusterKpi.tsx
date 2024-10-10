import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function getTopServiceClusterKpi(clusterId: number) {
    const values = await prisma.$queryRaw`
        SELECT
            COUNT("id") as number,
            SUM("claimAmount") as total,
            "claimServiceDescription"
        FROM "Claim"
        WHERE "cluster" = ${clusterId}
        GROUP BY "claimServiceDescription"
        ORDER BY number DESC
    ` as any[];
    return values[0];
}


export default async function TopServiceClusterKpi({ clusterId } : { clusterId: number }) {
    const topService = await getTopServiceClusterKpi(clusterId);

    return (
        <Card key={1} className="h-full">
            <CardHeader>
                <CardTitle>Serviço mais utilizado</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <span>{topService.claimServiceDescription}</span>
                <span>Quantidade de sinistros: {Number(topService.number).toLocaleString("pt-br")}</span>
                <span>Valor total: {Number(topService.total).toLocaleString("pt-br", { style: "currency", currency: "BRL"})}</span>
            </CardContent>
        </Card>
    )
}