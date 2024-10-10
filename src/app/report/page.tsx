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
import { SuperChart } from "@/components/SuperChart";
import DescribeKpi from "@/components/DescribeKpi";
import TopServiceClusterKpi from "@/components/TopClusterKpi";
import AgeGroupKpi from "@/components/AgeGroupKpi";
import { redirect } from "next/navigation";

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

async function getAgePyramid(clusterId: number) {
    const claims = await prisma.$queryRaw`
        SELECT
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value,
            claims."ageGroup",
            claims.gender
        FROM
            "Claim" claims
        WHERE
            claims.cluster = ${clusterId}
        GROUP BY
            claims."ageGroup",
            claims.gender
        ORDER BY
            claims."ageGroup" ASC
    ` as any[];
    const mappedClaims = claims.reduce((acc: any[], claim: any) => {
        const { ageGroup, gender, number } = claim;

        // Procurar se já existe uma entrada para esse grupo etário
        let ageGroupEntry = acc.find((entry) => entry.ageGroup === ageGroup);

        // Se não houver, criar uma nova entrada para esse grupo etário
        if (!ageGroupEntry) {
            ageGroupEntry = {
                ageGroup: ageGroup,
                homem: 0,
                mulher: 0,
            };
            acc.push(ageGroupEntry);
        }

        // Mapear o número baseado no gênero
        if (gender === 'M') {
            ageGroupEntry.homem = Number(number); // Converter BigInt para Number
        } else if (gender === 'F') {
            ageGroupEntry.mulher = Number(number); // Converter BigInt para Number
        }

        return acc;
    }, []);

    return mappedClaims;
}

async function getRadarGroupChart(clusterId: number) {
    const valueGender = await prisma.$queryRaw`
        SELECT
            COUNT("id") as number,
            "gender"
        FROM "Claim"
        WHERE "cluster" = ${clusterId}
        GROUP BY "gender"
        ORDER BY number ASC
    ` as any[];
    const valueRole = await prisma.$queryRaw`
        SELECT
            COUNT("id") as number,
            "role"
        FROM "Claim"
        WHERE "cluster" = ${clusterId}
        GROUP BY "role"
        ORDER BY number ASC
    ` as any[];
    const valuesMapped:
        {
            label: string,
            value: number
        }[] = []
    valueGender.forEach((value) => {
        valuesMapped.push({
            label: value.gender === 'M' ? 'HOMENS' : 'MULHERES',
            value: parseInt(value.number)
        });
    });
    valueRole.forEach((value) => {

        if (value.role === 'DEPENDENTE' || value.role === 'AGREGADO') {
            // se for dependente ou agregado, somar no mesmo valor
            const index = valuesMapped.findIndex((item) => item.label === 'DEPENDENTE');
            if (index !== -1) {
                valuesMapped[index].value += parseInt(value.number);
            } else {
                valuesMapped.push({
                    label: 'DEPENDENTE',
                    value: parseInt(value.number)
                });
            }
        } else {
            valuesMapped.push({
                label: value.role,
                value: parseInt(value.number)
            });
        }
    });
    console.log(valuesMapped);
    return valuesMapped;
}

async function getClusterRanking(clusterId: number) {
    const services = await prisma.$queryRaw`
        SELECT 
            claims."claimServiceDescription" as label,
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value
        FROM "Claim" claims
        WHERE claims.cluster = ${clusterId}
        GROUP BY claims."claimServiceDescription"
        ORDER BY number DESC
        LIMIT 5
    ` as any[];
    const relatedDiseases = await prisma.$queryRaw`
        SELECT 
            claims."relatedDisease" as label,
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value
        FROM "Claim" claims
        WHERE claims.cluster = ${clusterId}
        GROUP BY claims."relatedDisease"
        ORDER BY number DESC
        LIMIT 5
    ` as any[];

    const categories = await prisma.$queryRaw`
        SELECT 
            claims."claimServiceCategory" as label,
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value
        FROM "Claim" claims
        WHERE claims.cluster = ${clusterId}
        GROUP BY claims."claimServiceCategory"
        ORDER BY number DESC
        LIMIT 5
    ` as any[];

    return {
        services,
        relatedDiseases,
        categories
    };
}

async function getClusterDistribution() {
    const clustersDescribe = await prisma.$queryRaw`
        SELECT
            COUNT(claims.id) as number,
            SUM(claims."claimAmount") as value,
            claims.cluster
        FROM
            "Claim" claims
        GROUP BY
            claims.cluster
    ` as any[];
    // convertendo os bigint para number
    clustersDescribe.forEach((cluster, index) => {
        cluster.number = parseInt(cluster.number);
        cluster.value = parseInt(cluster.value);
        cluster.fill = `hsl(var(--chart-${index + 1}))`
    });
    return clustersDescribe;
}

async function getClusterByMonth() {
    const clusters = await prisma.$queryRaw`
        SELECT
            TO_CHAR("claimDate", 'YYYY-MM') as month,
            COUNT("id") as number,
            SUM("claimAmount") as value,
            "cluster"
        FROM "Claim"
        GROUP BY TO_CHAR("claimDate", 'YYYY-MM'), "cluster"
        ORDER BY TO_CHAR("claimDate", 'YYYY-MM')
    ` as any[];

    // Mapeando os clusters para a estrutura esperada pelo gráfico
    const clustersMapped = clusters.reduce((acc, cluster) => {
        const { month, number, value, cluster: clusterId } = cluster;

        // Se o mês ainda não foi adicionado, inicializamos um objeto para ele
        if (!acc[month]) {
            acc[month] = {
                date: month,
                cluster_0: { number: 0, value: 0 },
                cluster_1: { number: 0, value: 0 },
                cluster_2: { number: 0, value: 0 },
                cluster_3: { number: 0, value: 0 },
                cluster_4: { number: 0, value: 0 },
                cluster_5: { number: 0, value: 0 },
            };
        }

        // Mapear o clusterId para o nome correto (cluster_0, cluster_1, etc.)
        acc[month][`cluster_${clusterId}`] = {
            number: Number(number),
            value: Number(value),
        };

        return acc;
    }, {} as Record<string, any>);

    // Converter o objeto para um array de meses com os clusters aninhados
    const formattedData = Object.values(clustersMapped);

    console.log(formattedData);
    return formattedData;
}

