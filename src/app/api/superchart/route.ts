import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

export const GET = auth(async function GET(req) {
    const session = req.auth;

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const cluster = req.nextUrl.searchParams.get("cluster");
    const faixaEtaria = req.nextUrl.searchParams.get("faixaEtaria");
    const doencaRelacionada = req.nextUrl.searchParams.get("doencaRelacionada");
    const categoriaServico = req.nextUrl.searchParams.get("categoriaServico");
    const descricaoServico = req.nextUrl.searchParams.get("descricaoServico");
    const generoServico = req.nextUrl.searchParams.get("generoServico");
    const elegibilidade = req.nextUrl.searchParams.get("elegibilidade");
    const tipoPlano = req.nextUrl.searchParams.get("tipoPlano");

    if (!cluster) {
        return new Response("Cluster is required", { status: 400 });
    }

    const filters = {
        ...(faixaEtaria && { ageGroup: faixaEtaria }),
        ...(doencaRelacionada && { relatedDisease: doencaRelacionada }),
        ...(categoriaServico && { claimServiceCategory: categoriaServico }),
        ...(descricaoServico && { claimServiceDescription: descricaoServico }),
        ...(generoServico && { gender: generoServico }),
        ...(elegibilidade && { role: elegibilidade }),
        ...(tipoPlano && { planDescription: tipoPlano }),
    };

    if (isNaN(Number(cluster))) {
        return new Response("Cluster must be a number", { status: 400 });
    }

    // Construir as condições de filtro dinamicamente
    const filterConditions = Object.keys(filters)
        .map((key, index) => `"${key}" = $${index + 2}`) // +2 porque o $1 será o "cluster"
        .join(' AND ');

    // Montar a query SQL
    const query = `
        SELECT
            DATE_TRUNC('month', "claimDate") AS "month",
            SUM("claimAmount") AS total,
            COUNT("id") AS number,
            AVG("claimAmount") AS "averageAmount"
        FROM "Claim"
        WHERE "cluster" = $1 ${filterConditions ? `AND ${filterConditions}` : ''}
        GROUP BY "month"
    `;

    // Criar array de valores para os filtros
    const values = [Number(cluster), ...Object.values(filters)];

    // Executar a query com os valores dos filtros
    const claims = await prisma.$queryRawUnsafe(query, ...values);

    // Parsing dos resultados
    const claimsParsed = JSON.parse(JSON.stringify(claims, (key, value) => {
        if (key === "total" || key === "number") {
            return parseInt(value);
        }
        return value;
    }));
    console.log(claimsParsed);
    return new Response(JSON.stringify({
        message: "Claims found",
        claims: claimsParsed,
    }), {
        status: 200,
    });
});
