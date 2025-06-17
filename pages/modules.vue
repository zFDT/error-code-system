<template>
  <div>
    <h1>模块管理</h1>
    <ModuleList />
    <ModuleCreate />
  </div>
</template>

<script lang="ts">
import ModuleList from '@/components/ModuleList.vue';
import ModuleCreate from '@/components/ModuleCreate.vue';

export default {
  components: {
    ModuleList,
    ModuleCreate
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>