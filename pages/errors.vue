<template>
  <div>
    <h1>错误管理</h1>
    <ErrorList />
    <ErrorCreate />
  </div>
</template>

<script lang="ts">
import ErrorList from '@/components/ErrorList.vue';
import ErrorCreate from '@/components/ErrorCreate.vue';

export default {
  components: {
    ErrorList,
    ErrorCreate
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>