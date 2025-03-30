<script setup>
import { ref, onMounted } from "vue";

const ws = ref(null);
const currentQuestion = ref(null);
const selectedAnswer = ref(null);
const hasAnswered = ref(false); // Prevents multiple answers
const waitingForNext = ref(false); // Indicates waiting state

onMounted(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3001"; // Use environment variable
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => console.log("✅ WebSocket connected!");
    ws.value.onerror = (error) => console.error("❌ WebSocket error:", error);
    ws.value.onclose = () => console.warn("⚠️ WebSocket closed. Attempting to reconnect...");
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
