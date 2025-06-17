<template>
  <div>
    <h1>模块列表</h1>
    <ul>
      <li v-for="module in modules" :key="module.code">
        {{ module.name }} - {{ module.code }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import store from '@/store';

export default defineComponent({
  name: 'ModuleList',
  setup() {
    const modules = computed(() => store.state.modules);

    return {
      modules,
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
  padding: 0.5em 0;
}
</style>