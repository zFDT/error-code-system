<!--
 * @Date: 2025-06-17 14:22:00
 * @LastEditors: zhanghongxin2 zhanghongxin2@dreame.tech
 * @LastEditTime: 2025-06-17 14:22:17
 * @FilePath: \error-code-system\components\AddProjectModal.vue
-->
<template>
  <div>
    <!-- Existing template code for the modal -->
    <form @submit.prevent="handleAdd">
      <!-- Form fields for adding a project -->
      <button type="submit">Add Project</button>
    </form>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['close', 'success'])

function handleClose() {
  emit('close')
}
async function handleAdd() {
  // Logic for adding a project
  // ...

  // Notify the parent component to refresh the list after a successful addition
  emit('success')
}
</script>

<style scoped>
/* Existing styles for the modal */
</style>