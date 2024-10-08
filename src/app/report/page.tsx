import { Button } from "@/components/ui/button";
import { AgeGroupChart, AgePyramid, ClusterBarChartAllFilters, LineClusterMultipleChart, MonthChartBigger, MultipleBarChart, MultipleBarChartClusterCompare, PieChartClusters, PieChartClustersAmount, RadarClusterChart } from "@/components/ReportGraphics";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import ServiceRanking from "@/components/ServiceRanking";
import PrintButton from "@/components/PrintButton";
import "./report.css"
import ClusterAnalyze from "@/components/ClusterAnalyze";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceRankingClustered from "@/components/ClusterRanking";

async function getClaimsNumberAndValueSumByMonth() {
    const claims = await prisma.$queryRaw`
        SELECT
            TO_CHAR("claimDate", 'YYYY-MM') as month,
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value,
            role,
            gender
        FROM
            "Claim" claims
        GROUP BY
            TO_CHAR("claimDate", 'YYYY-MM'),
            role,
            gender
        ORDER BY
            TO_CHAR("claimDate", 'YYYY-MM') ASC
        ` as any[];
    const claimsMapped = claims.reduce((acc, claim) => {
        const { month, number, value, role, gender } = claim;
    
        // Se o mês ainda não foi adicionado, inicializamos um objeto para ele
        if (!acc[month]) {
            acc[month] = {
                date: month,
                dependente: 0,
                titular: 0,
                homens: 0,
                mulheres: 0,
                valorDependente: 0,
                valorTitular: 0,
                valorHomens: 0,
                valorMulheres: 0
            };
        }
    
        // Acumular números de acordo com role e gender
        if (role === 'TITULAR') {
            acc[month].titular += Number(number);
            acc[month].valorTitular += Number(value);
        } else if (role === 'DEPENDENTE' || role === 'AGREGADO') {
            acc[month].dependente += Number(number);
            acc[month].valorDependente += Number(value);
        }
    
        if (gender === 'M') {
            acc[month].homens += Number(number);
            acc[month].valorHomens += Number(value);
        } else if (gender === 'F') {
            acc[month].mulheres += Number(number);
            acc[month].valorMulheres += Number(value);
        }
    
        return acc;
    }, {} as Record<string, any>);
    
    // Converter o objeto mapeado para um array
    const claimsMappedArray = Object.values(claimsMapped);
    return claimsMappedArray;
}
async function getClaimsByPlanByMonth() {
    const claims = await prisma.$queryRaw`
        SELECT
            TO_CHAR("claimDate", 'YYYY-MM') as month,
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value,
            "planDescription"
        FROM
            "Claim" claims
        GROUP BY
            TO_CHAR("claimDate", 'YYYY-MM'),
            "planDescription"
        ORDER BY
            TO_CHAR("claimDate", 'YYYY-MM') ASC
    ` as any[];

    const claimsMapped = claims.reduce((acc, claim) => {
        const { month, number, value, planDescription } = claim;

        // Se o mês ainda não foi adicionado, inicializamos um objeto para ele
        if (!acc[month]) {
            acc[month] = {
                date: month,
            };
        }

        // Acumular números de acordo com planDescription
        if (!acc[month][planDescription]) {
            acc[month][planDescription] = {
                number: 0,
                value: 0
            };
        }
        acc[month][planDescription].number += Number(number);
        acc[month][planDescription].value += Number(value);

        return acc;
    }, {} as Record<string, any>);

    // Converter o objeto mapeado para um array e estruturar corretamente
    const claimsMappedArray = Object.values(claimsMapped).map((item: any) => {
        const mappedItem = { ...item }; // Copia o objeto base
        return mappedItem;
    });
    
    return claimsMappedArray;
}

async function getTopServices() {
    const services = await prisma.$queryRaw`
        SELECT 
            claims."claimServiceDescription",
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value
        FROM "Claim" claims
        GROUP BY claims."claimServiceDescription"
        ORDER BY number DESC
        LIMIT 5
    ` as any[];

    return services;
}

