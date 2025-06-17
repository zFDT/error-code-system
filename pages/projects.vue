<template>
  <div>
    <h1>项目管理</h1>
    <ProjectCreate />
    <ProjectList />
  </div>
</template>

<script lang="ts">
import ProjectCreate from '@/components/ProjectCreate.vue';
import ProjectList from '@/components/ProjectList.vue';

export default {
  components: {
    ProjectCreate,
    ProjectList,
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>