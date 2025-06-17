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
import { defineComponent, computed } from 'vue';
import store from '@/store';

export default defineComponent({
  name: 'ProjectList',
  setup() {
    const projects = computed(() => store.state.projects);

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