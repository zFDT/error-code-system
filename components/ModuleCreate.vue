<template>
  <div class="module-create">
    <h1>添加新模块</h1>
    <form @submit.prevent="createModule" class="form">
      <div class="form-group">
        <label for="moduleName">模块名称：</label>
        <input id="moduleName" type="text" v-model="moduleName" required placeholder="请输入模块名称" />
      </div>
      <div class="form-group">
        <label for="moduleCode">模块编码：</label>
        <input id="moduleCode" type="text" v-model="moduleCode" required placeholder="如 01" maxlength="2" />
        <span v-if="codeExists" class="error">模块编码已存在！</span>
      </div>
      <button type="submit" class="btn btn-primary">添加模块</button>
    </form>
    <div v-if="modules.length">
      <h2>当前模块</h2>
      <ul>
        <li v-for="module in modules" :key="module.code">{{ module.name }} - {{ module.code }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const moduleName = ref('');
const moduleCode = ref('');
const codeExists = ref(false);
const modules = ref<any[]>([]);

const fetchModules = async () => {
  const res = await axios.get('/api/modules');
  modules.value = res.data;
};

onMounted(fetchModules);

const createModule = async () => {
  if (!modules.value.find((module: any) => module.moduleCode === moduleCode.value)) {
    try {
      await axios.post('/api/modules', {
        name: moduleName.value,
        moduleCode: moduleCode.value,
      });
      await fetchModules();
      moduleName.value = '';
      moduleCode.value = '';
      codeExists.value = false;
    } catch (e: any) {
      codeExists.value = true;
    }
  } else {
    codeExists.value = true;
  }
};
</script>

<style scoped>
.module-create {
  max-width: 500px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
}
.form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 6px;
  font-weight: 500;
}
input {
  padding: 8px 10px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 15px;
}
.btn {
  padding: 7px 18px;
  border: none;
  border-radius: 4px;
  background: #1677ff;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.btn:active {
  opacity: 0.85;
}
.error {
  color: #e74c3c;
  margin-top: 8px;
  font-size: 14px;
}
</style>