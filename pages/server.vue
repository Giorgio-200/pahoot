<script setup>
import { ref, onMounted } from "vue";

const ws = ref(null);
const currentQuestion = ref(null);
const correctAnswer = ref(null);
const playerAnswers = ref([]);

onMounted(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3001"; // Use environment variable
    ws.value = new WebSocket(wsUrl);

    ws.value.onopen = () => console.log("✅ WebSocket connected!");
    ws.value.onerror = (error) => console.error("❌ WebSocket error:", error);
    ws.value.onclose = () => console.warn("⚠️ WebSocket closed. Attempting to reconnect...");
});

</script>

<template>
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
        <h2>Waiting for the quiz to start...</h2>
    </div>
</template>


<style scoped>
.correct {
    color: green;
    font-weight: bold;
}
</style>
