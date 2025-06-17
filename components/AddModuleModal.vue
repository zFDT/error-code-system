<template>
  <div class="modal">
    <div class="modal-content">
      <h3>添加模块</h3>
      <label>模块名称：</label>
      <input v-model="moduleName" />
      <label>模块编码：</label>
      <input v-model="moduleCode" />
      <div v-if="error" class="error">{{ error }}</div>
      <div class="modal-actions">
        <button @click="handleAdd">确定</button>
        <button @click="emit('close')">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ projectId: string }>()
const emit = defineEmits(['close', 'success'])

const moduleName = ref('')
const moduleCode = ref('')
const error = ref('')

async function handleAdd() {
  error.value = ''
  // 校验项目ID是否存在
  const projectRes = await fetch(`/api/project?id=${props.projectId}`)
  const projectList = await projectRes.json()
  if (!projectList.data || !projectList.data.length) {
    error.value = '项目ID不存在，无法添加模块'
    return
  }
  // 添加模块
  const res = await fetch('/api/module', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: moduleName.value,
      moduleCode: moduleCode.value,
      projectId: props.projectId
    })
  })
  const data = await res.json()
  if (data.code === 0) {
    moduleName.value = ''
    moduleCode.value = ''
    error.value = ''
    emit('success')
  } else {
    error.value = data.message || '添加失败'
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 6px;
  min-width: 320px;
}
.modal-actions {
  margin-top: 16px;
  text-align: right;
}
.error {
  color: red;
  margin-top: 8px;
}
</style>
