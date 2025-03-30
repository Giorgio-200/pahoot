<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const ws = ref(null);
const reconnectInterval = 5000; // 5 seconds

function connectWebSocket() {
  ws.value = new WebSocket('ws://localhost:3001');

  ws.value.onopen = () => {
    console.log('WebSocket connected');
    // Additional setup if needed
  };

  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data);
    // Handle incoming messages
  };

  ws.value.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.value.onclose = () => {
    console.warn('WebSocket closed. Reconnecting in 5 seconds...');
    setTimeout(connectWebSocket, reconnectInterval);
  };
}

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

function submitAnswer(index) {
    ws.send(JSON.stringify({ type: "submit-answer", answer: index }));
    selectedAnswer.value = index;
}
</script>

<template>
  <div class="p-6 bg-gray-900 text-white">
    <h1 class="text-3xl font-bold mb-4">Quiz</h1>

    <div v-if="currentQuestion">
      <h2 class="text-xl font-semibold">{{ currentQuestion.question }}</h2>

      <ul class="mt-4">
        <li 
          v-for="option in currentQuestion.options" 
          :key="option"
          class="p-2 border rounded-lg my-2 cursor-pointer"
          :class="{
            'bg-blue-500 text-white': selectedAnswer === option,
            'hover:bg-gray-700': !hasAnswered
          }"
          @click="submitAnswer(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>

    <p v-if="waitingForNext" class="text-yellow-400 mt-4">
      Waiting for the next question...
    </p>

    <p v-if="!currentQuestion" class="text-green-400 mt-4">
      The quiz has ended!
    </p>
  </div>
</template>

<style scoped>

</style>
