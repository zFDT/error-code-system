import { getPrisma } from '../../prisma'
const prisma = getPrisma()

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = event.context.params?.id || event.node.req.url?.split('/').pop();
  if (method === 'PATCH') {
    const body = await readBody(event);
    const { name, description } = body;
    if (!id || !name || !description) {
      return { code: 1, message: '参数缺失' };
    }
    const updated = await prisma.error.update({
      where: { id: Number(id) },
      data: { name, description }
    });
    return { code: 0, data: updated };
  }
  // 可选：支持 GET 查询单个错误码
  if (method === 'GET') {
    if (!id) return { code: 1, message: '参数缺失' };
    const error = await prisma.error.findUnique({ where: { id: Number(id) } });
    return { code: 0, data: error };
  }
});
