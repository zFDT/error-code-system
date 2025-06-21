<template>
  <div class="error-code-search">
    <h1>错误码查询</h1>
    <div class="input-group">
      <input
        v-model="projectCode"
        placeholder="项目代码 (如 006)"
        maxlength="3"
        @input="onInput"
        style="width: 120px; margin-right: 8px;"
      />
      <input
        v-model="moduleCode"
        placeholder="模块代码 (如 01)"
        maxlength="2"
        @input="onInput"
        style="width: 100px; margin-right: 8px;"
      />
      <input
        v-model="errorCode"
        placeholder="错误代码 (如 001)"
        maxlength="3"
        @input="onInput"
        style="width: 120px;"
      />
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 140px;">错误码</th>
          <th style="width: 160px;">项目名称</th>
          <th style="width: 120px;">模块名称</th>
          <th style="width: 120px;">错误名称</th>
          <th>错误描述</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="5">查询中...</td>
        </tr>
        <template v-else-if="results.length">
          <tr v-for="item in results" :key="item.errorCode">
            <td
              class="error-link"
              @click="goDetail(item)"
              style="cursor:pointer;color:#1677ff;text-decoration:underline;"
            >
              {{ item.errorCode }}
            </td>
            <td>{{ item.projectName }}</td>
            <td>{{ item.moduleName }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.description }}</td>
          </tr>
        </template>
        <tr v-else-if="(projectCode || moduleCode || errorCode) && !loading">
          <td colspan="5">未找到匹配的错误码。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const projectCode = ref('')
const moduleCode = ref('')
const errorCode = ref('')
const results = ref<any[]>([])
const loading = ref(false)
let timer: any = null
const router = useRouter()

function buildQueryObj() {
  return {
    projectCode: projectCode.value.trim(),
    moduleCode: moduleCode.value.trim(),
    errorCode: errorCode.value.trim(),
  }
}

async function fetchErrorCodes() {
  loading.value = true
  try {
    const { data } = await useFetch('/api/error-code', {
      query: buildQueryObj()
    })
    results.value = data.value?.data || []
  } catch (e) {
    results.value = []
  }
  loading.value = false
}

function onInput() {
  clearTimeout(timer)
  const { projectCode: p, moduleCode: m, errorCode: e } = buildQueryObj()
  if (!p && !m && !e) {
    results.value = []
    return
  }
  timer = setTimeout(() => {
    fetchErrorCodes()
  }, 400)
}

function goDetail(item: any) {
  if (item.name || item.moduleName) {
    // 有错误或只有模块，跳转到错误详情页，带 moduleId 和 projectId
    router.push({
      path: '/errors',
      query: { moduleId: item.moduleId, projectId: item.projectId }
    })
  } else {
    // 只有项目，跳转到模块页面，带 project
    router.push({
      path: '/modules',
      query: { project: item.projectId }
    })
  }
}
</script>

<style scoped>
.error-code-search {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafbfc;
}
.input-group {
  display: flex;
  margin-bottom: 16px;
}
input {
  padding: 8px;
  margin-right: 8px;
  font-size: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  font-size: 15px;
}
th, td {
  border: 1px solid #eee;
  padding: 8px 12px;
  text-align: left;
  word-break: break-all;
}
th {
  background: #f5f7fa;
  font-weight: 600;
}
</style>
