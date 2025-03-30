<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">Enter Name and Game PIN</h1>

    <input
      v-model="name"
      type="text"
      placeholder="Enter your name"
      class="border p-2 mb-2"
    />

    <input
      v-model="pin"
      type="text"
      placeholder="Enter game PIN"
      class="border p-2 mb-2"
    />

    <button
      @click="joinGame"
      class="bg-red-500 text-white px-4 py-2 rounded"
    >
      Join Game
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');  // Ensure it's reactive
const pin = ref('');   // Ensure it's reactive

const joinGame = () => {
  if (!name.value.trim() || !pin.value.trim()) {
    alert('Please enter a name and PIN.');
    return;
  }

  // Redirect to /quiz with query parameters
  router.push(`/quiz?name=${encodeURIComponent(name.value)}&pin=${encodeURIComponent(pin.value)}`);
};
</script>
