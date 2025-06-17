<!--
 * @Date: 2025-06-16 12:13:45
 * @LastEditors: zhanghongxin2 zhanghongxin2@dreame.tech
 * @LastEditTime: 2025-06-17 14:17:32
 * @FilePath: \error-code-system\pages\projects.vue
-->
<template>
  <div>
    <h1>项目管理</h1>
    <ProjectCreate />
  </div>
</template>

<script lang="ts">
import ProjectCreate from '@/components/ProjectCreate.vue';

export default {
  components: {
    ProjectCreate,

  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>