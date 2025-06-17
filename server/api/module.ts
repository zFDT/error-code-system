import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    const query = getQuery(event)
    console.log('[API] /api/module 请求参数:', query)
    // 查询所有模块
    const where = query.projectId ? { projectId: Number(query.projectId) } : {}
    const modules = await prisma.module.findMany({
      where,
      select: { id: true, name: true, moduleCode: true, projectId: true }
    })
    console.log('[API] /api/module 响应内容:', modules)
    return { code: 0, data: modules }
  }
  if (method === 'POST') {
    const body = await readBody(event)
    console.log('[API] /api/module 请求参数:', body)
    const { name, moduleCode, projectId } = body
    if (!name || !moduleCode || !projectId) {
      const res = { code: 1, message: '模块名、编号和项目ID不能为空' }
      console.log('[API] /api/module 响应内容:', res)
      return res
    }
    // 检查同项目下编号唯一
    const exists = await prisma.module.findFirst({
      where: { projectId: Number(projectId), moduleCode }
    })
    if (exists) {
      const res = { code: 2, message: '模块编号已存在' }
      console.log('[API] /api/module 响应内容:', res)
      return res
    }
    const module = await prisma.module.create({
      data: { name, moduleCode, projectId: Number(projectId) }
    })
    console.log('[API] /api/module 响应内容:', module)
    return { code: 0, data: module }
  }
})
