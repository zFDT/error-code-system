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
import { defineComponent, ref, computed } from 'vue';
import store from '@/store';

export default defineComponent({
  setup() {
    const projectName = ref('');
    const projectCode = ref('');
    const codeError = ref('');
    const projects = computed(() => store.state.projects);

    const createProject = () => {
      try {
        store.createProject(projectName.value, projectCode.value);
        codeError.value = '';
        projectName.value = '';
        projectCode.value = '';
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