import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    console.log('[API] /api/project 请求参数:', getQuery(event))
    // 查询所有项目
    const projects = await prisma.project.findMany({
      select: { id: true, name: true, projectCode: true }
    })
    console.log('[API] /api/project 响应内容:', projects)
    return { code: 0, data: projects }
  }
  if (method === 'POST') {
    const body = await readBody(event)
    console.log('[API] /api/project 请求参数:', body)
    const { name, projectCode } = body
    if (!name || !projectCode) {
      const res = { code: 1, message: '项目名和编号不能为空' }
      console.log('[API] /api/project 响应内容:', res)
      return res
    }
    // 检查编号唯一
    const exists = await prisma.project.findUnique({ where: { projectCode } })
    if (exists) {
      const res = { code: 2, message: '项目编号已存在' }
      console.log('[API] /api/project 响应内容:', res)
      return res
    }
    const project = await prisma.project.create({ data: { name, projectCode } })
    console.log('[API] /api/project 响应内容:', project)
    return { code: 0, data: project }
  }
})
