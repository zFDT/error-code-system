import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    // 查询所有项目
    const projects = await prisma.project.findMany({
      select: { id: true, name: true, projectCode: true }
    })
    return { code: 0, data: projects }
  }
  if (method === 'POST') {
    // 添加项目
    const body = await readBody(event)
    const { name, projectCode } = body
    if (!name || !projectCode) {
      return { code: 1, message: '项目名和编号不能为空' }
    }
    // 检查编号唯一
    const exists = await prisma.project.findUnique({ where: { projectCode } })
    if (exists) {
      return { code: 2, message: '项目编号已存在' }
    }
    const project = await prisma.project.create({ data: { name, projectCode } })
    return { code: 0, data: project }
  }
})
