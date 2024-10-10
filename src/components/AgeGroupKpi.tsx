import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function getAgeGroupKpi(clusterId: number) {
    const values = await prisma.$queryRaw`
        SELECT
            COUNT("id") as number,
            SUM("claimAmount") as total,
            "ageGroup"
        FROM "Claim"
        WHERE "cluster" = ${clusterId}
        GROUP BY "ageGroup"
        ORDER BY number DESC
    ` as any[];
    return values[0];
}

export default async function AgeGroupKpi({ clusterId } : { clusterId: number }) {
    const ageGroup = await getAgeGroupKpi(clusterId);
    return (
        <Card key={2} className="h-full">
            <CardHeader>
                <CardTitle>Faixa etária mais comum</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
                <span>{ageGroup.ageGroup}</span>
                <span>Quantidade de sinistros: {Number(ageGroup.number).toLocaleString("pt-br")}</span>
                <span>Valor total: {Number(ageGroup.total).toLocaleString("pt-br", { style: "currency", currency: "BRL"})}</span>
            </CardContent>
        </Card>
    )
}