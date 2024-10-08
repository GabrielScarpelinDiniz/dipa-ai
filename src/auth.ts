import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    error: "/error",
  },
  callbacks: {
    signIn: async ({ user }) => {
        const { email, name, image } = user
        if (email?.endsWith("@sou.inteli.edu.br")) {
            const user = await prisma.user.upsert({
                where: { email },
                create: { email, name, image },
                update: {},
            });
            return true;
        }
        return false;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        // Garante que o ID será uma string antes de atribuir
        if (user?.id) {
          session.user.id = user.id;
        }
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      // Adiciona o ID do usuário ao token, caso o usuário esteja presente
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  }
})