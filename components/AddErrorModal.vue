<template>
  <div class="modal">
    <div class="modal-content">
      <h3>添加错误码</h3>
      <label>错误名称：</label>
      <input v-model="name" />
      <label>错误描述：</label>
      <input v-model="description" />
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
const props = defineProps<{ moduleId: string }>()
const emit = defineEmits(['close', 'success'])

const name = ref('')
const description = ref('')
const error = ref('')

async function handleAdd() {
  error.value = ''
  if (!name.value || !description.value) {
    error.value = '错误名称和描述不能为空'
    return
  }
  const res = await fetch('/api/error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.value,
      description: description.value,
      moduleId: props.moduleId
    })
  })
  const json = await res.json()
  if (json.code === 0) {
    emit('success')
  } else {
    error.value = json.message || '添加失败'
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
