<template>
  <div class="modal">
    <div class="modal-content">
      <h3 class="modal-title">添加错误码</h3>
      <form @submit.prevent="handleAdd">
        <div class="form-group">
          <label for="error-name">错误名称：</label>
          <input id="error-name" v-model="name" placeholder="请输入错误名称" />
        </div>
        <div class="form-group">
          <label for="error-desc">错误描述：</label>
          <input id="error-desc" v-model="description" placeholder="请输入错误描述" />
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">确定</button>
          <button type="button" class="btn btn-cancel" @click="emit('close')">取消</button>
        </div>
      </form>
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
  z-index: 1000;
}
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
