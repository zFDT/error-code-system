<template>
  <div>
    <h1>模块列表</h1>
    <button @click="showAdd = true">添加模块</button>
    <AddModuleModal
      v-if="showAdd"
      :project-id="projectId"
      @close="showAdd = false"
      @success="handleAddSuccess"
    />
    <table class="module-table">
      <thead>
        <tr>
          <th>模块名称</th>
          <th>模块编码</th>
          <th>项目名称</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="3">加载中...</td>
        </tr>
        <template v-else-if="modules.length">
          <tr v-for="module in modules" :key="module.id">
            <td>
              <a href="javascript:;" @click.prevent="goToErrorCodes(module)">{{ module.name }}</a>
            </td>
            <td>{{ module.moduleCode }}</td>
            <td>{{ module.projectName }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="3">暂无模块数据。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddModuleModal from '~/components/AddModuleModal.vue'

const route = useRoute()
const router = useRouter()
const projectId = route.query.project as string
const modules = ref<any[]>([])
const loading = ref(false)
const showAdd = ref(false)

async function fetchModules() {
  loading.value = true
  const res = await fetch(`/api/module?project=${projectId}`)
  const json = await res.json()
  modules.value = json.data // 修正：只取data字段
  loading.value = false
}

function handleAddSuccess() {
  showAdd.value = false
  fetchModules()
}

function goToErrorCodes(module: any) {
  router.push({ path: '/errors', query: { moduleId: module.id, projectId } })
}

onMounted(() => {
  fetchModules()
})
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.module-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
}
.module-table th, .module-table td {
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  text-align: left;
}
.module-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}
.module-table tr:hover td {
  background: #f5f7fa;
}
a {
  color: #1677ff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>