<template>
  <div>
    <h1>添加新项目</h1>
    <form @submit.prevent="createProject">
      <div>
        <label for="projectName">项目名称:</label>
        <input type="text" v-model="projectName" required />
        <label for="projectCode">项目编码 (001):</label>
        <input type="text" v-model="projectCode" required />
        <span v-if="codeError" class="error">{{ codeError }}</span>
      <button type="submit">创建项目</button>
      </div>
    </form>
  </div>
    <div>
    <h1>项目列表</h1>
    <table class="project-table">
      <thead>
        <tr>
          <th>项目名称</th>
          <th>项目code</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="2">加载中...</td>
        </tr>
        <template v-else-if="projects.length">
          <tr v-for="project in projects" :key="project.id">
            <td>
              <a :href="`/project/${project.id}/modules`">{{ project.name }}</a>
            </td>
            <td>{{ project.projectCode }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="2">暂无项目数据。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const projectName = ref('');
    const projectCode = ref('');
    const codeError = ref('');
    const projects = ref<any[]>([]);
  const loading = ref<boolean>(true);
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

    const createProject = async () => {
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
          fetchProjects();
        }
      } catch (e: any) {
        codeError.value = e.message;
      }
    };

    return {
      projectName,
      projectCode,
      codeError,
      projects,
      createProject,
 loading,
    };
  },
});
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
</style>