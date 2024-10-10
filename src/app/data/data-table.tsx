"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion"; // Adding framer-motion for animations


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const fetchSize = 100;
  const [pageSize, setPageSize] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [actualData, setActualData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [eligibility, setEligibility] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [usageType, setUsageType] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  const table = useReactTable({
    data: actualData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageSize: pageSize,
        pageIndex: page,
      },
    },
  });

  const fetchNextPage = async () => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams({
        skip: actualData.length.toString(),
        take: fetchSize.toString(),
      });
      if (eligibility) searchParams.append("eligibility", eligibility);
      if (plan) searchParams.append("plan", plan);
      if (gender) searchParams.append("gender", gender);
      if (usageType) searchParams.append("usageType", usageType);
      if (ageGroup) searchParams.append("ageGroup", ageGroup);
      if (dateFrom) searchParams.append("dateFrom", dateFrom.toISOString());
      if (dateTo) searchParams.append("dateTo", dateTo.toISOString());
      
      const response = await fetch(
        `/api/claims?${searchParams.toString()}`
      );
      const data = await response.json();
      setIsLoading(false);
      if (!data.claims || data.claims.length === 0) {
        setHasMore(false);
        return [];
      }
      return data.claims;
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
      setHasMore(false);
      return [];
    }
  };

  const handleNextPage = async () => {
    if ((page + 1) * pageSize >= actualData.length && hasMore && !isLoading) {
      const newData = await fetchNextPage();
      setActualData([...actualData, ...newData]);
    }
    setPage(page + 1);
  };

  useEffect(() => {
    // Scroll to top when changing page smothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, pageSize]);


  return (
    <>
       <div className="relative mb-8">
      {/* Dropdown Trigger */}
      <Button
        className="flex items-center gap-2 bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        Filtros
        <ChevronDown size={16} />
      </Button>

      {/* Dropdown Content with Animation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`overflow-hidden ${
          isOpen ? "py-4" : "py-0"
        } absolute top-full mt-2 z-10 bg-white dark:bg-dark-900 shadow-lg rounded-md w-full max-w-md filter-items`}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* Filter Items */}
          <div className="filter-item flex gap-2 items-center">
            <label className="w-[160px]">Elegibilidade:</label>
            <Select onValueChange={(value) => {
              setEligibility(value);
            }} value={eligibility || ""}>
              <SelectTrigger className="w-full dark:bg-dark-800">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TITULAR">TITULAR</SelectItem>
                <SelectItem value="DEPENDENTE">DEPENDENTE</SelectItem>
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEligibility(null)
                  }}
                > 
                  Limpar
                </Button>
              </SelectContent>
            </Select>
          </div>
          
          <div className="filter-item flex gap-2 items-center">
            <label className="w-[160px]">Sexo:</label>
            <Select onValueChange={(value) => {
              setGender(value);
            }} value={gender || ""}>
              <SelectTrigger className="w-full dark:bg-dark-800">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setGender(null)
                  }}
                >
                  Limpar
                </Button>
              </SelectContent>
            </Select>
          </div>

          <div className="filter-item flex gap-2 items-center">
            <label className="w-[160px]">Plano:</label>
            <Select onValueChange={(value) => {
              setPlan(value);
            }} value={plan || ""}>
              <SelectTrigger className="w-full dark:bg-dark-800">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="h-60">
                <SelectItem value="QNR6">QNR6</SelectItem>
                <SelectItem value="TP8X">TP8X</SelectItem>
                <SelectItem value="NP6X">NP6X</SelectItem>
                <SelectItem value="TNE1">TNE1</SelectItem>
                <SelectItem value="TN1E">TN1E</SelectItem>
                <SelectItem value="TQN2">TQN2</SelectItem>
                <SelectItem value="TNQ2">TNQ2</SelectItem>
                <SelectItem value="NP2X">NP2X</SelectItem>
                <SelectItem value="8XTP">8XTP</SelectItem>
                <SelectItem value="QN06">QN06</SelectItem>
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPlan(null)
                  }}
                >
                  Limpar
                </Button>
              </SelectContent>
            </Select>
          </div>

          <div className="filter-item flex gap-2 items-center">
            <label className="w-[160px]">Tipo de utilização:</label>
            <Select onValueChange={(value) => {
              setUsageType(value);
            }} value={usageType || ""}>
              <SelectTrigger className="w-full dark:bg-dark-800">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REDE">REDE</SelectItem>
                <SelectItem value="REEMBOLSO">REEMBOLSO</SelectItem>
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setUsageType(null)
                  }}
                >
                  Limpar
                </Button>
              </SelectContent>
            </Select>
          </div>

          <div className="filter-item flex gap-2 items-center">
            <label className="w-[160px]">Faixa etária:</label>
            <Select onValueChange={(value) => {
              setAgeGroup(value);
            }} value={ageGroup || ""}>
              <SelectTrigger className="w-full dark:bg-dark-800">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="h-60">
                <SelectItem value="0 a 18 anos">0 a 18 anos</SelectItem>
                <SelectItem value="19 a 23 anos">19 a 23 anos</SelectItem>
                <SelectItem value="24 a 28 anos">24 a 28 anos</SelectItem>
                <SelectItem value="29 a 33 anos">29 a 33 anos</SelectItem>
                <SelectItem value="34 a 38 anos">34 a 38 anos</SelectItem>
                <SelectItem value="39 a 43 anos">39 a 43 anos</SelectItem>
                <SelectItem value="44 a 48 anos">44 a 48 anos</SelectItem>
                <SelectItem value="49 a 53 anos">49 a 53 anos</SelectItem>
                <SelectItem value="54 a 58 anos">54 a 58 anos</SelectItem>
                <SelectItem value="59 anos ou mais">59+</SelectItem>
                <Button
                  className="w-full px-2"
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAgeGroup(null)
                  }}
                >
                  Limpar
                </Button>
              </SelectContent>
            </Select>
          </div>

          <div className="filter-item flex gap-2 items-center">
            <label className="w-[160px]">Intervalo de data:</label>
            <div className="w-full">
              <DatePickerWithRange onValueChange={(value) => {
                if (!value) return;
                setDateFrom(value.from || null);
                setDateTo(value.to || null);
              }} />
            </div>
          </div>

          {/* Apply Filters Button */}
          <Button className="bg-primary-800 hover:bg-primary-700 text-white w-full max-w-[180px]" onClick={async (e) => {
            e.preventDefault();
            setPage(0);
            setActualData([]);
            setIsOpen(false);
            const items = await fetchNextPage()
            if (items.length >= fetchSize) setHasMore(true);
            setActualData(items);
          }}>
            Filtrar
          </Button>
        </div>
      </motion.div>
    </div>
      <div className="rounded-md border">
        
        <Table className="min-w-[1000px]" >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? // Skeleton Loading Animation
                Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex} className="h-6 bg-gray-200" />
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows?.length
              ? // Fade-in Animation for Table Rows
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="transition-opacity duration-500 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-800"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // No Results Row
                !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nada para mostrar por aqui.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4 px-4 pb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700 dark:text-gray-300">
            Itens por página:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
            className="px-2 py-1 border rounded-md text-sm"
          >
            {[5, 10, 15, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0 || isLoading}
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
          {isLoading ? (
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-700">Carregando...</span>
              </div>
            </div>
          ) : (
            <span className="text-sm text-gray-700 dark:text-gray-300">Página {page + 1}</span>
          )}
          
          <button
            onClick={handleNextPage}
            disabled={!hasMore || isLoading}
            className={`px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 ${
              isLoading ? "animate-pulse bg-gray-200" : ""
            }`}
          >
            Próxima
          </button>
        </div>
      </div>
    </>
  );
}
