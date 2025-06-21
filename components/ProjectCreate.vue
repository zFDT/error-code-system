<template>
  <div>
    <button @click="goBack">返回</button>
  </div>
  <div>
    <h1>项目列表</h1>
    <button @click="openCreateDialog">添加新项目</button>
    <table class="project-table">
      <thead>
        <tr>
          <th>项目名称</th>
          <th>项目code</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="3">加载中...</td>
        </tr>
        <template v-else-if="projects.length">
          <tr v-for="project in projects" :key="project.id">
            <td>
              <a href="javascript:;" @click.prevent="goToModules(project)">{{ project.name }}</a>
            </td>
            <td>{{ project.projectCode }}</td>
            <td>
              <button @click="openEditDialog(project)">修改</button>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="3">暂无项目数据。</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 修改项目名称弹窗 -->
  <div v-if="editDialogVisible" class="modal-overlay">
    <div class="modal">
      <h2>修改项目名称</h2>
      <input type="text" v-model="editProjectName" />
      <div class="modal-actions">
        <button @click="submitEdit">保存</button>
        <button @click="closeEditDialog">取消</button>
      </div>
      <div v-if="editError" class="error">{{ editError }}</div>
    </div>
  </div>

  <!-- 新增项目弹窗 -->
  <div v-if="createDialogVisible" class="modal-overlay">
    <div class="modal">
      <h2>添加新项目</h2>
      <div>
        <label>项目名称:</label>
        <input type="text" v-model="projectName" required />
      </div>
      <div>
        <label>项目编码 (001):</label>
        <input type="text" v-model="projectCode" required maxlength="3" @input="onProjectCodeInput" />
      </div>
      <span v-if="codeError" class="error">{{ codeError }}</span>
      <div class="modal-actions">
        <button @click="createProject">创建</button>
        <button @click="closeCreateDialog">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const projectName = ref('');
const projectCode = ref('');
const codeError = ref('');
const projects = ref<any[]>([]);
const loading = ref<boolean>(true);
const router = useRouter()

// 项目编码输入处理，只允许3位数字，不补零
function onProjectCodeInput(e: Event) {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  if (val.length > 3) val = val.slice(0, 3);
  projectCode.value = val;
}

// 加载项目列表
const fetchProjects = async () => {
  loading.value = true;
  const res = await fetch('/api/project');
  const data = await res.json();
  projects.value = data.data || [];
  loading.value = false;
};

onMounted(() => {
  fetchProjects();
});

const createDialogVisible = ref(false);
function openCreateDialog() {
  createDialogVisible.value = true;
  codeError.value = '';
  projectName.value = '';
  projectCode.value = '';
}
function closeCreateDialog() {
  createDialogVisible.value = false;
  codeError.value = '';
}

const createProject = async () => {
  if (!projectName.value.trim()) {
    codeError.value = '项目名称不能为空';
    return;
  }
  if (!projectCode.value.trim()) {
    codeError.value = '项目编码不能为空';
    return;
  }
  // 补零校验，防止直接提交时未补零
  if (projectCode.value.length > 0) {
    projectCode.value = projectCode.value.replace(/\D/g, '').padStart(3, '0').slice(0, 3);
  }
  try {
    const res = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName.value, projectCode: projectCode.value })
    });
    const data = await res.json();
    if (data.code !== 0) {
      codeError.value = data.message;
    } else {
      codeError.value = '';
      projectName.value = '';
      projectCode.value = '';
      closeCreateDialog();
      fetchProjects();
    }
  } catch (e: any) {
    codeError.value = e.message;
  }
};

function goToModules(project) {
  router.push({ path: '/modules', query: { project: project.id } })
}

const editDialogVisible = ref(false);
const editProject = ref<any>(null);
const editProjectName = ref('');
const editError = ref('');

function openEditDialog(project) {
  editProject.value = project;
  editProjectName.value = project.name;
  editError.value = '';
  editDialogVisible.value = true;
}
function closeEditDialog() {
  editDialogVisible.value = false;
  editProject.value = null;
  editProjectName.value = '';
  editError.value = '';
}
const submitEdit = async () => {
  if (!editProject.value || !editProjectName.value.trim()) {
    editError.value = '项目名称不能为空';
    return;
  }
  try {
    const res = await fetch(`/api/project/${editProject.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editProjectName.value.trim() })
    });
    const data = await res.json();
    if (data.code !== 0) {
      editError.value = data.message || '修改失败';
    } else {
      closeEditDialog();
      fetchProjects();
    }
  } catch (e: any) {
    editError.value = e.message;
  }
};

function goBack() {
  router.back();
}
</script>

<style scoped>
.error {
  color: red;
}
h1 {
  font-size: 2em;
  margin-bottom: 1em;
}
.project-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
}
.project-table th, .project-table td {
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  text-align: left;
}
.project-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}
.project-table tr:hover td {
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
</style>