<template>
  <div>
    <div class="header-bar">
      <div class="header-left">
        <button @click="goHome">首页</button>
        <button @click="goBack">返回上一页</button>
      </div>
      <div class="header-title">{{ projectName }}-{{ moduleName }}-错误码列表</div>
      <div class="header-right">
        <button @click="showAdd = true">添加错误码</button>
      </div>
    </div>
    <div v-if="showAdd" class="modal-overlay">
      <AddErrorModal
        :module-id="moduleId"
        @close="showAdd = false"
        @success="handleAddSuccess"
      />
    </div>
    <table class="error-table">
      <thead>
        <tr>
          <th>错误码</th>
          <th>错误名称</th>
          <th>错误描述</th>
          <th>编辑</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="4">加载中...</td>
        </tr>
        <template v-else-if="errors.length">
          <tr v-for="error in errors" :key="error.id">
            <td>{{ error.errorCode }}</td>
            <td>{{ error.name }}</td>
            <td>{{ error.description }}</td>
            <td><button @click="openEditDialog(error)">编辑</button></td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="4">暂无错误码数据。</td>
        </tr>
      </tbody>
    </table>

    <!-- 编辑错误码弹窗 -->
    <div v-if="editDialogVisible" class="modal-overlay">
      <div class="modal">
        <h2 class="modal-title">编辑错误码</h2>
        <form @submit.prevent="submitEdit">
          <div class="form-group">
            <label>错误名称：</label>
            <input v-model="editName" type="text" />
          </div>
          <div class="form-group">
            <label>错误描述：</label>
            <input v-model="editDescription" type="text" />
          </div>
          <div v-if="editError" class="error">{{ editError }}</div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">保存</button>
            <button type="button" class="btn btn-cancel" @click="closeEditDialog">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddErrorModal from '~/components/AddErrorModal.vue'

const route = useRoute()
const router = useRouter()
const moduleId = route.query.moduleId as string
const errors = ref<any[]>([])
const loading = ref(false)
const showAdd = ref(false)
const moduleName = ref('')
const projectName = ref('')

async function fetchModuleAndProject() {
  if (!moduleId) return
  // 获取模块信息
  const moduleRes = await fetch(`/api/module/${moduleId}`)
  const moduleJson = await moduleRes.json()
  moduleName.value = moduleJson.data?.name || ''
  const projectId = moduleJson.data?.projectId
  if (projectId) {
    const projectRes = await fetch(`/api/project/${projectId}`)
    const projectJson = await projectRes.json()
    projectName.value = projectJson.data?.name || ''
  }
}

async function fetchErrors() {
  loading.value = true
  const res = await fetch(`/api/error?moduleId=${moduleId}`)
  const json = await res.json()
  errors.value = json.data
  loading.value = false
}

function handleAddSuccess() {
  showAdd.value = false
  fetchErrors()
}
function goHome() {
  router.push('/')
}
function goBack() {
  router.back()
}
const editDialogVisible = ref(false)
const editError = ref('')
const editId = ref('')
const editName = ref('')
const editDescription = ref('')

function openEditDialog(error: any) {
  editId.value = error.id
  editName.value = error.name
  editDescription.value = error.description
  editError.value = ''
  editDialogVisible.value = true
}
function closeEditDialog() {
  editDialogVisible.value = false
  editId.value = ''
  editName.value = ''
  editDescription.value = ''
  editError.value = ''
}
const submitEdit = async () => {
  if (!editName.value.trim() || !editDescription.value.trim()) {
    editError.value = '错误名称和描述不能为空'
    return
  }
  try {
    const res = await fetch(`/api/error/${editId.value}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.value.trim(), description: editDescription.value.trim() })
    })
    const data = await res.json()
    if (data.code !== 0) {
      editError.value = data.message || '修改失败'
    } else {
      closeEditDialog()
      fetchErrors()
    }
  } catch (e: any) {
    editError.value = e.message
  }
}
onMounted(() => {
  fetchModuleAndProject()
  fetchErrors()
})
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}
.header-left {
  display: flex;
  gap: 8px;
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: 2em;
  font-weight: bold;
}
.header-right {
  display: flex;
  justify-content: flex-end;
}
.error-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
}
.error-table th, .error-table td {
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  text-align: left;
}
.error-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}
.error-table tr:hover td {
  background: #f5f7fa;
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
  padding: 32px 28px 24px 28px;
  border-radius: 8px;
  min-width: 340px;
  box-shadow: 0 2px 8px #f0f1f2;
}
.modal-title {
  margin-bottom: 18px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
}
input {
  padding: 8px 10px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 15px;
}
.modal-actions {
  margin-top: 16px;
  text-align: right;
}
.btn {
  padding: 7px 18px;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  color: #333;
  margin-left: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.btn-primary {
  background: #1677ff;
  color: #fff;
}
.btn-cancel:hover {
  background: #e6e6e6;
}
.btn:active {
  opacity: 0.85;
}
.error {
  color: #e74c3c;
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: left;
  font-size: 14px;
}
</style>