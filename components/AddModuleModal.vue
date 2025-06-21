<template>
  <div class="modal-content">
    <h3 class="modal-title">添加模块</h3>
    <form @submit.prevent="handleAdd">
      <div class="form-group">
        <label for="module-name">模块名称：</label>
        <input id="module-name" v-model="moduleName" placeholder="请输入模块名称" />
      </div>
      <div class="form-group">
        <label for="module-code">模块编码：</label>
        <input id="module-code" v-model="moduleCode" @input="onModuleCodeInput" maxlength="2" placeholder="如 01" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">确定</button>
        <button type="button" class="btn btn-cancel" @click="emit('close')">取消</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ projectId: string }>();
const emit = defineEmits(['close', 'success'])

const moduleName = ref('')
const moduleCode = ref('')
const error = ref('')

function onModuleCodeInput(e: Event) {
  let val = (e.target as HTMLInputElement).value.replace(/[^a-zA-Z0-9]/g, '')
  if (val.length > 2) val = val.slice(0, 2)
  moduleCode.value = val
}

async function handleAdd() {
  error.value = ''
  const projectRes = await fetch(`/api/project?id=${props.projectId}`)
  const projectList = await projectRes.json()
  if (!projectList.data || !projectList.data.length) {
    error.value = '项目ID不存在，无法添加模块'
    return
  }
  let code = moduleCode.value.replace(/[^a-zA-Z0-9]/g, '').padStart(2, '0').slice(0, 2)
  moduleCode.value = code
  const res = await fetch('/api/module', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: moduleName.value,
      moduleCode: code,
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
.modal-content {
  background: #fff;
  padding: 32px 28px 24px 28px;
  border-radius: 8px;
  min-width: 340px;
  box-shadow: 0 2px 8px #f0f1f2;
}
.modal-title {
  margin-bottom: 18px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
}
input {
  padding: 8px 10px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 15px;
}
.modal-actions {
  margin-top: 16px;
  text-align: right;
}
.btn {
  padding: 7px 18px;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  color: #333;
  margin-left: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.btn-primary {
  background: #1677ff;
  color: #fff;
}
.btn-cancel:hover {
  background: #e6e6e6;
}
.btn:active {
  opacity: 0.85;
}
.error {
  color: #e74c3c;
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: left;
  font-size: 14px;
}
</style>