export default async function Report() {
    const session = await auth();
    console.log(session);
    if (!session) {
        redirect('/access-denied');
    }
    const claims = await getClaimsNumberAndValueSumByMonth();
    const claimsByPlan = await getClaimsByPlanByMonth();
    const claimsByAgeGroup = await getClaimsByAgeGroup();
    const clustersDistribution = await getClusterDistribution();
    const clustersByMonth = await getClusterByMonth();

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
                        <PieChartClusters data={clustersDistribution} classname="flex-[0.5]"/>
                        <PieChartClustersAmount data={clustersDistribution} classname="flex-[0.5]"/>
                    </div>
                    <MultipleBarChartClusterCompare data={clustersByMonth} classname="mt-8"/>
                    <ClusterAnalyze title="Cluster 1"
                        classKey="cluster0"
                        charts={[
                            <AgePyramid data={await getAgePyramid(0)} key={0} />,
                            <RadarClusterChart data={await getRadarGroupChart(0)} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={0} key={2} data={await getClusterRanking(0)}/>,
                            <SuperChart key={4} classname="h-full" clusterId={0}/>
                    ]} 
                        explanation="Explicação do cluster 1" 
                        kpis={[
                            <DescribeKpi clusterId={0} key={0}/>,
                            <TopServiceClusterKpi clusterId={0} key={1}/>,
                            <AgeGroupKpi clusterId={0} key={2}/>
                    ]}/>
                    <ClusterAnalyze title="Cluster 2"
                        classKey="cluster1"
                        charts={[
                            <AgePyramid data={await getAgePyramid(1)} key={0} />,
                            <RadarClusterChart data={await getRadarGroupChart(1)} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={1} key={2} data={await getClusterRanking(1)}/>,
                            <SuperChart key={4} classname="h-full" clusterId={1}/>
                    ]} 
                        explanation="Explicação do cluster 2" 
                        kpis={[
                            <DescribeKpi clusterId={1} key={0}/>,
                            <TopServiceClusterKpi clusterId={1} key={1}/>,
                            <AgeGroupKpi clusterId={1} key={2}/>
                    ]}/>
                    <ClusterAnalyze title="Cluster 3"
                        classKey="cluster2"
                        charts={[
                            <AgePyramid data={await getAgePyramid(2)} key={0} />,
                            <RadarClusterChart data={await getRadarGroupChart(2)} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={2} key={2} data={await getClusterRanking(2)}/>,
                            <SuperChart key={4} classname="h-full" clusterId={2}/>
                    ]} 
                        explanation="Explicação do cluster 3" 
                        kpis={[
                            <DescribeKpi clusterId={2} key={0}/>,
                            <TopServiceClusterKpi clusterId={2} key={1}/>,
                            <AgeGroupKpi clusterId={2} key={2}/>
                    ]}/>
                    <ClusterAnalyze title="Cluster 4"
                        classKey="cluster3"
                        charts={[
                            <AgePyramid data={await getAgePyramid(3)} key={0} />,
                            <RadarClusterChart data={await getRadarGroupChart(3)} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={3} key={2} data={await getClusterRanking(3)}/>,
                            <SuperChart key={4} classname="h-full" clusterId={3}/>
                    ]} 
                        explanation="Explicação do cluster 4" 
                        kpis={[
                            <DescribeKpi clusterId={3} key={0}/>,
                            <TopServiceClusterKpi clusterId={3} key={1}/>,
                            <AgeGroupKpi clusterId={3} key={2}/>
                    ]}/>
                    <ClusterAnalyze title="Cluster 5"
                        classKey="cluster4"
                        charts={[
                            <AgePyramid data={await getAgePyramid(4)} key={0} />,
                            <RadarClusterChart data={await getRadarGroupChart(4)} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={4} key={2} data={await getClusterRanking(4)}/>,
                            <SuperChart key={4} classname="h-full" clusterId={4}/>
                    ]} 
                        explanation="Explicação do cluster 5" 
                        kpis={[
                            <DescribeKpi clusterId={4} key={0}/>,
                            <TopServiceClusterKpi clusterId={4} key={1}/>,
                            <AgeGroupKpi clusterId={4} key={2}/>
                    ]}/>
                    <ClusterAnalyze title="Cluster 6"
                        classKey="cluster5"
                        charts={[
                            <AgePyramid data={await getAgePyramid(5)} key={0} />,
                            <RadarClusterChart data={await getRadarGroupChart(5)} key={1} classname="h-full"/>,
                            <ServiceRankingClustered clusterId={5} key={2} data={await getClusterRanking(5)}/>,
                            <SuperChart key={4} classname="h-full" clusterId={5}/>
                    ]} 
                        explanation="Explicação do cluster 6" 
                        kpis={[
                            <DescribeKpi clusterId={5} key={0}/>,
                            <TopServiceClusterKpi clusterId={5} key={1}/>,
                            <AgeGroupKpi clusterId={5} key={2}/>
                    ]}/>
                </div>
                
            </div>
        </div>
    );
}