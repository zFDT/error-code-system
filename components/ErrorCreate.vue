<template>
  <div>
    <h1>Create New Error</h1>
    <form @submit.prevent="createError">
      <div>
        <label for="errorName">Error Name:</label>
        <input type="text" v-model="errorName" required />
      </div>
      <div>
        <label for="errorDescription">Error Description:</label>
        <textarea v-model="errorDescription" required></textarea>
      </div>
      <button type="submit">Create Error</button>
    </form>
    <p v-if="errorCode">Generated Error Code: {{ errorCode }}</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const errorName = ref('');
    const errorDescription = ref('');
    const errorCode = ref('');

    const createError = () => {
      const newErrorCode = store.dispatch('createError', {
        name: errorName.value,
        description: errorDescription.value,
      });
      errorCode.value = newErrorCode;
      errorName.value = '';
      errorDescription.value = '';
    };

    return {
      errorName,
      errorDescription,
      errorCode,
      createError,
    };
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>