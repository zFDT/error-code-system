import { defineEventHandler, getQuery } from 'h3'
import { getPrisma } from '../prisma'

const prisma = getPrisma()

function isValidCode(str: string, len: number) {
  return typeof str === 'string' && str.length <= len && /^[A-Z0-9]*$/.test(str)
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const projectCode = (query.projectCode || '').toString().toUpperCase()
  const moduleCode = (query.moduleCode || '').toString().toUpperCase()
  const errorCode = (query.errorCode || '').toString().toUpperCase()
  console.log('[API] /api/error-code 请求参数:', { projectCode, moduleCode, errorCode })
  if (!projectCode && !moduleCode && !errorCode) return { code: 0, data: [] }

  // 参数校验
  if (
    (projectCode && !isValidCode(projectCode, 3)) ||
    (moduleCode && !isValidCode(moduleCode, 2)) ||
    (errorCode && !isValidCode(errorCode, 3))
  ) {
    return { code: 400, message: '参数格式错误' }
  }

  try {
    // 只输 projectCode
    if (projectCode && !moduleCode && !errorCode) {
      // 查找所有匹配项目
      const projects = await prisma.project.findMany({
        where: { projectCode: { startsWith: projectCode } },
        include: { modules: true }
      })
      // 查找所有错误码
      const errors = await prisma.error.findMany({
        where: { errorCode: { startsWith: projectCode } },
        include: { module: { include: { project: true } } }
      })
      // 以 moduleId 为 key
      const errorMap = new Map<number, any[]>()
      errors.forEach(e => {
        if (!errorMap.has(e.moduleId)) errorMap.set(e.moduleId, [])
        errorMap.get(e.moduleId)!.push({
          errorCode: e.errorCode,
          projectName: e.module?.project?.name || '',
          moduleName: e.module?.name || '',
          name: e.name,
          description: e.description,
          moduleId: e.moduleId,
          projectId: e.module?.project?.id
        })
      })
      let data: any[] = []
      for (const p of projects) {
        if (p.modules.length === 0) {
          data.push({
            errorCode: `${p.projectCode}`,
            projectName: p.name,
            moduleName: '',
            name: '',
            description: '',
            moduleId: undefined,
            projectId: p.id
          })
        } else {
          for (const m of p.modules) {
            if (errorMap.has(m.id)) {
              data.push(...errorMap.get(m.id)!)
            } else {
              data.push({
                errorCode: `${p.projectCode}-${m.moduleCode}`,
                projectName: p.name,
                moduleName: m.name,
                name: '',
                description: '',
                moduleId: m.id,
                projectId: p.id
              })
            }
          }
        }
      }
      // 优化排序：先错误码，再模块，再项目
      data.sort((a, b) => {
        const getType = (x: any) => x.name ? 0 : (x.moduleName ? 1 : 2)
        return getType(a) - getType(b)
      })
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
    // 只输 moduleCode
    if (!projectCode && moduleCode && !errorCode) {
      // 查找所有匹配模块
      const modules = await prisma.module.findMany({
        where: { moduleCode: { startsWith: moduleCode } },
        include: { project: true }
      })
      // 查找所有错误码
      const errors = await prisma.error.findMany({
        where: { errorCode: { contains: `-${moduleCode}-` } },
        include: { module: { include: { project: true } } }
      })
      // 以 moduleId 为 key
      const errorMap = new Map<number, any[]>()
      errors.forEach(e => {
        if (!errorMap.has(e.moduleId)) errorMap.set(e.moduleId, [])
        errorMap.get(e.moduleId)!.push({
          errorCode: e.errorCode,
          projectName: e.module?.project?.name || '',
          moduleName: e.module?.name || '',
          name: e.name,
          description: e.description,
          moduleId: e.moduleId,
          projectId: e.module?.project?.id
        })
      })
      let data: any[] = []
      for (const m of modules) {
        if (errorMap.has(m.id)) {
          data.push(...errorMap.get(m.id)!)
        } else {
          data.push({
            errorCode: `${m.project.projectCode}-${m.moduleCode}`,
            projectName: m.project?.name || '',
            moduleName: m.name,
            name: '',
            description: '',
            moduleId: m.id,
            projectId: m.project?.id
          })
        }
      }
      // 优化排序：先错误码，再模块，再项目
      data.sort((a, b) => {
        const getType = (x: any) => x.name ? 0 : (x.moduleName ? 1 : 2)
        return getType(a) - getType(b)
      })
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
    // 只输 errorCode
    if (!projectCode && !moduleCode && errorCode) {
      // 先查所有包含 -errorCode 的错误码，再过滤最后一段以 errorCode 开头
      const errors = await prisma.error.findMany({
        where: {
          errorCode: { contains: `-${errorCode}` }
        },
        include: { module: { include: { project: true } } }
      })
      const filtered = errors.filter(e => {
        const parts = e.errorCode.split('-')
        return parts.length > 2 && parts[2].startsWith(errorCode)
      })
      const data = filtered.map(e => ({
        errorCode: e.errorCode,
        projectName: e.module?.project?.name || '',
        moduleName: e.module?.name || '',
        name: e.name,
        description: e.description,
        moduleId: e.moduleId,
        projectId: e.module?.project?.id
      }))
      // 优化排序：先错误码，再模块，再项目
      data.sort((a, b) => {
        const getType = (x: any) => x.name ? 0 : (x.moduleName ? 1 : 2)
        return getType(a) - getType(b)
      })
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
    // projectCode + moduleCode 且 errorCode 为空，返回所有模块和错误码
    if (projectCode && moduleCode && !errorCode) {
      // 查找所有匹配模块
      const modules = await prisma.module.findMany({
        where: {
          moduleCode: { startsWith: moduleCode },
          project: { projectCode: { startsWith: projectCode } }
        },
        include: { project: true }
      })
      // 查找所有匹配错误码
      const errors = await prisma.error.findMany({
        where: {
          errorCode: { startsWith: `${projectCode}-${moduleCode}` }
        },
        include: { module: { include: { project: true } } }
      })
      // 以 moduleId 为 key
      const errorMap = new Map<number, any[]>()
      errors.forEach(e => {
        if (!errorMap.has(e.moduleId)) errorMap.set(e.moduleId, [])
        errorMap.get(e.moduleId)!.push({
          errorCode: e.errorCode,
          projectName: e.module?.project?.name || '',
          moduleName: e.module?.name || '',
          name: e.name,
          description: e.description,
          moduleId: e.moduleId,
          projectId: e.module?.project?.id
        })
      })
      let data: any[] = []
      for (const m of modules) {
        if (errorMap.has(m.id)) {
          data.push(...errorMap.get(m.id)!)
        } else {
          data.push({
            errorCode: `${m.project.projectCode}-${m.moduleCode}`,
            projectName: m.project?.name || '',
            moduleName: m.name,
            name: '',
            description: '',
            moduleId: m.id,
            projectId: m.project?.id
          })
        }
      }
      // 优化排序：先错误码，再模块，再项目
      data.sort((a, b) => {
        const getType = (x: any) => x.name ? 0 : (x.moduleName ? 1 : 2)
        return getType(a) - getType(b)
      })
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
    // projectCode + errorCode，moduleCode 为空
    if (projectCode && !moduleCode && errorCode) {
      // 查找所有 errorCode 以 projectCode- 开头的错误码，再过滤最后一段以 errorCode 开头
      const errors = await prisma.error.findMany({
        where: {
          errorCode: { startsWith: `${projectCode}-` }
        },
        include: { module: { include: { project: true } } }
      })
      const filtered = errors.filter(e => {
        const parts = e.errorCode.split('-')
        return parts.length > 2 && parts[2].startsWith(errorCode)
      })
      const data = filtered.map(e => ({
        errorCode: e.errorCode,
        projectName: e.module?.project?.name || '',
        moduleName: e.module?.name || '',
        name: e.name,
        description: e.description,
        moduleId: e.moduleId,
        projectId: e.module?.project?.id
      }))
      // 优化排序：先错误码，再模块，再项目
      data.sort((a, b) => {
        const getType = (x: any) => x.name ? 0 : (x.moduleName ? 1 : 2)
        return getType(a) - getType(b)
      })
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
    // 如果 error 表有 projectCode、moduleCode、errorCode 字段，直接用 startsWith 匹配
    if (projectCode || moduleCode || errorCode) {
      const where: any = {}
      if (projectCode) where.projectCode = { startsWith: projectCode }
      if (moduleCode) where.moduleCode = { startsWith: moduleCode }
      if (errorCode) where.errorCode = { startsWith: errorCode }
      const errors = await prisma.error.findMany({
        where,
        include: { module: { include: { project: true } } }
      })
      const data = errors.map(e => ({
        errorCode: e.errorCode,
        projectName: e.module?.project?.name || '',
        moduleName: e.module?.name || '',
        name: e.name,
        description: e.description,
        moduleId: e.moduleId,
        projectId: e.module?.project?.id
      }))
      // 优化排序：先错误码，再模块，再项目
      data.sort((a, b) => {
        const getType = (x: any) => x.name ? 0 : (x.moduleName ? 1 : 2)
        return getType(a) - getType(b)
      })
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
  } catch (err: any) {
    console.error('[API] /api/error-code 数据库错误:', err?.message || err)
    return {
      code: 500,
      message: '数据库未找到 errorCode 字段，请检查数据库结构并同步 Prisma schema。'
    }
  }
})
