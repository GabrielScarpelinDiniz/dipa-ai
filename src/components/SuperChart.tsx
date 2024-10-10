"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Limite inicial de opções exibidas
const INITIAL_LIMIT = 10;

interface FiltersConfig {
    [key: string]: {
        label: string;
        options: string[];
    };
}

export function SuperChart({ classname, clusterId }: { classname?: string, clusterId: number }) {
  const [activeChart, setActiveChart] = useState<"number" | "total">("number");
  const [absoluteOrMean, setAbsoluteOrMean] = useState<"absolute" | "mean">("absolute");
  const [mainChart, setMainChart] = useState<Record<string, number>[]>([]);
  const [compareChart, setCompareChart] = useState<Record<string, number>[]>([]);
  const [isCompareChart, setIsCompareChart] = useState(false);
  const [filtersConfig, setFiltersConfig] = useState<FiltersConfig | never>({});
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [chartData, setChartData] = useState<Record<string, number>[]>([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedValues, setSelectedValues] = useState({
    faixaEtaria: "",
    doencaRelacionada: "",
    categoriaServico: "",
    descricaoServico: "",
    generoServico: "",
    elegibilidade: "",
    tipoPlano: "",
  });

  const [selectedValues2, setSelectedValues2] = useState({
    faixaEtaria: "",
    doencaRelacionada: "",
    categoriaServico: "",
    descricaoServico: "",
    generoServico: "",
    elegibilidade: "",
    tipoPlano: "",
  });

  // Estados separados para controlar visibilidade de cada grupo
  const [visibleDescricaoServicoOptions, setVisibleDescricaoServicoOptions] = useState<string[]>([]);
  const [currentLimit, setCurrentLimit] = useState(INITIAL_LIMIT);

  useEffect(() => {
    fetch("/api/filters-superchart")
      .then((response) => response.json())
      .then((data) => {
        setFiltersConfig(data.filters);
        setLoadingFilters(false);
        
        // Inicialmente mostramos o número limitado de opções de descricaoServico
        const initialDescricaoOptions = data.filters.descricaoServico?.options.slice(0, INITIAL_LIMIT) || [];
        setVisibleDescricaoServicoOptions(initialDescricaoOptions);
      });
  }, []);

  useEffect(() => {
    // Atualizar o gráfico toda vez que os filtros forem alterados
    fetch(`/api/superchart?cluster=${clusterId}&${new URLSearchParams(selectedValues).toString()}`, {
      cache: "no-cache",
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setMainChart(data.claims);
      });
  }, [selectedValues]);

  const handleSelectSecondChart = (groupKey: string, option: string) => {
    setSelectedValues2((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey as keyof typeof selectedValues2] === option ? "" : option,
    }));
  };

  useEffect(() => {
    // Atualizar o gráfico toda vez que os filtros forem alterados
    if (isCompareChart) {
      fetch(`/api/superchart?cluster=${clusterId}&${new URLSearchParams(selectedValues2).toString()}`, {
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((data) => {
          setCompareChart(data.claims);
        });
    }
  }, [selectedValues2, isCompareChart]);

  const mergeChart = () => {
    if (!isCompareChart){
      setChartData(mainChart);
      return;
    }
    if (compareChart && compareChart.length > 0 && isCompareChart){
      // Comparar os dados dos dois gráficos
      if (mainChart.length > compareChart.length) {
        const comparedData = mainChart.map((item, index) => ({
          ...item,
          number2: compareChart[index]?.number || 0,
          total2: compareChart[index]?.total || 0,
          averageAmount2: compareChart[index]?.averageAmount || 0,
        }));
        setChartData(comparedData);
      } else {
        const comparedData = compareChart.map((item, index) => ({
          number: mainChart[index]?.number || 0,
          total: mainChart[index]?.total || 0,
          averageAmount: mainChart[index]?.averageAmount || 0,
          number2: item?.number,
          total2: item?.total,
          averageAmount2: item?.averageAmount,
          month: item?.month,
        }));
        setChartData(comparedData);
      }
    } else {
      setChartData(mainChart);
    } 
  }

  useEffect(() => {
    mergeChart();
  }, [compareChart, mainChart]);

  const handleSelect = (groupKey: string, option: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey as keyof typeof selectedValues] === option ? "" : option,
    }));
  };

  // Carregar mais para descricaoServico
  const handleLoadMoreDescricao = () => {
    const nextLimit = currentLimit + INITIAL_LIMIT;
    const nextOptions = filtersConfig.descricaoServico?.options.slice(0, nextLimit) || [];
    setVisibleDescricaoServicoOptions(nextOptions);
    setCurrentLimit(nextLimit);
  };


  const chartConfig = {
    number: {
      label: "Quantidade",
      color: "hsl(var(--chart-3))",
    },
    total: {
      label: "Valor",
      color: "hsl(var(--chart-4))",
    },
    number2: {
      label: "Quantidade",
      color: "hsl(var(--chart-5))",
    },
    total2: {
      label: "Valor",
      color: "hsl(var(--chart-6))",
    },
    averageAmount: {
      label: "Média",
      color: "hsl(var(--chart-7))",
    },
    averageAmount2: {
      label: "Média",
      color: "hsl(var(--chart-8))",
    },
  } satisfies ChartConfig;


  useEffect(() => {
    console.log(chartData);
  }, [chartData])



  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Relatório do cluster</CardTitle>
          <CardDescription>
            Mostrando a análise de sinistros no mês com diversos filtros. <br />Os dados mostrados na direita se referem SEMPRE ao gráfico principal (1).
          </CardDescription>
        </div>
        <div className="flex">
        {["number", "total"].map((key) => {
            const chart = key as "number" | "total";
            return (
            <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart as "number" | "total")}
            >
                <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-xl">
                    {chart === "total" ? Number(chartData.reduce((acc: any, item: any) => acc + item[chart], 0)).toLocaleString("pt-br", { style: "currency", currency: "BRL"}) : chartData.reduce((acc: any, item: any) => acc + item[chart], 0)}
                </span>
            </button>
            )
        })}
        </div>
      </CardHeader>

      {/* Filtros */}
      <CardContent className="py-5 flex gap-16">
        <div className="my-auto">
          <h3 className="text-lg font-semibold">Filtros 1</h3>
          <div className="flex gap-4 mt-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[300px] justify-between"
                >
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px",
                    }}
                  >
                    {Object.values(selectedValues).some((val) => val)
                      ? `Selecionado: ${Object.entries(selectedValues)
                          .filter(([key, value]) => value)
                          .map(([key, value]) => `${value}`)
                          .join(", ")}`
                      : "Selecione os filtros..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar opções..." />
                  <CommandList>
                    <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>

                    {Object.keys(filtersConfig).map((groupKey) => (
                      <CommandGroup key={groupKey} heading={filtersConfig[groupKey as keyof typeof filtersConfig].label}>
                        {groupKey === 'descricaoServico' ? (
                          // Limitar visibilidade de descricaoServico
                          visibleDescricaoServicoOptions.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={() => handleSelect(groupKey, option)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedValues[groupKey as keyof typeof selectedValues] === option
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option}
                            </CommandItem>
                          ))
                        ) : (
                          // Mostrar todas as opções dos outros grupos
                          filtersConfig[groupKey as keyof typeof filtersConfig].options.map((option) => (
                            <CommandItem
                              key={option}
                              value={option}
                              onSelect={() => handleSelect(groupKey, option)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedValues[groupKey as keyof typeof selectedValues] === option
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    ))}

                    {/* Botão para carregar mais opções de descricaoServico */}
                    {visibleDescricaoServicoOptions.length < filtersConfig.descricaoServico?.options.length && (
                      <div className="p-2">
                        <Button variant="link" onClick={handleLoadMoreDescricao}>
                          Carregar mais
                        </Button>
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="my-auto">
          { isCompareChart ? (
            <>
              <h3 className="text-lg font-semibold">Filtros 2</h3>
              <div className="flex gap-4 mt-2">
                <Popover open={open2} onOpenChange={setOpen2}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open2}
                      className="w-[300px] justify-between"
                    >
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                      >
                        {Object.values(selectedValues2).some((val) => val)
                          ? `Selecionado: ${Object.entries(selectedValues2)
                              .filter(([key, value]) => value)
                              .map(([key, value]) => `${value}`)
                              .join(", ")}`
                          : "Selecione os filtros..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar opções..." />
                      <CommandList>
                        <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>

                        {Object.keys(filtersConfig).map((groupKey) => (
                          <CommandGroup key={groupKey} heading={filtersConfig[groupKey as keyof typeof filtersConfig].label}>
                            {groupKey === 'descricaoServico' ? (
                              // Limitar visibilidade de descricaoServico
                              visibleDescricaoServicoOptions.map((option) => (
                                <CommandItem
                                  key={option}
                                  value={option}
                                  onSelect={() => handleSelectSecondChart(groupKey, option)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedValues2[groupKey as keyof typeof selectedValues2] === option
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option}
                                </CommandItem>
                              ))
                            ) : (
                              // Mostrar todas as opções dos outros grupos
                              filtersConfig[groupKey as keyof typeof filtersConfig].options.map((option) => (
                                <CommandItem
                                  key={option}
                                  value={option}
                                  onSelect={() => handleSelectSecondChart(groupKey, option)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedValues2[groupKey as keyof typeof selectedValues2] === option
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option}
                                </CommandItem>
                              ))
                            )}
                          </CommandGroup>
                        ))}

                        {/* Botão para carregar mais opções de descricaoServico */}
                        {visibleDescricaoServicoOptions.length < filtersConfig.descricaoServico?.options.length && (
                          <div className="p-2">
                            <Button variant="link" onClick={handleLoadMoreDescricao}>
                              Carregar mais
                            </Button>
                          </div>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button className="bg-transparent shadow-none text-primary-900 font-bold hover:bg-slate-200 dark:text-white hover:dark:bg-slate-900 flex items-center justify-center gap-2" onClick={() => setIsCompareChart(false)}><PlusCircle size={18} />Remover gráfico 2</Button>
              </div>
            </>
          ) : 
            <Button className="bg-transparent shadow-none text-primary-900 font-bold hover:bg-slate-200 dark:text-white hover:dark:bg-slate-900 flex items-center justify-center gap-2" onClick={() => setIsCompareChart(true)}><PlusCircle size={18} />Adicionar gráfico 2</Button>  
          }
        </div>
      </CardContent>
      <Separator />

      {/* Gráfico */}
      <CardContent className="px-2 sm:p-6">
        {/* Conteúdo do gráfico */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-br", {
                  month: "short",
                  year: "numeric", 
                })
              }}
              
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
            content={
                <ChartTooltipContent
                  className="min-w-[150px] max-w-[300px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-br", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar  dataKey={(() => {
              if (activeChart === "number") {
                return "number"
              }
              if (absoluteOrMean === "absolute") {
                return "total"
              }
              return "averageAmount"
            })()} fill={`var(--color-${activeChart})`} />


            { isCompareChart ? <Bar dataKey={(() => {
              if (activeChart === "number") {
                return "number2"
              }
              if (absoluteOrMean === "absolute") {
                return "total2"
              }
              return "averageAmount2"
            })()} fill={`var(--color-${(() => {
              if (activeChart === "number") {
                return "number2"
              }
              if (absoluteOrMean === "absolute") {
                return "total2"
              }
              return "averageAmount2"
            })()})`} /> : null }
          </BarChart>
        </ChartContainer>
      </CardContent>

      {/* Botões para alternar entre valor, quantidade, e média */}
      <CardContent>
        <div className="flex justify-center gap-4">
          {activeChart === "total" ? ["absolute", "mean"].map((key) => (
            <button
              key={key}
              className={`px-4 py-2 text-sm font-medium ${absoluteOrMean === key ? "bg-gray-200" : ""}`}
              onClick={() => setAbsoluteOrMean(key as "absolute" | "mean")}
            >
              {key === "absolute" ? "Valor total" : "Média"}
            </button>
          )) : null}
        </div>
      </CardContent>
    </Card>
  );
}
