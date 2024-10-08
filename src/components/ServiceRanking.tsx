"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

export default function ServiceRanking({ topServices }: { topServices: any[] }) {
    const [byValueOrder, setByValueOrder] = useState(false);

    const sortedServices = useMemo(() => {
        const servicesCopy = [...topServices];
        if (byValueOrder) {
            // Ordena por valor
            return servicesCopy.sort((a, b) => Number(b.value) - Number(a.value));
        }
        // Ordena por número de sinistros
        return servicesCopy.sort((a, b) => Number(b.number) - Number(a.number));
    }, [byValueOrder, topServices]);

    const totalServices = useMemo(() => {
        return topServices.reduce((acc, service) => acc + Number(service.number), 0);
    }, [topServices]);

    useEffect(() => {
        console.log(sortedServices);
    }, [sortedServices]);

    return (
        <Card className="w-full mt-10">
            <CardHeader className="flex w-full flex-row">
                <div className="flex gap-1 flex-col flex-1">
                    <CardTitle>Ranking de serviços mais utilizados</CardTitle>
                    <CardDescription>Os gráficos abaixo mostram os 5 serviços mais utilizados pelos segurados, com base nos sinistros registrados.</CardDescription>
                </div>
                <div>
                    <Button
                        className="bg-transparent hover:opacity-90 hover:bg-transparent gap-3 dark:text-white text-black"
                        onClick={() => setByValueOrder(!byValueOrder)}
                    >
                        <ArrowUpDown size={16} />
                        {byValueOrder ? "Ordenar por quantidade" : "Ordenar por valor"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="mt-4 gap-4 flex flex-col">
                {sortedServices.map((service, index) => (
                    <div key={index}>
                        <div className="flex items-center mb-4">
                            <span className="font-semibold text-primary-900 dark:text-white mr-2">{index + 1}.</span>
                            <span className="flex-1 text-sm text-text-800 dark:text-white">
                                {service.claimServiceDescription}
                            </span>
                            <div className="flex flex-col">
                                <span className="font-semibold text-primary-900 dark:text-white ml-4">
                                    {Number(service.number).toString()} SINISTROS
                                </span>
                                <span className="font-semibold text-primary-900 dark:text-white ml-4 text-xs">
                                    Valor total:{" "}
                                    {Number(service.value).toLocaleString("pt-br", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </span>
                            </div>
                        </div>
                        <Progress
                            value={Math.round((Number(service.number) / totalServices) * 100)} // Arredondando para evitar frações
                            className="my-2"
                            innerColor="bg-green-900 dark:bg-green-500"
                            outColor="bg-gray-100 dark:bg-green-800/30"
                        />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
