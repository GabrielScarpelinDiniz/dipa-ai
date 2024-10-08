import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export const GET = auth(async function GET(req, { params }) {
  const session = req.auth
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  
})