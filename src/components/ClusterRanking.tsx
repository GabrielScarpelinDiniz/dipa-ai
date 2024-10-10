"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

export default function ServiceRankingClustered({ clusterId, data }: { clusterId: number, data: any }) {
  const [rankingData, setRankingData] = useState(data.services);
  const [filter, setFilter] = useState<"disease" | "category" | "service">("service");
  const [totalServices, setTotalServices] = useState(0);
  useEffect(() => {
    if (filter === "service") {
      setRankingData(data.services);
      setTotalServices(data.services.reduce((acc: number, service: { number: number }) => acc + parseInt(service.number as any), 0));
      return;
    }
    else if (filter === "disease") {
      setRankingData(data.relatedDiseases);
      setTotalServices(data.relatedDiseases.reduce((acc: number, disease: { number: number }) => acc + parseInt(disease.number as any), 0));
      return;
    }
    setRankingData(data.categories);
    setTotalServices(data.categories.reduce((acc: number, category: { number: number }) => acc + parseInt(category.number as any), 0));
  }, [filter])

  const legend = useMemo(() => {
    switch (filter) {
      case "disease":
        return "Doença Relacionada";
      case "category":
        return "Categoria do Serviço";
      default:
        return "Descrição do Serviço";
    }
  }, [filter]);

  return (
    <Card className="w-full">
      <CardHeader className="flex w-full flex-col">
        <div className="flex gap-1 flex-col flex-1">
          <CardTitle>Ranking para o Cluster {clusterId + 1}</CardTitle>
          <CardDescription>Filtre e ordene os serviços mais utilizados neste cluster.</CardDescription>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Botões para alterar o filtro */}
          <Button onClick={() => setFilter("service")} variant={filter === "service" ? "default" : "outline"}>
            Serviço
          </Button>
          <Button onClick={() => setFilter("disease")} variant={filter === "disease" ? "default" : "outline"}>
            Doenças Relacionadas
          </Button>
          <Button onClick={() => setFilter("category")} variant={filter === "category" ? "default" : "outline"}>
            Categoria
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-4 gap-4 flex flex-col">
        <div className="text-sm text-muted-foreground">Legenda: {legend}</div>
        {rankingData.map((service: { label: string, number: number, value: number}, index: number) => (
          <div key={index}>
            <div className="flex items-center mb-4">
              <span className="font-semibold text-primary-900 dark:text-white mr-2">{index + 1}.</span>
              <span className="flex-1 text-sm text-text-800 dark:text-white">
                {service.label}
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
