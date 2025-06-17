<template>
  <div>
    <h1>错误码列表</h1>
    <button @click="showAdd = true">添加错误码</button>
    <AddErrorModal
      v-if="showAdd"
      :module-id="moduleId"
      @close="showAdd = false"
      @success="handleAddSuccess"
    />
    <table class="error-table">
      <thead>
        <tr>
          <th>错误码</th>
          <th>错误名称</th>
          <th>错误描述</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="3">加载中...</td>
        </tr>
        <template v-else-if="errors.length">
          <tr v-for="error in errors" :key="error.id">
            <td>{{ error.errorCode }}</td>
            <td>{{ error.name }}</td>
            <td>{{ error.description }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="3">暂无错误码数据。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AddErrorModal from '~/components/AddErrorModal.vue'

const route = useRoute()
const moduleId = route.query.moduleId as string
const errors = ref<any[]>([])
const loading = ref(false)
const showAdd = ref(false)

async function fetchErrors() {
  loading.value = true
  const res = await fetch(`/api/error?moduleId=${moduleId}`)
  const json = await res.json()
  errors.value = json.data
  loading.value = false
}

function handleAddSuccess() {
  showAdd.value = false
  fetchErrors()
}

onMounted(() => {
  fetchErrors()
})
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.error-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
}
.error-table th, .error-table td {
  border: 1px solid #e8e8e8;
  padding: 12px 16px;
  text-align: left;
}
.error-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}
.error-table tr:hover td {
  background: #f5f7fa;
}
</style>