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
import { ref, onMounted } from 'vue';

const ws = new WebSocket('ws://localhost:3001');
const gameStarted = ref(false);
const question = ref(null);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'game-started') {
    gameStarted.value = true;
  }

  if (data.type === 'question') {
    question.value = data.question;
  }
};

const submitAnswer = (index) => {
  ws.send(JSON.stringify({ type: 'answer', answerIndex: index }));
};
</script>
