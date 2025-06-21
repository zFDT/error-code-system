<template>
  <div class="error-create">
    <h1>添加新错误码</h1>
    <form @submit.prevent="createError" class="form">
      <div class="form-group">
        <label for="errorName">错误名称：</label>
        <input id="errorName" type="text" v-model="errorName" required placeholder="请输入错误名称" />
      </div>
      <div class="form-group">
        <label for="errorDescription">错误描述：</label>
        <textarea id="errorDescription" v-model="errorDescription" required placeholder="请输入错误描述"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">添加错误码</button>
    </form>
    <p v-if="errorCode" class="result">生成的错误码：{{ errorCode }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const errorName = ref('');
const errorDescription = ref('');
const errorCode = ref('');

const createError = async () => {
  await axios.post('/api/errors', {
    name: errorName.value,
    description: errorDescription.value,
  });
  const res = await axios.get('/api/errors');
  const lastError = res.data[res.data.length - 1];
  errorCode.value = lastError?.errorCode || '';
  errorName.value = '';
  errorDescription.value = '';
};
</script>

<style scoped>
.error-create {
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
input, textarea {
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
.result {
  margin-top: 18px;
  color: #1677ff;
  font-weight: 600;
}
</style>