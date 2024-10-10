"use client";
import { Combobox } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { useEffect, useState } from "react";

async function getClasses(){
    const response = await fetch('http://localhost:3002/get-classes')

    console.log(response)
    // parsing body of response
    const data = await response.text()
    const jsonData = JSON.parse(data.replaceAll("NaN", '"Nenhuma."'))
    console.log(jsonData)
    return jsonData
}

export default function CalculadoraPage() {
    const [classes, setClasses] = useState< {
        faixaEtaria: string[],
        descricaoServicoSinistro: string[],
        doencaRelacionada: string[]
    }>()
    const [ageGroup, setAgeGroup] = useState<string | null>(null)
    const [codigoServicoSinistro, setCodigoServicoSinistro] = useState<string | null>(null)
    const [doencaRelacionada, setDoencaRelacionada] = useState<string | null>(null)
    const [result, setResult] = useState<string | null>(null)

    useEffect(() => {
        getClasses().then((data) => {
            setClasses(data)
        })
    }, [])



    const handleOnSubmit = async () => {
        // valores do server component
        const response = await fetch('http://localhost:3002/predict-value', {
            method: 'POST',
            body: JSON.stringify({
                faixaEtaria: ageGroup,
                descricaoServicoSinistro: codigoServicoSinistro,
                doencaRelacionada: doencaRelacionada
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        setResult(data.y)
    }
    return (
        <div className="w-full">
            <div className="ml-[100px] w-[100vw - 100px] px-12">
                <div className="header py-8">
                    <h1 className='font-bold text-2xl text-primary-900 dark:text-white'>Calculadora</h1>
                </div>
                <div className="content">
                    <div className="predictive flex flex-col gap-3 px-2">
                        <h2 className="text-lg font-medium ">Rodar modelo preditivo</h2>
                        <div className="filter-item flex gap-2 items-center mt-4">
                            <label className="w-[160px]">Faixa etária:</label>
                            <Select onValueChange={(value) => {
                                setAgeGroup(value)
                            }}>
                            <SelectTrigger className="w-full dark:bg-dark-800">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="h-60">
                                {classes?.faixaEtaria.map((item: string, index: number) => {
                                    return (
                                        <SelectItem key={index} value={item}>{item}</SelectItem>
                                    )
                                })}
                                {/* <Button
                                className="w-full px-2"
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setAgeGroup(null)
                                }}
                                >
                                Limpar
                                </Button> */}
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="filter-item flex gap-2 items-center mt-4">
                            <label className="w-[160px]">Descrição Serviço Sinistro</label>
                            <Combobox predefinedList={classes?.descricaoServicoSinistro || []} emptyMessage="Nenhuma descrição de sinistro encontrada." setValueState={setCodigoServicoSinistro} />
                        </div>
                        <div className="filter-item flex gap-2 items-center mt-4">
                            <label className="w-[160px]">Doença relacionada</label>
                            <Combobox predefinedList={classes?.doencaRelacionada || []} emptyMessage="Nenhuma doença encontrada." setValueState={setDoencaRelacionada} />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <Button className="bg-primary-900 hover:bg-primary-900 hover:opacity-90 gap-3 dark:bg-primary-800 dark:text-white" type="button" onClick={handleOnSubmit}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.125 10C13.8667 10 14.5917 10.2199 15.2084 10.632C15.8251 11.044 16.3057 11.6297 16.5896 12.3149C16.8734 13.0002 16.9476 13.7542 16.8029 14.4816C16.6583 15.209 16.3011 15.8772 15.7767 16.4017C15.2522 16.9261 14.584 17.2833 13.8566 17.4279C13.1292 17.5726 12.3752 17.4984 11.6899 17.2145C11.0047 16.9307 10.419 16.4501 10.007 15.8334C9.59494 15.2167 9.375 14.4917 9.375 13.75C9.375 12.7554 9.77009 11.8016 10.4734 11.0983C11.1766 10.3951 12.1304 10 13.125 10ZM13.125 8.75C12.1361 8.75 11.1694 9.04324 10.3472 9.59265C9.52491 10.1421 8.88404 10.923 8.5056 11.8366C8.12717 12.7502 8.02815 13.7555 8.22108 14.7255C8.414 15.6954 8.89021 16.5863 9.58947 17.2855C10.2887 17.9848 11.1796 18.461 12.1496 18.6539C13.1195 18.8469 14.1248 18.7478 15.0384 18.3694C15.9521 17.991 16.7329 17.3501 17.2824 16.5279C17.8318 15.7056 18.125 14.7389 18.125 13.75C18.125 12.4239 17.5982 11.1521 16.6605 10.2145C15.7229 9.27678 14.4511 8.75 13.125 8.75Z" fill="white"/>
                                    <path d="M16.25 2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H6.25V16.25H3.75V7.5H17.5V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM3.75 6.25V3.75H16.25V6.25H3.75Z" fill="white"/>
                                    <path d="M11.875 11.875V15.625L15 13.75L11.875 11.875Z" fill="white"/>
                                </svg>
                                Rodar modelo preditivo
                            </Button>
                            <h4 className="font-medium text-lg">Resultado do modelo: <span className="text-primary-800 uppercase dark:text-primary-600">{Number(result).toLocaleString("pt-br", { style: "currency", currency: "BRL"}) || ""}</span></h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}