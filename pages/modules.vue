<template>
  <div>
    <h1>模块管理</h1>
    <ModuleList />
    <ModuleCreate />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const projectId = route.query.project
// 根据 projectId 查询模块列表
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>