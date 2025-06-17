<template>
  <div>
    <h1>Create New Project</h1>
    <form @submit.prevent="createProject">
      <div>
        <label for="projectName">Project Name:</label>
        <input type="text" v-model="projectName" required />
      </div>
      <div>
        <label for="projectCode">Project Code (001):</label>
        <input type="text" v-model="projectCode" required />
        <span v-if="codeError" class="error">{{ codeError }}</span>
      </div>
      <button type="submit">Create Project</button>
    </form>
    <h2>Current Projects</h2>
    <ul>
      <li v-for="project in projects" :key="project.code">{{ project.name }} - {{ project.code }}</li>
    </ul>
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

    // 加载项目列表
    async function fetchProjects() {
      // 修复：确保 fetch 的 URL 是字符串 '/api/project'
      const res = await fetch('/api/project');
      const data = await res.json();
      projects.value = data.data || [];
    }
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
    };
  },
});
</script>

<style scoped>
.error {
  color: red;
}
</style>