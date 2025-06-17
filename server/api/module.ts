import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    // 查询所有模块
    const { projectId } = getQuery(event)
    const where = projectId ? { projectId: Number(projectId) } : {}
    const modules = await prisma.module.findMany({
      where,
      select: { id: true, name: true, moduleCode: true, projectId: true }
    })
    return { code: 0, data: modules }
  }
  if (method === 'POST') {
    // 添加模块
    const body = await readBody(event)
    const { name, moduleCode, projectId } = body
    if (!name || !moduleCode || !projectId) {
      return { code: 1, message: '模块名、编号和项目ID不能为空' }
    }
    // 检查同项目下编号唯一
    const exists = await prisma.module.findFirst({
      where: { projectId: Number(projectId), moduleCode }
    })
    if (exists) {
      return { code: 2, message: '模块编号已存在' }
    }
    const module = await prisma.module.create({
      data: { name, moduleCode, projectId: Number(projectId) }
    })
    return { code: 0, data: module }
  }
})
