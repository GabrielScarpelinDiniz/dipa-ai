import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const PATCH = auth(async function PATCH(req, { params }) {
  const session = req.auth
  if (!session || session.user?.id !== params?.id) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const { temperatute } = await req.json();
  if (!temperatute) {
    return new Response("Bad Request", {
      status: 400,
    });
  }
  
  const userUpdate = await prisma.user.update({
    where: {
      id: params?.id
    },
    data: {
      temperature: temperatute,
    }
  });
  return new Response(JSON.stringify({
        message: "Temperature updated",
  }), {
    status: 200,
  });
})