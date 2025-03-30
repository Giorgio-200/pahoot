<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
    <h1 class="text-4xl font-bold mb-4">Quiz</h1>

    <div v-if="!gameStarted" class="text-xl">
      Waiting for the game to start...
    </div>

    <div v-else>
      <h2 v-if="question" class="text-2xl mt-4">{{ question.text }}</h2>
      <div class="mt-4">
        <button v-for="(answer, index) in question.answers" :key="index"
          class="px-4 py-2 m-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          @click="submitAnswer(index)">
          {{ answer }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const ws = ref(null);
const messageQueue = ref([]);

function processMessageQueue() {
  while (messageQueue.value.length > 0) {
    const message = messageQueue.value.shift();
    // Process the message
  }
}

onMounted(() => {
  ws.value = new WebSocket('ws://localhost:3001');

  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data);
    messageQueue.value.push(message);
    processMessageQueue();
  };

  // Other event handlers (onopen, onerror, onclose)
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

</script>
