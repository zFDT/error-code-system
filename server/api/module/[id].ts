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
      console.log('[API] /api/module/[id] PATCH 响应内容:', res);
      return res;
    }
    const updated = await prisma.module.update({
      where: { id: Number(id) },
      data: { name }
    });
    console.log('[API] /api/module/[id] PATCH 响应内容:', updated);
    return { code: 0, data: updated };
  }
  // 可选：支持 GET 查询单个模块
  if (method === 'GET') {
    if (!id) return { code: 1, message: '参数缺失' };
    const module = await prisma.module.findUnique({ where: { id: Number(id) } });
    return { code: 0, data: module };
  }
});
