import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    // 查询所有错误
    const { moduleId } = getQuery(event)
    const where = moduleId ? { moduleId: Number(moduleId) } : {}
    const errors = await prisma.error.findMany({
      where,
      select: { id: true, name: true, description: true, errorCode: true, moduleId: true }
    })
    return { code: 0, data: errors }
  }
  if (method === 'POST') {
    // 添加错误
    const body = await readBody(event)
    const { name, description, moduleId } = body
    if (!name || !description || !moduleId) {
      return { code: 1, message: '错误名、描述和模块ID不能为空' }
    }
    // 获取项目编号和模块编号
    const module = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
      include: { project: true }
    })
    if (!module) {
      return { code: 2, message: '模块不存在' }
    }
    // 查询当前模块下已有错误数量
    const count = await prisma.error.count({ where: { moduleId: Number(moduleId) } })
    const errorNum = String(count).padStart(3, '0')
    const errorCode = `${module.project.projectCode}-${module.moduleCode}-${errorNum}`
    // 创建错误
    const error = await prisma.error.create({
      data: { name, description, errorCode, moduleId: Number(moduleId) }
    })
    return { code: 0, data: error }
  }
})
