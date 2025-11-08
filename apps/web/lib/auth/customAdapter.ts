import { PrismaClient } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"
import { prisma } from "./prisma"

export function CustomAdapter(p: PrismaClient = prisma): Adapter {
  return {
    createUser: async (data) => {
      const user = await p.user.create({
        data: {
          email: data.email,
          name: data.name,
          role: "USER",
          emailVerified: data.emailVerified
        }
      })
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        role: user.role
      }
    },
    getUser: async (id) => {
      const user = await p.user.findUnique({ where: { id } })
      if (!user) return null
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        role: user.role
      }
    },
    getUserByEmail: async (email) => {
      const user = await p.user.findUnique({ where: { email } })
      if (!user) return null
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        role: user.role
      }
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const account = await p.account.findUnique({
        where: {
          provider_providerAccountId: { provider, providerAccountId }
        },
        include: { user: true }
      })
      if (!account) return null
      const { user } = account
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        role: user.role
      }
    },
    updateUser: async (data) => {
      const user = await p.user.update({
        where: { id: data.id },
        data
      })
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        role: user.role
      }
    },
    linkAccount: async (data) => {
      await p.account.create({ data })
      return data
    },
    createSession: async (data) => {
      const session = await p.session.create({ data })
      return session
    },
    getSessionAndUser: async (sessionToken) => {
      const session = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      })
      if (!session) return null
      const { user } = session
      return {
        session: {
          id: session.id,
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          role: user.role
        }
      }
    },
    updateSession: async (data) => {
      const session = await p.session.update({
        where: { sessionToken: data.sessionToken },
        data
      })
      return session
    },
    deleteSession: async (sessionToken) => {
      await p.session.delete({ where: { sessionToken } })
    }
  }
}