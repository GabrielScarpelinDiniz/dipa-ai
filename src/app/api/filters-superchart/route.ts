import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
  const session = req.auth;

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    // Ajustando a consulta para retornar apenas strings diretas
    const elegibilidade = await prisma.$queryRaw<{ role: string }[]>`
      SELECT DISTINCT role FROM "Claim"
    `;
    const tipoPlano = await prisma.$queryRaw<{ planDescription: string }[]>`
      SELECT DISTINCT "planDescription" FROM "Claim"
    `;
    const faixaEtaria = await prisma.$queryRaw<{ ageGroup: string }[]>`
      SELECT DISTINCT "ageGroup" FROM "Claim"
    `;
    const doencaRelacionada = await prisma.$queryRaw<{ relatedDisease: string }[]>`
      SELECT DISTINCT "relatedDisease" FROM "Claim"
    `;
    const categoriaServico = await prisma.$queryRaw<{ claimServiceCategory: string }[]>`
      SELECT DISTINCT "claimServiceCategory" FROM "Claim"
    `;
    const descricaoServico = await prisma.$queryRaw<{ claimServiceDescription: string }[]>`
      SELECT DISTINCT "claimServiceDescription" FROM "Claim"
    `;
    const generoServico = await prisma.$queryRaw<{ gender: string }[]>`
      SELECT DISTINCT gender FROM "Claim"
    `;

    // Extraindo apenas os valores dos objetos retornados
    const groupedFilters = {
      elegibilidade: {
        label: "Elegibilidade",
        options: elegibilidade.map((item) => item.role),
      },
      tipoPlano: {
        label: "Tipo de plano",
        options: tipoPlano.map((item) => item.planDescription),
      },
      faixaEtaria: {
        label: "Faixa etária",
        options: faixaEtaria.map((item) => item.ageGroup),
      },
      doencaRelacionada: {
        label: "Doença relacionada",
        options: doencaRelacionada.map((item) => item.relatedDisease),
      },
      categoriaServico: {
        label: "Categoria de serviço",
        options: categoriaServico.map((item) => item.claimServiceCategory),
      },
      descricaoServico: {
        label: "Descrição do serviço",
        options: descricaoServico.map((item) => item.claimServiceDescription),
      },
      generoServico: {
        label: "Gênero",
        options: generoServico.map((item) => item.gender),
      },
    };

    return new Response(
      JSON.stringify({
        message: "Filters found",
        filters: groupedFilters,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Error retrieving claims", {
      status: 500,
    });
  }
});
