import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type ResponseData = {
  message: string;
};

export const GET = auth(async function GET(req, { params }) {
  const session = req.auth
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const chats = await prisma.chat.findMany({
    where: {
        userId: session.user?.id
    },
    select: {
        id: true,
        createdAt: true,
        updatedAt: true
    }
  });
  if (chats.length === 0) {
    return new Response(JSON.stringify({
        message: "No chats found",
        chats: []
    }), {
      status: 200,
    });
  }
  return new Response(JSON.stringify({
        message: "Chats found",
        chats
  }), {
    status: 200,
  });
})