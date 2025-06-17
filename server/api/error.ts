import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const query = getQuery(event)
    console.log('[API] /api/error 请求参数:', query)
    // 查询所有错误
    const where = query.moduleId ? { moduleId: Number(query.moduleId) } : {}
    const errors = await prisma.error.findMany({
      where,
      select: { id: true, name: true, description: true, errorCode: true, moduleId: true }
    })
    console.log('[API] /api/error 响应内容:', errors)
    return { code: 0, data: errors }
  }
  if (method === 'POST') {
    const body = await readBody(event)
    console.log('[API] /api/error 请求参数:', body)
    const { name, description, moduleId } = body
    if (!name || !description || !moduleId) {
      const res = { code: 1, message: '错误名、描述和模块ID不能为空' }
      console.log('[API] /api/error 响应内容:', res)
      return res
    }
    // 获取项目编号和模块编号
    const module = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
      include: { project: true }
    })
    if (!module) {
      const res = { code: 2, message: '模块不存在' }
      console.log('[API] /api/error 响应内容:', res)
      return res
    }
    // 查询当前模块下已有错误数量
    const count = await prisma.error.count({ where: { moduleId: Number(moduleId) } })
    const errorNum = String(count + 1).padStart(3, '0') // 修正：编号从001开始
    const errorCode = `${module.project.projectCode}-${module.moduleCode}-${errorNum}`
    // 创建错误
    const error = await prisma.error.create({
      data: { name, description, errorCode, moduleId: Number(moduleId) }
    })
    console.log('[API] /api/error 响应内容:', error)
    return { code: 0, data: error }
  }
})
