import { defineEventHandler, getQuery } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const q = (getQuery(event)?.query as string)?.toString().toUpperCase() || ''
  console.log('[API] /api/error-code 请求参数:', q)
  if (!q) return { code: 0, data: [] }

  try {
    // 判断是否为 1~3 位 projectCode 前缀（如 0、00、006）或 XXX-、XXX-XX 查询
    const projectPrefixMatch = q.match(/^(\d{1,3})$/)
    const modulePrefixMatch = q.match(/^(\d{3})-(\d{0,2})$/)
    if (projectPrefixMatch) {
      const projectCodePrefix = projectPrefixMatch[1]
      // 查找所有匹配项目
      const projects = await prisma.project.findMany({
        where: {
          projectCode: {
            startsWith: projectCodePrefix
          }
        },
        include: {
          modules: true
        }
      })
      // 查找所有错误码
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
      // 合并：有错误码的模块返回所有错误码，无错误码的模块返回空错误信息
      let data: any[] = []
      for (const p of projects) {
        if (p.modules.length === 0) {
          // 项目下没有模块也要显示
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
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }
    if (modulePrefixMatch) {
      const [_, projectCode, moduleCodePrefix] = modulePrefixMatch
      // 查找所有模块（如果 moduleCodePrefix 为空，则查所有项目下模块，否则按前缀）
      const modules = await prisma.module.findMany({
        where: {
          ...(moduleCodePrefix
            ? { moduleCode: { startsWith: moduleCodePrefix } }
            : {}),
          project: {
            projectCode: projectCode
          }
        },
        include: {
          project: true
        }
      })
      // 查找所有错误码
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
      // 合并：有错误码的模块返回所有错误码，无错误码的模块返回空错误信息
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
      console.log('[API] /api/error-code 响应内容:', data)
      return { code: 0, data }
    }

    // 其它情况，保持原有逻辑
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
      description: e.description,
      moduleId: e.moduleId,
      projectId: e.module?.project?.id
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
