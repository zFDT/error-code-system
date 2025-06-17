<template>
  <div class="error-code-search">
    <h1>错误码查询</h1>
    <input
      v-model="query"
      placeholder="请输入错误码（如 XXX-XX-XXX、XXX-XX 或 XXX）"
      @input="onInput"
    />
    <table>
      <thead>
        <tr>
          <th>错误码</th>
          <th>项目名称</th>
          <th>模块名称</th>
          <th>错误名称</th>
          <th>错误描述</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5">查询中...</td>
        </tr>
        <tr v-else-if="results.length">
          <template v-for="item in results" :key="item.code">
            <tr>
              <td>{{ item.code }}</td>
              <td>{{ item.projectName }}</td>
              <td>{{ item.moduleName }}</td>
              <td>{{ item.errorName }}</td>
              <td>{{ item.errorDescription }}</td>
            </tr>
          </template>
        </tr>
        <tr v-else-if="query && !loading">
          <td colspan="5">未找到匹配的错误码。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
const results = ref<any[]>([])
const loading = ref(false)
let timer: any = null

async function fetchErrorCodes(q: string) {
  loading.value = true
  try {
    const { data } = await useFetch('/api/error-code', {
      query: { query: q }
    })
    // 适配后端返回结构
    results.value = data.value?.data || []
  } catch (e) {
    results.value = []
  }
  loading.value = false
}

function onInput() {
  clearTimeout(timer)
  if (!query.value.trim()) {
    results.value = []
    return
  }
  timer = setTimeout(() => {
    fetchErrorCodes(query.value.trim())
  }, 400)
}
</script>

<style scoped>
.error-code-search {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  font-size: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}
th, td {
  border: 1px solid #eee;
  padding: 8px;
  text-align: left;
}
</style>
