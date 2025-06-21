import { getPrisma } from '../prisma'

const prisma = getPrisma()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  if (method === 'GET') {
    const query = getQuery(event)
    // 参数校验
    if (query.project && isNaN(Number(query.project))) {
      return { code: 1, message: '项目ID格式错误' }
    }
    const where = query.project ? { projectId: Number(query.project) } : {}
    const modules = await prisma.module.findMany({
      where,
      select: {
        id: true,
        name: true,
        moduleCode: true,
        projectId: true,
        project: { select: { name: true } }
      }
    })
    const result = modules.map(m => ({
      id: m.id,
      name: m.name,
      moduleCode: m.moduleCode,
      projectId: m.projectId,
      projectName: m.project?.name || ''
    }))
    return { code: 0, data: result }
  }
  if (method === 'POST') {
    const body = await readBody(event)
    const { name, moduleCode, projectId } = body
    if (!name || !moduleCode || !projectId) {
      return { code: 1, message: '模块名、编号和项目ID不能为空' }
    }
    if (isNaN(Number(projectId))) {
      return { code: 2, message: '项目ID格式错误' }
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
