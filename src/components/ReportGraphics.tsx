"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis, YAxis } from "recharts"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "./ui/separator";
import { TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";

export function MonthChartBigger({ data, classname} : { data: any, classname?: string}) {
    const chartConfig = {
        dependente: {
          label: "Dependentes",
          color: "hsl(var(--chart-dependente))",
        },
        titular: {
          label: "Titulares",
          color: "hsl(var(--chart-titular))",
        },
        homens: {
          label: "Homens",
          color: "hsl(var(--chart-men))",
        },
        mulheres: {
          label: "Mulheres",
          color: "hsl(var(--chart-women))",
        },
    } satisfies ChartConfig
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("titular")


    useEffect(() => {
        console.log(activeChart)
    }, [activeChart])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Quantidade no mês</CardTitle>
          <CardDescription>
            Mostrando a quantidade de beneficiários por mês em toda a base de dados
          </CardDescription>
        </div>
        <div className="flex">
        {["titular", "dependente", "homens", "mulheres"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
            <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
            >
                <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-xl">
                    {data.reduce((acc: any, item: any) => acc + item[chart], 0)}
                </span>
            </button>
            )
        })}
        </div>
        
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return String(value)
              }}
            />
            <YAxis tickLine={false} tickMargin={2} axisLine={false} tickFormatter={(value) => {
                return Number(value).toLocaleString("pt-br")
            }}/>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="Total"
                  formatter={(value, name, item) => {
                    // o nome do payload é valor + nome da chave com a primeira letra maiúscula
                    const valuePayloadAccessor = `valor${String(name).charAt(0).toUpperCase()}${String(name).slice(1)}`
                    return (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="text-xs text-muted-foreground">
                                {name}:{" "}
                                </div>
                                <div className="text-xs font-bold">
                                {value}
                                </div>
                            </div>
                            <div>
                                <p>Valor: {Number(item.payload[valuePayloadAccessor]).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</p>
                            </div>
                        </div>
                    )
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} radius={4}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function MultipleBarChart({ data, classname} : { data: any, classname?: string}) {
    const [activeChart, setActiveChart] = useState<"count" | "amount">("count")
    const [mainChart , setMainChart] = useState<"TNE1" | "TN1E" | "TNQ2" | "8XTP" | "TQN2" | "TP8X" | "NP6X" | "NP2X" | "QNR6">("TNE1")
    const [compareChart, setCompareChart] = useState<"TNE1" | "TN1E" | "TNQ2" | "8XTP" | "TQN2" | "TP8X" | "NP6X" | "NP2X" | "QNR6" | undefined>(undefined)
    const [chartData, setChartData] = useState(data)
    useEffect(() => {
        if (activeChart === "count") {
            setChartData(data.map((item: any) => {
                return {
                    month: item.date,
                    NP6X: item.NP6X ? item.NP6X.number : 0,
                    NP2X: item.NP2X ? item.NP2X.number : 0,
                    QNR6: item.QNR6 ? item.QNR6.number : 0,
                    TNE1: item.TNE1 ? item.TNE1.number : 0,
                    TN1E: item.TN1E ? item.TN1E.number : 0,
                    TNQ2: item.TNQ2 ? item.TNQ2.number : 0,
                    '8XTP': item['8XTP'] ? item['8XTP'].number : 0,
                    TQN2: item.TQN2 ? item.TQN2.number : 0,
                    TP8X: item.TP8X ? item.TP8X.number : 0,
                }
            }))
        }
        else {
            setChartData(data.map((item: any) => {
                return {
                    month: item.date,
                    NP6X: item.NP6X ? item.NP6X.value : 0,
                    NP2X: item.NP2X ? item.NP2X.value : 0,
                    QNR6: item.QNR6 ? item.QNR6.value : 0,
                    TNE1: item.TNE1 ? item.TNE1.value : 0,
                    TN1E: item.TN1E ? item.TN1E.value : 0,
                    TNQ2: item.TNQ2 ? item.TNQ2.value : 0,
                    '8XTP': item['8XTP'] ? item['8XTP'].value : 0,
                    TQN2: item.TQN2 ? item.TQN2.value : 0,
                    TP8X: item.TP8X ? item.TP8X.value : 0,
                }
            }))
        }
    }, [activeChart])
    useEffect(() => {
        console.log(chartData)
    }, [chartData])
    useEffect(() => {
        console.log(mainChart)
    }, [mainChart])
    const chartConfig = {
        "NP6X": {
            label: "NP6X",
            color: "hsl(var(--chart-NP6X))",
        },
        "NP2X": {
            label: "NP2X",
            color: "hsl(var(--chart-NP2X))",
        },
        "QNR6": {
            label: "QNR6",
            color: "hsl(var(--chart-QNR6))",
        },
        "TNE1": {
            label: "TNE1",
            color: "hsl(var(--chart-TNE1))",
        },
        "TN1E": {
            label: "TN1E",
            color: "hsl(var(--chart-TN1E))",
        },
        "TNQ2": {
            label: "TNQ2",
            color: "hsl(var(--chart-TNQ2))",
        },
        "8XTP": {
            label: "8XTP",
            color: "hsl(var(--chart-8XTP))",
        },
        "TQN2": {
            label: "TQN2",
            color: "hsl(var(--chart-TQN2))",
        },
        "TP8X": {
            label: "TP8X",
            color: "hsl(var(--chart-TP8X))",
        },
    } satisfies ChartConfig
    return (
        <Card className={classname}>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="py-6 flex-1 px-6">
                <CardTitle>Comparação de planos</CardTitle>
                <CardDescription>Todo o banco de dados</CardDescription>
            </div>
            <div className="flex items-center justify-center gap-4 px-4">
                <div className="flex h-full items-center justify-center gap-2">
                    <p className="text-sm">Gráfico: </p>
                    <Select onValueChange={(value) => {
                        setMainChart(value as keyof typeof chartConfig)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Gráfico principal" />
                        </SelectTrigger>
                        <SelectContent>
                            { Object.keys(chartConfig).map((key) => {
                                const chart = key as keyof typeof chartConfig
                                return (
                                    <SelectItem key={chart} value={chart}>
                                        {chartConfig[chart].label}
                                    </SelectItem>
                                )
                            })}
                            
                        </SelectContent>
                    </Select>

                </div>
                <div className="flex h-full items-center justify-center gap-2">
                    <p className="text-sm">Comparar: </p>
                    <Select onValueChange={(value) => {
                        setCompareChart(value as keyof typeof chartConfig)
                    }} value={compareChart || ""}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Comparar gráficos" />
                        </SelectTrigger>
                        <SelectContent>
                            { Object.keys(chartConfig).map((key) => {
                                const chart = key as keyof typeof chartConfig
                                return (
                                    <SelectItem key={chart} value={chart}>
                                        {chartConfig[chart].label}
                                    </SelectItem>
                                )
                            })}
                            <Button
                            className="w-full px-2"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation()
                                setCompareChart(undefined)
                            }}
                            >
                            Limpar
                            </Button>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex">
                <button
                    data-active={activeChart === "count"}
                    className="flex items-center justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 h-full"
                    onClick={() => setActiveChart("count")}
                >
                    <span className="text-xs text-muted-foreground">Quantidade</span>
                </button>
                <button
                    data-active={activeChart === "amount"}
                    className="flex items-center justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart("amount")}
                >
                    <span className="text-xs text-muted-foreground">Valor</span>
                </button>
            </div>
            
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{
                left: 12,
                right: 12,
                }}>
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                />
                <YAxis tickLine={false} tickMargin={2} axisLine={false} tickFormatter={(value) => {
                  return Number(value).toLocaleString("pt-br")
                }}/>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey={mainChart} fill={`var(--color-${mainChart})`} radius={4} />
                { compareChart && <Bar dataKey={compareChart} fill={`var(--color-${compareChart})`}radius={4} />}
            </BarChart>
            </ChartContainer>
        </CardContent>
        </Card>
    )
}

export function AgeGroupChart({ data, classname }: { data: any, classname?: string }) {
    const chartConfig = {
        agegroup: {
            label: "Faixa Etária",
            color: "hsl(var(--chart-5))",
        },
    } satisfies ChartConfig;
  
    const [activeChart, setActiveChart] = useState<"value"|"number">("value");
  
    useEffect(() => {
      console.log(activeChart);
    }, [activeChart]);
  
    return (
      <Card className={classname}>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Distribuição por Faixa Etária</CardTitle>
            <CardDescription>
              Mostrando a distribuição de beneficiários por faixa etária.
            </CardDescription>
          </div>
          <div className="flex">
                <button
                    data-active={activeChart === "number"}
                    className="flex items-center justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 h-full"
                    onClick={() => setActiveChart("number")}
                >
                    <span className="text-xs text-muted-foreground">Quantidade</span>
                </button>
                <button
                    data-active={activeChart === "value"}
                    className="flex items-center justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart("value")}
                >
                    <span className="text-xs text-muted-foreground">Valor</span>
                </button>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={data}

              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="ageGroup"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => String(value)}
              />
              <YAxis tickLine={false} tickMargin={2} axisLine={false} tickFormatter={(value) => {
                return Number(value).toLocaleString("pt-br")
              }}/>
              <ChartTooltip
                content={<ChartTooltipContent className="w-[190px]" />}
                formatter={(value, name, item) => {
                    console.log(item)
                    return (
                        <div>
                            <div className="flex gap-2">
                                <div className="text-xs text-muted-foreground">
                                Quantidade: 
                                </div>
                                <div className="text-xs font-bold">
                                {item.payload.number}
                                </div>
                            </div>
                            <div className="mt-2">
                                <p>Valor: {Number(item.payload.value).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</p>
                            </div>
                        </div>
                    )
                }}
              />
              <Bar dataKey={activeChart} fill={`hsl(var(--chart-titular))`} radius={4}/>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

export function PieChartClusters({ data, classname } : { data: any, classname?: string}) {
    const chartConfig = {
      0: {
        label: "Cluster 0",
        color: "hsl(var(--chart-1))",
      },
      1: {
        label: "Cluster 1",
        color: "hsl(var(--chart-2))",
      },
      2: {
        label: "Cluster 2",
        color: "hsl(var(--chart-3))",
      },
      3: {
        label: "Cluster 3",
        color: "hsl(var(--chart-4))",
      },
      4: {
        label: "Cluster 4",
        color: "hsl(var(--chart-5))",
      },
      5: {
        label: "Cluster 5",
        color: "hsl(var(--chart-6))",
      },
    } satisfies ChartConfig;

    const chartData = data || [
      {
        cluster: 0,
        number: 100,
        fill: "hsl(var(--chart-1))",
      },
      {
        cluster: 1,
        number: 200,
        fill: "hsl(var(--chart-2))",
      },
      {
        cluster: 2,
        number: 300,
        fill: "hsl(var(--chart-3))",
      },
      {
        cluster: 3,
        number: 400,
        fill: "hsl(var(--chart-4))",
      },
      {
        cluster: 4,
        number: 500,
        fill: "hsl(var(--chart-5))",
      },
      {
        cluster: 5,
        number: 600,
        fill: "hsl(var(--chart-6))",
      },
    ]

    return (
      <Card className={classname}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição dos grupos</CardTitle>
        <CardDescription>Toda a base de dados</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto my-2 max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="number" label={(item) => {
              return Number(item.value).toLocaleString("pt-br")
            }} nameKey="cluster" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Esse gráfico mostra a distribuição dos grupos na base de dados.
        </div>
      </CardFooter>
    </Card>
    )
}

export function PieChartClustersAmount({ data, classname } : { data: any, classname?: string}) {
  const chartConfig = {
    "0": {
      label: "Cluster 0",
      color: "hsl(var(--chart-1))",
    },
    "1": {
      label: "Cluster 1",
      color: "hsl(var(--chart-2))",
    },
    "2": {
      label: "Cluster 2",
      color: "hsl(var(--chart-3))",
    },
    "3": {
      label: "Cluster 3",
      color: "hsl(var(--chart-4))",
    },
    "4": {
      label: "Cluster 4",
      color: "hsl(var(--chart-5))",
    },
    "5": {
      label: "Cluster 5",
      color: "hsl(var(--chart-6))",
    },
  } satisfies ChartConfig;

  const chartData = data || [
    {
      cluster: "0",
      value: 10000,
      fill: "hsl(var(--chart-1))",
    },
    {
      cluster: "1",
      value: 20000,
      fill: "hsl(var(--chart-2))",
    },
    {
      cluster: "2",
      value: 30000,
      fill: "hsl(var(--chart-3))",
    },
    {
      cluster: "3",
      value: 40000,
      fill: "hsl(var(--chart-4))",
    },
    {
      cluster: "4",
      value: 50000,
      fill: "hsl(var(--chart-5))",
    },
    {
      cluster: "5",
      value: 60000,
      fill: "hsl(var(--chart-6))",
    },
  ]

  return (
    <Card className={classname}>
    <CardHeader className="items-center pb-0">
      <CardTitle>Distribuição dos valores entre os grupos</CardTitle>
      <CardDescription>Toda a base de dados</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto my-2 max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} formatter={(value, name, item) => {
            console.log(" item e name ", item, name)
              return (
                  <div>
                      <div className="flex gap-2 items-center">
                          <div className={`w-2 h-2 rounded-[2px] bg-[${item.payload.fill}]`} />
                          <div className="text-xs text-muted-foreground">  
                            {chartConfig[name as keyof typeof chartConfig].label}
                          </div>
                      </div>
                      <div className="mt-2">
                          <p>Valor total: {Number(item.payload.value).toLocaleString("pt-br", { currency: "BRL", style: "currency"})}</p>
                      </div>
                  </div>
              )
          }}/>
          <Pie data={chartData} dataKey="value" label={(item) => {
            return Number(item.value).toLocaleString("pt-br", { style: "currency", currency: "BRL" })
          }} nameKey="cluster" />
        </PieChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col gap-2 text-sm">
      <div className="leading-none text-muted-foreground">
        Showing total visitors for the last 6 months
      </div>
    </CardFooter>
  </Card>
  )
}

export function MultipleBarChartClusterCompare({ data, classname} : { data: any, classname?: string}) {
  const mockData = [
    {
      date: "Jan",
      cluster_0: {
        number: 100,
        value: 10000,
      },
      cluster_1: {
        number: 200,
        value: 20000,
      },
      cluster_2: {
        number: 300,
        value: 30000,
      },
      cluster_3: {
        number: 400,
        value: 40000,
      },
      cluster_4: {
        number: 500,
        value: 50000,
      },
      cluster_5: {
        number: 600,
        value: 60000,
      },
    },
    {
      date: "Fev",
      cluster_0: {
        number: 200,
        value: 20000,
      },
      cluster_1: {
        number: 300,
        value: 30000,
      },
      cluster_2: {
        number: 400,
        value: 40000,
      },
      cluster_3: {
        number: 500,
        value: 50000,
      },
      cluster_4: {
        number: 600,
        value: 60000,
      },
      cluster_5: {
        number: 700,
        value: 70000,
      },
    },
    {
      date: "Mar",
      cluster_0: {
        number: 300,
        value: 30000,
      },
      cluster_1: {
        number: 400,
        value: 40000,
      },
      cluster_2: {
        number: 500,
        value: 50000,
      },
      cluster_3: {
        number: 600,
        value: 60000,
      },
      cluster_4: {
        number: 700,
        value: 70000,
      },
      cluster_5: {
        number: 800,
        value: 80000,
      },
    },
    {
      date: "Abr",
      cluster_0: {
        number: 400,
        value: 40000,
      },
      cluster_1: {
        number: 500,
        value: 50000,
      },
      cluster_2: {
        number: 600,
        value: 60000,
      },
      cluster_3: {
        number: 700,
        value: 70000,
      },
      cluster_4: {
        number: 800,
        value: 80000,
      },
      cluster_5: {
        number: 900,
        value: 90000,
      },
    },
    {
      date: "Mai",
      cluster_0: {
        number: 500,
        value: 50000,
      },
      cluster_1: {
        number: 600,
        value: 60000,
      },
      cluster_2: {
        number: 700,
        value: 70000,
      },
      cluster_3: {
        number: 800,
        value: 80000,
      },
      cluster_4: {
        number: 900,
        value: 90000,
      },
      cluster_5: {
        number: 1000,
        value: 100000,
      },
    },
    {
      date: "Jun",
      cluster_0: {
        number: 600,
        value: 60000,
      },
      cluster_1: {
        number: 700,
        value: 70000,
      },
      cluster_2: {
        number: 800,
        value: 80000,
      },
      cluster_3: {
        number: 900,
        value: 90000,
      },
      cluster_4: {
        number: 1000,
        value: 100000,
      },
      cluster_5: {
        number: 1100,
        value: 110000,
      },
    },
  ]
  const [activeChart, setActiveChart] = useState<"count" | "amount">("count")
  const [mainChart , setMainChart] = useState<"cluster_0" | "cluster_1" | "cluster_2" | "cluster_3" | "cluster_4" | "cluster_5">("cluster_0")
  const [compareChart, setCompareChart] = useState<"cluster_0" | "cluster_1" | "cluster_2" | "cluster_3" | "cluster_4" | "cluster_5" | undefined>(undefined)
  const [chartData, setChartData] = useState(data || mockData)
  useEffect(() => {
      if (activeChart === "count") {
          setChartData(data.map((item: any) => {
              return {
                  month: item.date,
                  cluster_0: item.cluster_0 ? item.cluster_0.number : 0,
                  cluster_1: item.cluster_1 ? item.cluster_1.number : 0,
                  cluster_2: item.cluster_2 ? item.cluster_2.number : 0,
                  cluster_3: item.cluster_3 ? item.cluster_3.number : 0,
                  cluster_4: item.cluster_4 ? item.cluster_4.number : 0,
                  cluster_5: item.cluster_5 ? item.cluster_5.number : 0,
              }
          }))
      }
      else {
          setChartData(data.map((item: any) => {
              return {
                  month: item.date,
                  cluster_0: item.cluster_0 ? item.cluster_0.value : 0,
                  cluster_1: item.cluster_1 ? item.cluster_1.value : 0,
                  cluster_2: item.cluster_2 ? item.cluster_2.value : 0,
                  cluster_3: item.cluster_3 ? item.cluster_3.value : 0,
                  cluster_4: item.cluster_4 ? item.cluster_4.value : 0,
                  cluster_5: item.cluster_5 ? item.cluster_5.value : 0,
              }
          }))
      }
  }, [activeChart])

  console.log("Multiple bar data", data)
  const chartConfig = {
      "cluster_0": {
          label: "Cluster 0",
          color: "hsl(var(--chart-1))",
      },
      "cluster_1": {
          label: "Cluster 1",
          color: "hsl(var(--chart-2))",
      },
      "cluster_2": {
          label: "Cluster 2",
          color: "hsl(var(--chart-3))",
      },
      "cluster_3": {
          label: "Cluster 3",
          color: "hsl(var(--chart-4))",
      },
      "cluster_4": {
          label: "Cluster 4",
          color: "hsl(var(--chart-5))",
      },
      "cluster_5": {
          label: "Cluster 5",
          color: "hsl(var(--chart-6))",
      },
  } satisfies ChartConfig
  return (
      <Card className={classname}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="py-6 flex-1 px-6">
              <CardTitle>Comparação de Clusters</CardTitle>
              <CardDescription>Todo o banco de dados</CardDescription>
          </div>
          <div className="flex items-center justify-center gap-4 px-4">
              <div className="flex h-full items-center justify-center gap-2">
                  <p className="text-sm">Gráfico: </p>
                  <Select onValueChange={(value) => {
                      setMainChart(value as keyof typeof chartConfig)
                  }} value={mainChart}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Gráfico principal" />
                      </SelectTrigger>
                      <SelectContent>
                          { Object.keys(chartConfig).map((key) => {
                              const chart = key as keyof typeof chartConfig
                              return (
                                  <SelectItem key={chart} value={chart}>
                                      {chartConfig[chart].label}
                                  </SelectItem>
                              )
                          })}
                          
                      </SelectContent>
                  </Select>

              </div>
              <div className="flex h-full items-center justify-center gap-2">
                  <p className="text-sm">Comparar: </p>
                  <Select onValueChange={(value) => {
                      setCompareChart(value as keyof typeof chartConfig)
                  }} value={compareChart || ""}>
                      <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Comparar gráficos" />
                      </SelectTrigger>
                      <SelectContent>
                          { Object.keys(chartConfig).map((key) => {
                              const chart = key as keyof typeof chartConfig
                              return (
                                  <SelectItem key={chart} value={chart}>
                                      {chartConfig[chart].label}
                                  </SelectItem>
                              )
                          })}
                          <Button
                          className="w-full px-2"
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                              e.stopPropagation()
                              setCompareChart(undefined)
                          }}
                          >
                          Limpar
                          </Button>
                      </SelectContent>
                  </Select>
              </div>
          </div>
          <div className="flex">
              <button
                  data-active={activeChart === "count"}
                  className="flex items-center justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 h-full"
                  onClick={() => setActiveChart("count")}
              >
                  <span className="text-xs text-muted-foreground">Quantidade</span>
              </button>
              <button
                  data-active={activeChart === "amount"}
                  className="flex items-center justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveChart("amount")}
              >
                  <span className="text-xs text-muted-foreground">Valor</span>
              </button>
          </div>
          
      </CardHeader>
      <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{
              left: 12,
              right: 12,
              }}>
              <CartesianGrid vertical={false} />
              <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              />
              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey={mainChart} fill={`var(--color-${mainChart})`} radius={4} />
              { compareChart && <Bar dataKey={compareChart} fill={`var(--color-${compareChart})`}radius={4} />}
          </BarChart>
          </ChartContainer>
      </CardContent>
      </Card>
  )
}

