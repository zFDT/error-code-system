import { defineEventHandler, getQuery } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const q = (getQuery(event)?.query as string)?.toString().toUpperCase() || ''
  console.log('[API] /api/error-code 请求参数:', q)
  if (!q) return { code: 0, data: [] }

  try {
    const errors = await prisma.error.findMany({
      where: {
        errorCode: {
          startsWith: q
        }
      },
      include: {
        module: {
          include: {
            project: true
          }
        }
      }
    })

    const data = errors.map(e => ({
      errorCode: e.errorCode,
      projectName: e.module?.project?.name || '',
      moduleName: e.module?.name || '',
      name: e.name,
      description: e.description
    }))

    console.log('[API] /api/error-code 响应内容:', data)
    return { code: 0, data }
  } catch (err: any) {
    console.error('[API] /api/error-code 数据库错误:', err?.message || err)
    return {
      code: 500,
      message: '数据库未找到 errorCode 字段，请检查数据库结构并同步 Prisma schema。'
    }
  }
})