async function getClaimsByAgeGroup() {
    const claims = await prisma.$queryRaw`
        SELECT
            claims."ageGroup",
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value
        FROM
            "Claim" claims
        GROUP BY
            claims."ageGroup"
        ORDER BY
            claims."ageGroup" ASC
    ` as any[];
    const claimsMapped = claims.map((claim) => {
        const { ageGroup, number, value } = claim;
        return {
            ageGroup,
            number: Number(number),
            value: Number(value)
        };
    });
    return claimsMapped;
}

export default async function Report() {
    const session = await auth();
    console.log(session);
    const claims = await getClaimsNumberAndValueSumByMonth();
    const claimsByPlan = await getClaimsByPlanByMonth();
    const claimsByAgeGroup = await getClaimsByAgeGroup();

    return (
        <div className="w-full">
            <div className="ml-[100px] w-[100vw - 100px] px-12">
                <div className="header py-8 flex justify-between items-center">
                    <h1 className='font-bold text-2xl text-primary-900 dark:text-white'>Relatório</h1>
                    <PrintButton element="#report" />
                </div>
                <div className="content mb-4 printable" id="report">
                    <h2 className="font-bold text-lg text-primary-900 dark:text-white mb-4">Análise Geral</h2>
                    <MonthChartBigger data={claims} />
                    <p className="indent-4 mt-6 text-sm text-text-800 dark:text-white">Os gráficos acima mostram a quantidade de sinistros por mês, separados por titular e dependente, e por gênero. Nesse contexto, esse gráfico é uma representação visual mensal, que permite a análise de tendências e comparações entre os meses.</p>
                    <MultipleBarChart data={claimsByPlan} classname="mt-8"/>
                    <p className="indent-4 mt-6 text-sm text-text-800 dark:text-white">Os gráficos acima mostram a quantidade de sinistros por mês, separados por plano. Nesse contexto, esse gráfico é uma representação visual mensal, que permite a análise de tendências e comparações entre os meses, olhando principalmente os diferentes tipos de planos.</p>
                    <AgeGroupChart classname="mt-8" data={claimsByAgeGroup}/>
                    <ServiceRanking topServices={await getTopServices()} />
                    <h2 className="font-bold text-lg text-primary-900 dark:text-white mt-8">Análise dos clusters</h2>
                    <p className="indent-4 mt-6 text-sm text-text-800 dark:text-white">Aqui você encontra uma análise dos clusters de sinistros, que são grupos de sinistros que possuem características semelhantes. Essa análise é feita com base em dados de sinistros, como valor, quantidade e outros.</p>
                    <div className="flex flex-1 gap-4 mt-4">
                        <PieChartClusters data={null} classname="flex-[0.5]"/>
                        <PieChartClustersAmount data={null} classname="flex-[0.5]"/>
                    </div>
                    <MultipleBarChartClusterCompare data={null} classname="mt-8"/>
                    <ClusterAnalyze title="Cluster 1"
                        classKey="cluster1"
                        charts={[
                            <AgePyramid data={null} key={0}/>,
                            <RadarClusterChart data={undefined} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={0} key={2}/>,
                            <LineClusterMultipleChart data={null} key={3} classname="h-full"/>,
                            <ClusterBarChartAllFilters data={null} key={4} classname="h-full"/>
                    ]} 
                        explanation="Explicação do cluster 1" 
                        kpis={[<Card key={0}>
                        <CardHeader>
                            <CardTitle>Descrição dos valores</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-1">
                            <span>Média: R$ 1.000,00</span>
                            <span>Desvio padrão: R$ 500,00</span>
                            <span>Valor total: R$ 10.000,00</span>
                            <span>Quantidade de sinistros: 10</span>
                        </CardContent>
                        </Card>, <Card key={1} className="h-full">
                            <CardHeader>
                                <CardTitle>Serviço mais utilizado</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-1">
                                <span>Consulta médica</span>
                                <span>Quantidade de sinistros: 100</span>
                                <span>Valor total: R$ 10.000,00</span>
                            </CardContent>
                        </Card>,
                        <Card key={2} className="h-full">
                            <CardHeader>
                                <CardTitle>Faixa etária mais comum</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-1">
                                <span>0-18 anos</span>
                                <span>Quantidade de sinistros: 100</span>
                                <span>Valor total: R$ 10.000,00</span>
                            </CardContent>
                        </Card>
                    ]}/>
                </div>
                
            </div>
        </div>
    );
}