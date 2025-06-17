<!--
 * @Date: 2025-06-16 12:13:45
 * @LastEditors: zhanghongxin2 zhanghongxin2@dreame.tech
 * @LastEditTime: 2025-06-17 14:06:59
 * @FilePath: \error-code-system\pages\projects.vue
-->
<template>
  <div>
    <h1>项目管理</h1>
    <ProjectCreate />
    <!-- <ProjectList /> -->
  </div>
</template>

<script lang="ts">
import ProjectCreate from '@/components/ProjectCreate.vue';
// import ProjectList from '@/components/ProjectList.vue';

export default {
  components: {
    ProjectCreate,
    // ProjectList,
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>