// Tipagem de dados
interface AgePyramidProps {
  data: any;
  className?: string;
}

export function AgePyramid({ data, className }: AgePyramidProps) {
  const maxValue = Math.max(
    ...data.map((d: any) => Math.max(d.homem, d.mulher))
  ); // Encontra o valor máximo para sincronizar a escala
  useEffect(() => {
    console.log("data", data);
  }, [])
  const chartConfig = {
    ageGroup: {
      label: "Faixa Etária",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Distribuição por Faixa Etária</CardTitle>
          <CardDescription>
            Mostrando a distribuição de beneficiários por faixa etária (Masculino vs Feminino).
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 flex justify-center">
        {/* Gráfico Masculino */}
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-1/2">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 10 }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="homem"
              type="number"
              domain={[0, maxValue]} // Sincroniza a escala com o gráfico feminino
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              reversed={true} // Inverte o eixo para pirâmide
              tickFormatter={(value) => String(value)}
            />
            <YAxis
              dataKey="ageGroup"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              formatter={(value, name, item) => (
                <div>
                  <div className="flex gap-2">
                    <div className="text-xs text-muted-foreground">Quantidade: </div>
                    <div className="text-xs font-bold">{item.payload.homem}</div>
                  </div>
                </div>
              )}
            />
            <Bar dataKey={"homem"} fill={`hsl(var(--chart-men))`} radius={4} />
          </BarChart>
        </ChartContainer>

        {/* Gráfico Feminino */}
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-1/2">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 10, right: 0 }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="mulher"
              type="number"
              domain={[0, maxValue]} // Sincroniza a escala com o gráfico masculino
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value)}
            />
            {/* Removemos a legenda (Y-Axis) aqui */}
            <YAxis
              dataKey="ageGroup"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide={true} // Oculta o Y-Axis
            />
            <ChartTooltip
              formatter={(value, name, item) => (
                <div>
                  <div className="flex gap-2">
                    <div className="text-xs text-muted-foreground">Quantidade: </div>
                    <div className="text-xs font-bold">{item.payload.mulher}</div>
                  </div>
                </div>
              )}
            />
            <Bar dataKey={"mulher"} fill={`hsl(var(--chart-women))`} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function RadarClusterChart( { data, classname } : { data: any, classname?: string} ) {

  
  const chartConfig = {
    value: {
      label: "Frequência",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig
  return (
    <Card className={classname}>
      <CardHeader className="pb-4">
        <CardTitle>Radar geral do cluster</CardTitle>
        <CardDescription>
          Esse radar mostra a frequência do gênero e elegibilidade dentro do cluster.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto max-h-[250px]"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="label" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Durante toda a base de dados
        </div>
      </CardFooter>
    </Card>
  )
}


export function LineClusterMultipleChart({ data, classname } : { data: any, classname?: string }) {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ]
  
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig
  
  return (
    <Card className={classname}>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}








export function ClusterBarChartAllFilters({ data, classname } : { data: any, classname?: string }) {
  const chartData = [
    { date: "2024-04-01", desktop: 222, mobile: 150 },
    { date: "2024-04-02", desktop: 97, mobile: 180 },
    { date: "2024-04-03", desktop: 167, mobile: 120 },
    { date: "2024-04-04", desktop: 242, mobile: 260 },
    { date: "2024-04-05", desktop: 373, mobile: 290 },
    { date: "2024-04-06", desktop: 301, mobile: 340 },
    { date: "2024-04-07", desktop: 245, mobile: 180 },
    { date: "2024-04-08", desktop: 409, mobile: 320 },
    { date: "2024-04-09", desktop: 59, mobile: 110 },
    { date: "2024-04-10", desktop: 261, mobile: 190 },
    { date: "2024-04-11", desktop: 327, mobile: 350 },
    { date: "2024-04-12", desktop: 292, mobile: 210 },
    { date: "2024-04-13", desktop: 342, mobile: 380 },
    { date: "2024-04-14", desktop: 137, mobile: 220 },
    { date: "2024-04-15", desktop: 120, mobile: 170 },
    { date: "2024-04-16", desktop: 138, mobile: 190 },
    { date: "2024-04-17", desktop: 446, mobile: 360 },
    { date: "2024-04-18", desktop: 364, mobile: 410 },
    { date: "2024-04-19", desktop: 243, mobile: 180 },
    { date: "2024-04-20", desktop: 89, mobile: 150 },
    { date: "2024-04-21", desktop: 137, mobile: 200 },
    { date: "2024-04-22", desktop: 224, mobile: 170 },
    { date: "2024-04-23", desktop: 138, mobile: 230 },
    { date: "2024-04-24", desktop: 387, mobile: 290 },
    { date: "2024-04-25", desktop: 215, mobile: 250 },
    { date: "2024-04-26", desktop: 75, mobile: 130 },
    { date: "2024-04-27", desktop: 383, mobile: 420 },
    { date: "2024-04-28", desktop: 122, mobile: 180 },
    { date: "2024-04-29", desktop: 315, mobile: 240 },
    { date: "2024-04-30", desktop: 454, mobile: 380 },
    { date: "2024-05-01", desktop: 165, mobile: 220 },
    { date: "2024-05-02", desktop: 293, mobile: 310 },
    { date: "2024-05-03", desktop: 247, mobile: 190 },
    { date: "2024-05-04", desktop: 385, mobile: 420 },
    { date: "2024-05-05", desktop: 481, mobile: 390 },
    { date: "2024-05-06", desktop: 498, mobile: 520 },
    { date: "2024-05-07", desktop: 388, mobile: 300 },
    { date: "2024-05-08", desktop: 149, mobile: 210 },
    { date: "2024-05-09", desktop: 227, mobile: 180 },
    { date: "2024-05-10", desktop: 293, mobile: 330 },
    { date: "2024-05-11", desktop: 335, mobile: 270 },
    { date: "2024-05-12", desktop: 197, mobile: 240 },
    { date: "2024-05-13", desktop: 197, mobile: 160 },
    { date: "2024-05-14", desktop: 448, mobile: 490 },
    { date: "2024-05-15", desktop: 473, mobile: 380 },
    { date: "2024-05-16", desktop: 338, mobile: 400 },
    { date: "2024-05-17", desktop: 499, mobile: 420 },
    { date: "2024-05-18", desktop: 315, mobile: 350 },
    { date: "2024-05-19", desktop: 235, mobile: 180 },
    { date: "2024-05-20", desktop: 177, mobile: 230 },
    { date: "2024-05-21", desktop: 82, mobile: 140 },
    { date: "2024-05-22", desktop: 81, mobile: 120 },
    { date: "2024-05-23", desktop: 252, mobile: 290 },
    { date: "2024-05-24", desktop: 294, mobile: 220 },
    { date: "2024-05-25", desktop: 201, mobile: 250 },
    { date: "2024-05-26", desktop: 213, mobile: 170 },
    { date: "2024-05-27", desktop: 420, mobile: 460 },
    { date: "2024-05-28", desktop: 233, mobile: 190 },
    { date: "2024-05-29", desktop: 78, mobile: 130 },
    { date: "2024-05-30", desktop: 340, mobile: 280 },
    { date: "2024-05-31", desktop: 178, mobile: 230 },
    { date: "2024-06-01", desktop: 178, mobile: 200 },
    { date: "2024-06-02", desktop: 470, mobile: 410 },
    { date: "2024-06-03", desktop: 103, mobile: 160 },
    { date: "2024-06-04", desktop: 439, mobile: 380 },
    { date: "2024-06-05", desktop: 88, mobile: 140 },
    { date: "2024-06-06", desktop: 294, mobile: 250 },
    { date: "2024-06-07", desktop: 323, mobile: 370 },
    { date: "2024-06-08", desktop: 385, mobile: 320 },
    { date: "2024-06-09", desktop: 438, mobile: 480 },
    { date: "2024-06-10", desktop: 155, mobile: 200 },
    { date: "2024-06-11", desktop: 92, mobile: 150 },
    { date: "2024-06-12", desktop: 492, mobile: 420 },
    { date: "2024-06-13", desktop: 81, mobile: 130 },
    { date: "2024-06-14", desktop: 426, mobile: 380 },
    { date: "2024-06-15", desktop: 307, mobile: 350 },
    { date: "2024-06-16", desktop: 371, mobile: 310 },
    { date: "2024-06-17", desktop: 475, mobile: 520 },
    { date: "2024-06-18", desktop: 107, mobile: 170 },
    { date: "2024-06-19", desktop: 341, mobile: 290 },
    { date: "2024-06-20", desktop: 408, mobile: 450 },
    { date: "2024-06-21", desktop: 169, mobile: 210 },
    { date: "2024-06-22", desktop: 317, mobile: 270 },
    { date: "2024-06-23", desktop: 480, mobile: 530 },
    { date: "2024-06-24", desktop: 132, mobile: 180 },
    { date: "2024-06-25", desktop: 141, mobile: 190 },
    { date: "2024-06-26", desktop: 434, mobile: 380 },
    { date: "2024-06-27", desktop: 448, mobile: 490 },
    { date: "2024-06-28", desktop: 149, mobile: 200 },
    { date: "2024-06-29", desktop: 103, mobile: 160 },
    { date: "2024-06-30", desktop: 446, mobile: 400 },
  ]
  
  const chartConfig = {
    views: {
      label: "Page Views",
    },
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig
  
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("desktop")

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
