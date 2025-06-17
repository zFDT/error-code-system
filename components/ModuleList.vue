<template>
  <div>
    <h1>模块列表</h1>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="border:1px solid #ddd;padding:8px;">模块名称</th>
          <th style="border:1px solid #ddd;padding:8px;">模块编号</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="2">加载中...</td>
        </tr>
        <tr v-else-if="modules.length">
          <template v-for="module in modules" :key="module.moduleCode">
            <tr>
              <td>{{ module.name }}</td>
              <td>{{ module.moduleCode }}</td>
            </tr>
          </template>
        </tr>
        <tr v-else-if="!loading">
          <td colspan="2">暂无模块数据。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ModuleList',
  setup() {
    const modules = ref<any[]>([]);
    const loading = ref<boolean>(true);

    const fetchModules = async () => {
      const res = await axios.get('/api/module');
      modules.value = res.data.data || [];
      loading.value = false;
    };

    onMounted(fetchModules);

    return {
      modules,
      loading,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-bottom: 1em;
}
</style>