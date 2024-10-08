import { auth } from "@/auth";
import BadgeReport from "@/components/Badge";
import { BarChartComponent, ChartCurve, HorizontalBarChartComponent, LineChartComponent } from "@/components/Graphics";
import Sidebar from "@/components/Sidebar/index";
import { prisma } from "@/lib/prisma";
import { Roboto_Mono } from "next/font/google";
import React from "react";

const roboto_mono = Roboto_Mono({ subsets: ["latin"] });

type ClaimsNumber = {
  total: number,
  month: Date
}

type ClaimsByAgeGroupAndGender = {
  ageGroup: string,
  total: number
  gender: string,
}

async function getClaimsNumberInThisMonth(){
  const date = new Date("2023-09-01")
  const claimsCount = await prisma.claim.count({
    where: {
      claimDate: {
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
        lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    }
  })
  return claimsCount
}

async function getClaimsValueInThisMonth(){
  const date = new Date("2023-09-01")
  const claimsValue = await prisma.claim.aggregate({
    _sum: {
      claimAmount: true
    },
    where: {
      claimDate: {
        gte: new Date(date.getFullYear(), date.getMonth(), 1),
        lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    }
  })
  return claimsValue._sum
}

async function getMostUsedSpecialty(){
  const mostUsedSpecialty = await prisma.claim.groupBy({
    by: ["claimServiceDescription"],
    _count: {
      _all: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    _sum: {
      claimAmount: true
    }
  })
  return mostUsedSpecialty
}

async function getChartNumberClaimsLastYear(){
  const monthNames  = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  
  const date = new Date("2023-09-01")
  const claimsTitular = await prisma.$queryRaw`
  SELECT DATE_TRUNC('month', "claimDate") AS month, COUNT(*) AS total 
  FROM "Claim" 
  WHERE "claimDate" >= DATE_TRUNC('month', (CURRENT_DATE - INTERVAL '1 year')) 
    AND "claimDate" < DATE_TRUNC('month', CURRENT_DATE) 
    AND "role" = 'TITULAR' 
  GROUP BY month 
  ORDER BY month;
` as ClaimsNumber[];

  const claimsDependent = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "claimDate") AS month, COUNT(*) AS total 
    FROM "Claim" 
    WHERE "claimDate" >= DATE_TRUNC('month', (CURRENT_DATE - INTERVAL '1 year')) 
      AND "claimDate" < DATE_TRUNC('month', CURRENT_DATE) 
      AND "role" = 'DEPENDENTE' 
    GROUP BY month 
    ORDER BY month;
  ` as ClaimsNumber[];

  // Mapeamento e combinação das queries
  const claimsPerMonth = claimsTitular.map(titularClaim => {
  // Formata o mês para o formato desejado "YYYY/MMMM"
  const formattedMonth = `${titularClaim.month.getFullYear()}/${
    monthNames[titularClaim.month.getMonth()]
  }`;

  // Encontra o correspondente dependente baseado no mês
  const dependentClaim = claimsDependent.find(
    (dependent) =>
      dependent.month.getFullYear() === titularClaim.month.getFullYear() &&
      dependent.month.getMonth() === titularClaim.month.getMonth()
  );

  // Retorna o formato desejado
  return {
    month: formattedMonth,
    titular: Number(titularClaim.total),
    dependente: Number(dependentClaim?.total || 0),
  };
});

return claimsPerMonth;
}

async function getChartAgeGroupAndGender(){
  const ageGroup = await prisma.$queryRaw`
  SELECT "ageGroup", COUNT(*) AS total, "gender"
  FROM "Claim" 
  GROUP BY "ageGroup", "gender";
` as ClaimsByAgeGroupAndGender[];

  const mapped: {
    ageGroup: string,
    homens: number,
    mulheres: number,
  }[] = []
  ageGroup.forEach((group) => {
    const foundIndex = mapped.findIndex((item) => item.ageGroup === group.ageGroup);
    if (foundIndex === -1) {
      if (group.gender === "M") {
        mapped.push({
          ageGroup: group.ageGroup,
          homens: Number(group.total),
          mulheres: 0
        })
      }
      else {
        mapped.push({
          ageGroup: group.ageGroup,
          homens: 0,
          mulheres: Number(group.total)
        })
      }
    } else {
      if (group.gender === "M") {
        mapped[foundIndex].homens = Number(group.total)
      }
      else {
        mapped[foundIndex].mulheres = Number(group.total)
      }
    }
  });
  return mapped;
}

async function getClaimsTotalValuePerMonth(){
  const monthNames  = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const claimsMonthSum = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "claimDate") AS month, COUNT(*) AS total 
    FROM "Claim" 
    WHERE "claimDate" >= DATE_TRUNC('month', (CURRENT_DATE - INTERVAL '1 year')) 
      AND "claimDate" < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY month 
    ORDER BY month;
  ` as ClaimsNumber[];
  const mapped = claimsMonthSum.map((claim) => {
    return {
      month: `${claim.month.getFullYear()}/${monthNames[claim.month.getMonth()]}`,
      total: Number(claim.total)
    }
  })
  return mapped
}

async function getMostUsedServicesInTheLastYear(){
  const mostUsedSpecialty = await prisma.claim.groupBy({
    by: ["claimServiceDescription"],
    _count: {
      _all: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    _sum: {
      claimAmount: true
    },
    where: {
      claimDate: {
        gte: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
        lt: new Date()
      }
    },
    take: 5
  })
  // map the data to chart format
  const mapped = mostUsedSpecialty.map((specialty, index) => {
    return {
      specialty: specialty.claimServiceDescription,
      total: specialty._count._all,
      amount: specialty._sum.claimAmount,
      index: `service_${index}`,
      fill: `var(--color-service_${index})` 
    }
  })
  return mapped
}





export default async function Dashboard({ searchParams } : { searchParams: { [key: string]: string } }) {
  const session = await auth()
  console.log(session)

  const claimsNumber = getClaimsNumberInThisMonth()
  const claimsValue = getClaimsValueInThisMonth()
  const mostUsedSpecialty = getMostUsedSpecialty()
  const chartNumberClaimsLastYear = getChartNumberClaimsLastYear()
  const chartAgeGroupAndGender = getChartAgeGroupAndGender()
  const claimsTotalValuePerMonth = getClaimsTotalValuePerMonth()
  const mostUsedServicesInTheLastYear = getMostUsedServicesInTheLastYear()

  const [ claimsNumberValue, claimsValueValue, mostUsedSpecialtyValue, chartNumberClaimsLastYearValue, chartAgeGroupAndGenderValue, claimsTotalValuePerMonthValue, mostUsedServicesInTheLastYearValue ] = await Promise.all([claimsNumber, claimsValue, mostUsedSpecialty, chartNumberClaimsLastYear, chartAgeGroupAndGender, claimsTotalValuePerMonth, mostUsedServicesInTheLastYear])
  return (
    <>
      <Sidebar />
      <div className="w-full">
        <div className="ml-[100px] w-[100vw - 100px] px-12">
          <div className="header flex items-center justify-between w-full">
            <div className="py-8 flex flex-col gap-2">
              <h1 className="font-bold text-2xl">Bem vindo de volta, Gabriel Scarpelin Diniz 👋</h1>
              <p className="font-medium text-lg">Quer olhar como estão os dados de saúde?</p>
            </div>
            <div className="flex gap-2">
              <form>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-black font-bold bg-secondary-600 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75" type="submit">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.99997 1.707L7.29297 1L7.99997 0.292999L8.70697 1L7.99997 1.707ZM8.99997 10.707C8.99997 10.9722 8.89461 11.2266 8.70708 11.4141C8.51954 11.6016 8.26518 11.707 7.99997 11.707C7.73475 11.707 7.4804 11.6016 7.29286 11.4141C7.10533 11.2266 6.99997 10.9722 6.99997 10.707H8.99997ZM2.29297 6L7.29297 1L8.70697 2.414L3.70697 7.414L2.29297 6ZM8.70697 1L13.707 6L12.293 7.414L7.29297 2.414L8.70697 1ZM8.99997 1.707V10.707H6.99997V1.707H8.99997Z" fill="black"/>
                      <path d="M1 12.707V13.707C1 14.2374 1.21071 14.7461 1.58579 15.1212C1.96086 15.4963 2.46957 15.707 3 15.707H13C13.5304 15.707 14.0391 15.4963 14.4142 15.1212C14.7893 14.7461 15 14.2374 15 13.707V12.707" stroke="black" strokeWidth="2"/>
                    </svg>
                  <p className="">Exportar dados</p>
                </button>
              </form>
              <form>
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-white font-bold bg-primary-900 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:bg-primary-800" type="submit">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.49997 9.70689V8.29311L12.293 5.50011L12.9999 6.207L9.49997 9.70689ZM7.99997 8.37889L7.49997 7.87889V2H8.49997V7.87889L7.99997 8.37889ZM6.49997 8.29311V9.70689L3.00008 6.207L3.70697 5.50011L6.49997 8.29311Z" fill="black" stroke="white"/>
                    <path d="M1 12.5V13.5C1 14.0304 1.21071 14.5391 1.58579 14.9142C1.96086 15.2893 2.46957 15.5 3 15.5H13C13.5304 15.5 14.0391 15.2893 14.4142 14.9142C14.7893 14.5391 15 14.0304 15 13.5V12.5" stroke="white" strokeWidth="2"/>
                  </svg>
                  <p className="">Importar dados</p>
                </button>
              </form>
            </div>
          </div>
          <div className="content pb-8">
            <div className="cards flex w-full h-48 gap-8">
              <div className="card px-10 drop-shadow-lg bg-white py-6 w-full rounded-md dark:bg-dark-800">
                <h4 className="font-medium text-lg flex gap-2 items-center">
                  <svg width={24} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M37.5018 30C37.5018 34.1423 34.144 37.5 30.0018 37.5C25.8598 37.5 22.5018 34.1423 22.5018 30C22.5018 25.8577 25.8598 22.5 30.0018 22.5C34.144 22.5 37.5018 25.8577 37.5018 30Z" stroke="black" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M30.003 12.5C18.8089 12.5 9.33316 19.8572 6.14746 30C9.33311 40.1427 18.8089 47.5 30.003 47.5C41.197 47.5 50.6728 40.1427 53.8585 30C50.6728 19.8573 41.197 12.5 30.003 12.5Z" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Número de sinistros
                </h4>
                <div className="flex gap-4 mt-4 items-center">
                  <p className={`text-4xl font-bold ${roboto_mono.className}`}>{(claimsNumberValue/1000).toLocaleString("pt-br")}K</p>
                  <BadgeReport number={4.8} isPositive={true} />
                </div>
              </div>
              <div className="card px-10 drop-shadow-lg bg-white py-6 w-full rounded-md dark:bg-dark-800">
                <h4 className="font-medium text-lg flex gap-2 items-center">
                  <svg width={24} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.6808 41.0638V43.728C31.6808 43.9392 31.639 44.148 31.5581 44.3431C31.4775 44.5383 31.3589 44.7159 31.2097 44.8651C31.0604 45.0147 30.883 45.1325 30.6881 45.2134C30.493 45.294 30.2837 45.3358 30.0725 45.3358C29.8616 45.3358 29.6523 45.294 29.4572 45.2134C29.2621 45.1325 29.0849 45.0147 28.9357 44.8651C28.7864 44.7159 28.6678 44.5383 28.5872 44.3431C28.5063 44.148 28.4645 43.9392 28.4645 43.728V40.9923C27.3997 40.8173 26.3801 40.4323 25.4655 39.8597C24.5507 39.2868 23.7591 38.5375 23.1366 37.6558C22.9099 37.368 22.7835 37.0143 22.7766 36.648C22.7796 36.4421 22.824 36.2388 22.9071 36.0504C22.9901 35.862 23.1103 35.6923 23.2603 35.5512C23.4103 35.4101 23.5871 35.3009 23.7803 35.2296C23.9734 35.1581 24.179 35.1262 24.3847 35.1358C24.5882 35.1363 24.7893 35.1797 24.9752 35.2623C25.1612 35.3451 25.3277 35.4655 25.4645 35.6163C26.2383 36.6183 27.2777 37.3831 28.4645 37.824V31.704C25.2725 30.456 23.6646 28.5838 23.6646 26.1598C23.7127 24.8621 24.2228 23.6242 25.1029 22.6694C25.9829 21.7145 27.175 21.1055 28.4645 20.952V18.3117C28.4645 18.1006 28.5063 17.8916 28.5872 17.6965C28.6678 17.5014 28.7864 17.3243 28.9357 17.175C29.0849 17.0257 29.2621 16.9072 29.4572 16.8264C29.6523 16.7456 29.8616 16.7039 30.0725 16.7039C30.2837 16.7039 30.493 16.7456 30.6881 16.8264C30.883 16.9072 31.0604 17.0257 31.2097 17.175C31.3589 17.3243 31.4775 17.5014 31.5581 17.6965C31.639 17.8916 31.6808 18.1006 31.6808 18.3117V20.9279C32.5738 21.0679 33.4294 21.3865 34.1965 21.8649C34.9635 22.3432 35.6261 22.9713 36.1445 23.7117C36.3733 23.9817 36.5081 24.319 36.5285 24.672C36.535 24.8789 36.5002 25.0846 36.4263 25.278C36.3521 25.4712 36.2405 25.6481 36.0975 25.7976C35.9545 25.9474 35.7831 26.0671 35.5935 26.1499C35.4039 26.2327 35.1997 26.2769 34.9925 26.28C34.7761 26.274 34.5632 26.2217 34.3685 26.1264C34.1739 26.0311 34.0021 25.8953 33.8645 25.728C33.2924 25.0131 32.5381 24.4661 31.6808 24.1443V29.5443L32.2808 29.7838C35.3288 30.9838 37.2248 32.712 37.2248 35.448C37.189 36.9139 36.5955 38.311 35.5654 39.3545C34.5353 40.398 33.146 41.0091 31.6808 41.0638ZM28.4645 28.152V24.2398C28.0772 24.3802 27.7438 24.6389 27.5113 24.9792C27.2789 25.3193 27.1589 25.7239 27.1688 26.1358C27.1616 26.5623 27.2806 26.9818 27.5113 27.3403C27.7419 27.6991 28.0736 27.9814 28.4645 28.152ZM33.7205 35.52C33.7205 34.368 32.9288 33.672 31.6808 33.12V37.92C32.2529 37.8334 32.7747 37.5425 33.1496 37.1016C33.5245 36.6605 33.7273 36.0989 33.7205 35.52Z" fill="black"/>
                    <path d="M44.4 9.52795H15.6C13.0539 9.52795 10.6121 10.5395 8.81177 12.3399C7.01141 14.1402 6 16.5819 6 19.128V43.128C6 45.6739 7.01141 48.1157 8.81177 49.9159C10.6121 51.7164 13.0539 52.728 15.6 52.728H44.4C46.9462 52.728 49.3879 51.7164 51.1882 49.9159C52.9886 48.1157 54 45.6739 54 43.128V19.128C54 16.5819 52.9886 14.1402 51.1882 12.3399C49.3879 10.5395 46.9462 9.52795 44.4 9.52795Z" stroke="black" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Valor gasto com sinistro
                </h4>
                <div className="flex gap-4 mt-4 items-center">
                  <p className={`text-4xl font-bold ${roboto_mono.className}`}>{claimsValueValue.claimAmount ? (parseInt(claimsValueValue?.claimAmount as any)/1000000).toLocaleString("pt-br") : 0}Mi</p>
                  <BadgeReport number={2.8} isPositive={false} />
                </div>
              </div>
              <div className="card px-10 drop-shadow-lg bg-white py-6 w-full rounded-md dark:bg-dark-800">
                <h4 className="font-medium text-lg flex gap-2 items-center">
                  <svg width={24} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M27.5 12.5C24.7386 12.5 22.5 14.7386 22.5 17.5V22.5H17.5C14.7386 22.5 12.5 24.7386 12.5 27.5V32.5C12.5 35.2615 14.7386 37.5 17.5 37.5H22.5V42.5C22.5 45.2615 24.7386 47.5 27.5 47.5H32.5C35.2615 47.5 37.5 45.2615 37.5 42.5V37.5H42.5C45.2615 37.5 47.5 35.2615 47.5 32.5V27.5C47.5 24.7386 45.2615 22.5 42.5 22.5H37.5V17.5C37.5 14.7386 35.2615 12.5 32.5 12.5H27.5ZM27.5 17.5H32.5V23.75C32.5 25.821 34.179 27.5 36.25 27.5H42.5V32.5H36.25C34.179 32.5 32.5 34.179 32.5 36.25V42.5H27.5V36.25C27.5 34.179 25.821 32.5 23.75 32.5H17.5V27.5H23.75C25.821 27.5 27.5 25.821 27.5 23.75V17.5Z" fill="#0F0F0F"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M50 2.5C54.1423 2.5 57.5 5.85788 57.5 10V50C57.5 54.1423 54.1423 57.5 50 57.5H10C5.85788 57.5 2.5 54.1423 2.5 50V10C2.5 5.85788 5.85788 2.5 10 2.5H50ZM50 7.5C51.3807 7.5 52.5 8.6193 52.5 10V50C52.5 51.3807 51.3807 52.5 50 52.5H10C8.6193 52.5 7.5 51.3807 7.5 50V10C7.5 8.6193 8.6193 7.5 10 7.5H50Z" fill="#0F0F0F"/>
                  </svg>
                  Mais utilizado
                </h4>
                <p className={`text-sm mt-4 font-bold ${roboto_mono.className}`}>{mostUsedSpecialtyValue[0].claimServiceDescription}</p>
                <div className="flex gap-4 mt-4 items-center">
                  <p className={`text-4xl font-bold ${roboto_mono.className}`}>{mostUsedSpecialtyValue[0]._sum.claimAmount ? (mostUsedSpecialtyValue[0]._sum.claimAmount/1000000).toLocaleString("pt-br") : 0}Mi</p>
                  <BadgeReport number={2.8} isPositive={false} />
                </div>
              </div>
            </div>
            <div className="graphics mt-8 h-fit">
              <div className="flex justify-between gap-10 flex-col">
                {/* Adicione a classe `equal-height` */}
                <div className="flex w-full gap-12">
                  <ChartCurve className="flex-[0.6]" data={chartNumberClaimsLastYearValue}/>
                  <LineChartComponent className="flex-[0.4]" data={claimsTotalValuePerMonthValue}/>
                </div>
                <div className="flex w-full gap-12">
                  <BarChartComponent className="flex-[0.6]" data={chartAgeGroupAndGenderValue}/>
                  <HorizontalBarChartComponent className="flex-[0.4]" data={mostUsedServicesInTheLastYearValue}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}