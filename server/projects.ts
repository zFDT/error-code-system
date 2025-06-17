/*
 * @Date: 2025-06-16 09:52:02
 * @LastEditors: zhanghongxin2 zhanghongxin2@dreame.tech
 * @LastEditTime: 2025-06-16 09:52:21
 * @FilePath: \error-code-system\server\projects.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  
  switch (event.req.method) {
    case 'POST':
      // 创建新项目
      const project = await prisma.project.create({
        data: {
          name: body.name,
          code: body.code,
        },
      });
      return project;
    case 'GET':
      // 列出所有项目
      const projects = await prisma.project.findMany();
      return projects;
    default:
      return { message: 'Method not allowed' };
  }
});