import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const GET = auth(async function GET(req) {
  const session = req.auth
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const skipStr = req.nextUrl.searchParams.get("skip") || 0;
  const takeStr = req.nextUrl.searchParams.get("take") || 100;
  const role = req.nextUrl.searchParams.get("eligibility");
  const planDescription = req.nextUrl.searchParams.get("plan");
  const gender = req.nextUrl.searchParams.get("gender");
  const usageType = req.nextUrl.searchParams.get("usageType");
  const ageGroup = req.nextUrl.searchParams.get("ageGroup");
  const dateFrom = req.nextUrl.searchParams.get("dateFrom");
  const dateTo = req.nextUrl.searchParams.get("dateTo");

  const skip = parseInt(skipStr as string);
  const take = parseInt(takeStr as string);

  const filters = {
    ...(role && { role }),
    ...(planDescription && { planDescription }),
    ...(gender && { gender }),
    ...(usageType && { usageType }),
    ...(ageGroup && { ageGroup }),
    ...(dateFrom && dateTo && {
      claimDate: {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      },
    }),
  };

  const claims = await prisma.claim.findMany({
    take,
    skip,
    where: filters,
  });
  if (claims.length === 0) {
    return new Response(JSON.stringify({
        message: "No claims found",
        claims: []
    }), {
      status: 200,
    });
  }
  return new Response(JSON.stringify({
        message: "Claims found",
        claims
  }), {
    status: 200,
  });
})