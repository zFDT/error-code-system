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
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4">加载中...</td>
        </tr>
        <template v-else-if="modules.length">
          <tr v-for="module in modules" :key="module.id">
            <td>
              <a href="javascript:;" @click.prevent="goToErrorCodes(module)">{{ module.name }}</a>
            </td>
            <td>{{ module.moduleCode }}</td>
            <td>{{ module.projectName }}</td>
            <td>
              <button @click="openEditDialog(module)">编辑</button>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="4">暂无模块数据。</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 编辑模块名称弹窗 -->
  <div v-if="editDialogVisible" class="modal-overlay">
    <div class="modal">
      <h2>编辑模块名称</h2>
      <input v-model="editModuleName" type="text" />
      <div class="modal-actions">
        <button @click="submitEdit">保存</button>
        <button @click="closeEditDialog">取消</button>
      </div>
      <div v-if="editError" class="error">{{ editError }}</div>
    </div>
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
const editDialogVisible = ref(false)
const editModule = ref<any>(null)
const editModuleName = ref('')
const editError = ref('')

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

function openEditDialog(module: any) {
  editModule.value = module
  editModuleName.value = module.name
  editError.value = ''
  editDialogVisible.value = true
}
function closeEditDialog() {
  editDialogVisible.value = false
  editModule.value = null
  editModuleName.value = ''
  editError.value = ''
}
const submitEdit = async () => {
  if (!editModule.value || !editModuleName.value.trim()) {
    editError.value = '模块名称不能为空'
    return
  }
  try {
    const res = await fetch(`/api/module/${editModule.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editModuleName.value.trim() })
    })
    const data = await res.json()
    if (data.code !== 0) {
      editError.value = data.message || '修改失败'
    } else {
      closeEditDialog()
      fetchModules()
    }
  } catch (e: any) {
    editError.value = e.message
  }
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
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 24px 32px;
  border-radius: 8px;
  min-width: 320px;
  box-shadow: 0 2px 8px #8882;
}
.modal-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
.error {
  color: red;
  margin-top: 8px;
}
</style>