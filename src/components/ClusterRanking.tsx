"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

// Mock de dados com diferentes categorias e doenças relacionadas
const mockServices = [
  { claimServiceDescription: "Consulta de Cardiologia", category: "Consulta", disease: "Cardiovascular", number: 120, value: 50000 },
  { claimServiceDescription: "Exame de Sangue", category: "Exame", disease: "Hematologia", number: 150, value: 20000 },
  { claimServiceDescription: "Cirurgia", category: "Procedimento", disease: "Ortopedia", number: 80, value: 150000 },
  { claimServiceDescription: "Consulta de Dermatologia", category: "Consulta", disease: "Dermatologia", number: 60, value: 10000 },
  { claimServiceDescription: "Terapia Física", category: "Terapia", disease: "Ortopedia", number: 100, value: 70000 }
];

export default function ServiceRankingClustered({ clusterId }: { clusterId: number }) {
  const [byValueOrder, setByValueOrder] = useState(false);
  const [filter, setFilter] = useState<"disease" | "category" | "service">("service");

  // Filtro dinâmico baseado no estado do filtro selecionado
  const filteredServices = useMemo(() => {
    const servicesCopy = [...mockServices];

    if (filter === "disease") {
      return servicesCopy.filter(service => service.disease === "Ortopedia"); // Exemplo de filtro por doença relacionada
    }
    if (filter === "category") {
      return servicesCopy.filter(service => service.category === "Consulta"); // Exemplo de filtro por categoria
    }
    return servicesCopy; // Mostra todos os serviços sem filtro específico
  }, [filter]);

  const sortedServices = useMemo(() => {
    const servicesCopy = [...filteredServices];
    if (byValueOrder) {
      // Ordena por valor
      return servicesCopy.sort((a, b) => Number(b.value) - Number(a.value));
    }
    // Ordena por número de sinistros
    return servicesCopy.sort((a, b) => Number(b.number) - Number(a.number));
  }, [byValueOrder, filteredServices]);

  const totalServices = useMemo(() => {
    return sortedServices.reduce((acc, service) => acc + Number(service.number), 0);
  }, [sortedServices]);

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
          <CardTitle>Ranking de Serviços para o Cluster {clusterId}</CardTitle>
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
        <div className="text-sm text-muted-foreground">Legenda: {legend}</div>
        {sortedServices.map((service, index) => (
          <div key={index}>
            <div className="flex items-center mb-4">
              <span className="font-semibold text-primary-900 dark:text-white mr-2">{index + 1}.</span>
              <span className="flex-1 text-sm text-text-800 dark:text-white">
                {filter === "service" ? service.claimServiceDescription : filter === "disease" ? service.disease : service.category}
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
