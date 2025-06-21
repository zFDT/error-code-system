import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-expect-error: globalThis.prisma 可能未定义，开发环境下用于复用实例，防止多次实例化
  if (!globalThis.prisma) {
    // @ts-expect-error: globalThis.prisma 赋值用于开发环境下复用 PrismaClient 实例
    globalThis.prisma = new PrismaClient()
  }
  // @ts-expect-error: 读取 globalThis.prisma 以实现开发环境下单例复用
  prisma = globalThis.prisma
}

export function getPrisma() {
  return prisma
}