"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, LabelList, Line, LineChart, YAxis } from "recharts"

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


export function ChartCurve({ className, data }: { className?: string, data: any }) {
  const chartConfig: ChartConfig = {
    titular: {
      color: "HSL(var(--chart-titular))",
      label: "Titular",
    },
    dependente: {
      color: "HSL(var(--chart-dependente))",
      label: "Dependente",
    },
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Número de sinistro</CardTitle>
        <CardDescription>
          Mostrando o número de sinistros dos últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
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
              tickFormatter={(value) => value.slice(2, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="titular"
              type="natural"
              fill="var(--color-titular)"
              fillOpacity={0.4}
              stroke="var(--color-titular)"
              stackId="a"
            />
            <Area
              dataKey="dependente"
              type="natural"
              fill="var(--color-dependente)"
              fillOpacity={0.4}
              stroke="var(--color-dependente)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span className="w-[4px] h-[16px] rounded-sm bg-[color:hsl(var(--chart-titular))]" />
              Titular
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              <span className="w-[4px] h-[16px] rounded-sm bg-[color:hsl(var(--chart-dependente))]" />
              Dependente
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}


export function LineChartComponent({ className, data }: { className?: string, data: any }) {
  const chartConfig: ChartConfig = {
    total: {
      color: "HSL(var(--chart-4))",
      label: "Total"
    }
  }
  const porcentagemEmRelacaoAoMesAnterior = (data: any[]) => {
    const last = data[data.length - 1].total 
    const previous = data[data.length - 2].total
    return ((last - previous) / previous) * 100
  }

  const percent = porcentagemEmRelacaoAoMesAnterior(data)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Total (valor gasto) de sinistros por mês</CardTitle>
        <CardDescription>
            Mostrando o valor total de sinistros dos últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
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
              tickFormatter={(value) => value.slice(2, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
              formatter={(value, name, item) => {
                console.log(item)
                return (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {item.payload.month}
                    </div>
                    <div className="text-xs font-medium flex gap-2 mt-2">
                      <div className={`w-[4px] h-[16px] rounded-sm bg-[hsl(var(--chart-4))]`}/>
                      {value.toLocaleString("pt-br", { currency: "BRL", style: "currency"})} | Valor total
                    </div>
                  </div>
                )
              }}
            />
            <Area
              dataKey="total"
              type="linear"
              fill="var(--color-total)"
              fillOpacity={0.4}
              stroke="var(--color-total)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              { percent - 100 > 0 ? (
                <span className="text-green-500">+{(percent).toFixed(2)}%</span>
              ) : (
                <span className="text-red-500">{(percent).toFixed(2)}%</span>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              { data[data.length - 1].month } em relação a { data[data.length - 2].month }
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export function BarChartComponent({ className, data }: { className?: string, data: any }) {
  const chartConfig: ChartConfig = {
    homens: {
      color: "hsl(var(--chart-men))",
      label: "Homens",
    },
    mulheres: {
      color: "hsl(var(--chart-women))",
      label: "Mulheres",
    },
  }
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sinistros por faixa etária e genêro</CardTitle>
        <CardDescription>Toda a base de dados</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ageGroup"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                if (value === "0 a 18 anos") return "0-18"
                else if (value === "19 a 23 anos") return "19-23"
                else if (value === "24 a 28 anos") return "24-28"
                else if (value === "29 a 33 anos") return "29-33"
                else if (value === "34 a 38 anos") return "34-38"
                else if (value === "39 a 43 anos") return "39-43"
                else if (value === "44 a 48 anos") return "44-48"
                else if (value === "49 a 53 anos") return "49-53"
                else if (value === "54 a 58 anos") return "54-58"
                else return "59+"
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="homens" fill="var(--color-homens)" radius={4} />
            <Bar dataKey="mulheres" fill="var(--color-mulheres)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <span className="w-[4px] h-[16px] rounded-sm bg-[color:hsl(var(--chart-men))]" />
              Homens
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              <span className="w-[4px] h-[16px] rounded-sm bg-[color:hsl(var(--chart-women))]" />
              Mulheres
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}


export function HorizontalBarChartComponent({ className, data }: { className?: string, data: any }) {
  const chartConfig = {
    "service_0": {
      label: data[0].specialty,
      color: "hsl(var(--chart-1))",
    },
    "service_1": {
      label: data[1].specialty,
      color: "hsl(var(--chart-2))",
    },
    "service_2": {
      label: data[2].specialty,
      color: "hsl(var(--chart-3))",
    },
    "service_3": {
      label: data[3].specialty,
      color: "hsl(var(--chart-4))",
    },
    "service_4": {
      label: data[4].specialty,
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Cinco serviços mais utilizados</CardTitle>
        <CardDescription>Nos últimos 12 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="index"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
              tick={{ fontSize: 6 }}
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
              formatter={(value, name, item) => {
                console.log(Number(item.payload.index.split("_")[1]) + 1)
                return (
                  <div className="flex flex-col gap-2 w-full h-full">
                    <div className="flex gap-2 w-full">
                      <div
                        className={`w-1 h-4 rounded-sm bg-[hsl(var(--chart-${Number(item.payload.index.split("_")[1]) + 1}))]`}
                      />
                      <p className="text-xs">
                        {item.payload.specialty}
                      </p>
                    </div>
                    <p className="text-xs font-medium">
                      Valor total: {item.payload.amount.toLocaleString("pt-br", { currency: "BRL", style: "currency"})}
                    </p>
                    <p className="text-xs font-medium">
                      Quantidade: {item.payload.total}
                    </p>
                  </div>
                )
              }}
            />
            <Bar dataKey="total" layout="vertical" radius={5}/>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="gap-2 flex flex-col">
            {data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 font-medium leading-none text-muted-foreground text-xs"
              >
                <span
                  className="w-[4px] h-[16px] rounded-sm"
                  style={{
                    backgroundColor: `hsl(var(--chart-${index + 1}))`,  // Resolvendo a cor dinamicamente
                  }}
                />
                {item.specialty}
              </div>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
