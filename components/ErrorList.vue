<template>
  <div>
    <h1>错误列表</h1>
    <table>
      <thead>
        <tr>
          <th>错误码</th>
          <th>错误名称</th>
          <th>错误描述</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="error in errors" :key="error.errorCode">
          <td>{{ error.errorCode }}</td>
          <td>{{ error.name }}</td>
          <td>{{ error.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import store from '@/store';

export default defineComponent({
  name: 'ErrorList',
  setup() {
    const errors = computed(() => store.state.errors);

    return {
      errors,
    };
  },
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>