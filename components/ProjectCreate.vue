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
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const projectName = ref('');
    const projectCode = ref('');
    const codeError = ref('');
    
    const projects = store.state.projects;

    const createProject = () => {
      if (store.state.projects.some(project => project.code === projectCode.value)) {
        codeError.value = 'Project code must be unique.';
        return;
      }
      codeError.value = '';
      store.commit('ADD_PROJECT', { name: projectName.value, code: projectCode.value });
      projectName.value = '';
      projectCode.value = '';
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