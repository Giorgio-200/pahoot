<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const ws = ref(null);
const reconnectInterval = 5000; // 5 seconds

const startQuiz = () => {
    if (ws.value) {
        ws.value.send(JSON.stringify({ type: "start-quiz" }));
    }
};


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


</script>

<template>
    <button @click="startQuiz">Start Quiz</button>
    <div v-if="currentQuestion">
        <h2>{{ currentQuestion.question }}</h2>
        <ul>
            <li v-for="(option, index) in currentQuestion.options"
                :key="index"
                :class="{ correct: correctAnswer === index }"> <!-- Compare indexes, not text -->
                {{ option }}
            </li>
        </ul>

        <h3>Players' Answers:</h3>
        <ul>
            <li v-for="answer in playerAnswers" :key="answer.name">
                {{ answer.name }} answered: {{ answer.answer }}
            </li>
        </ul>
    </div>
    <div v-else>
        <h2>Loading...</h2>
    </div>
</template>


<style scoped>
.correct {
    color: green;
    font-weight: bold;
}
</style>
