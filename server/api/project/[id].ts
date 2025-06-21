import { getPrisma } from '../../prisma'
const prisma = getPrisma()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = event.context.params?.id || event.node.req.url?.split('/').pop();
  if (method === 'PATCH') {
    const body = await readBody(event);
    const { name } = body;
    if (!id || !name) {
      const res = { code: 1, message: '参数缺失' };
      console.log('[API] /api/project/[id] PATCH 响应内容:', res);
      return res;
    }
    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: { name }
    });
    console.log('[API] /api/project/[id] PATCH 响应内容:', updated);
    return { code: 0, data: updated };
  }
  // 可选：支持 GET 查询单个项目
  if (method === 'GET') {
    if (!id) return { code: 1, message: '参数缺失' };
    const project = await prisma.project.findUnique({ where: { id: Number(id) } });
    return { code: 0, data: project };
  }
});
