<script setup>
import { ref, onMounted } from "vue";

const ws = ref(null);
const currentQuestion = ref(null);
const correctAnswer = ref(null);
const playerAnswers = ref([]);

onMounted(() => {
    ws.value = new WebSocket("ws://localhost:3001");

    ws.value.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("📩 Message received:", message); // Debugging output

        if (message.type === "next-question") {
            currentQuestion.value = message.question || null;
            correctAnswer.value = null;
            playerAnswers.value = [];
            console.log("✅ New question set:", currentQuestion.value);
        }

        else if (message.type === "show-correct-answer") {
            correctAnswer.value = message.correctAnswer;
            playerAnswers.value = message.answers || [];
            console.log("✅ Showing correct answer:", correctAnswer.value);
        }
    };
});
</script>

<template>
    <div v-if="currentQuestion">
        <h2>{{ currentQuestion.question }}</h2>
        <ul>
            <li v-for="option in currentQuestion.options" :key="option"
                :class="{ correct: correctAnswer === option }">
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
