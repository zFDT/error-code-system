<template>
  <div>
    <h1>项目列表</h1>
    <ul>
      <li v-for="project in projects" :key="project.code">
        {{ project.name }} - {{ project.code }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ProjectList',
  setup() {
    const projects = ref<any[]>([]);

    const fetchProjects = async () => {
      const res = await axios.get('/api/projects');
      projects.value = res.data;
    };

    onMounted(fetchProjects);

    return {
      projects,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 2em;
  margin-bottom: 1em;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 0.5em 0;
}
</style>