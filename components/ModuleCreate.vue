<template>
  <div>
    <h1>Create Module</h1>
    <form @submit.prevent="createModule">
      <div>
        <label for="moduleName">Module Name:</label>
        <input type="text" v-model="moduleName" required />
      </div>
      <div>
        <label for="moduleCode">Module Code:</label>
        <input type="text" v-model="moduleCode" required />
        <span v-if="codeExists" style="color: red;">Code already exists!</span>
      </div>
      <button type="submit">Create Module</button>
    </form>
    <div v-if="modules.length">
      <h2>Current Modules</h2>
      <ul>
        <li v-for="module in modules" :key="module.code">{{ module.name }} - {{ module.code }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const moduleName = ref('');
const moduleCode = ref('');
const codeExists = ref(false);
const modules = []; // Replace with your module fetching logic

const createModule = () => {
  if (!modules.find((module: any) => module.code === moduleCode.value)) {
    // Replace with your module adding logic
    moduleName.value = '';
    moduleCode.value = '';
    codeExists.value = false;
  } else {
    codeExists.value = true;
  }
};
</script>

<style scoped>
form {
  margin-bottom: 20px;
}
</style>