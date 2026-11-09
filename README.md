# 设备错误码查询系统

面向设备（3D 打印机 / IoT 设备）的错误码管理与查询系统：错误码 CRUD、模块归类、项目维度管理，支持搜索与筛选。

## 技术栈

- **前端**：Nuxt 3 + Vue 3
- **数据层**：Prisma ORM
- **页面**：错误码 / 模块 / 项目 / 错误分类

## 目录

```
pages/           # 页面（error-code / errors / index / modules / projects）
server/          # Nuxt Server API + Prisma
components/      # 组件
prisma/          # 数据模型
```

## 运行

```bash
npm install
npm run dev
```
