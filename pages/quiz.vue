<script setup>
import { ref, onMounted } from "vue";

const ws = ref(null);
const playerName = ref("");
const gamePIN = ref("");
const question = ref(null);
const errorMessage = ref("");
const hasJoined = ref(false); // Track if the player has joined

onMounted(() => {
  ws.value = new WebSocket("ws://localhost:3001");

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "next-question") {
      question.value = data.question;
    } else if (data.type === "error") {
      errorMessage.value = data.message;
    } else if (data.type === "player-joined") {
      hasJoined.value = true; // Hide login form after joining
    }
  };
});

const joinGame = () => {
  if (!playerName.value || !gamePIN.value) {
    errorMessage.value = "Please enter a name and PIN.";
    return;
  }
  ws.value.send(JSON.stringify({ type: "join-game", name: playerName.value, pin: gamePIN.value }));
};
</script>

<template>
  <div class="quiz-container">
    <h1 v-if="!hasJoined">Join Game</h1>

    <div v-if="!hasJoined">
      <input v-model="playerName" placeholder="Enter Name" />
      <input v-model="gamePIN" placeholder="Enter Game PIN" />
      <button @click="joinGame">Join</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <h2 v-if="question">{{ question.question }}</h2>
      <ul v-if="question">
        <li v-for="(option, index) in question.options" :key="index">
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  text-align: center;
}
input {
  display: block;
  margin: 10px auto;
  padding: 5px;
}
button {
  padding: 10px;
  cursor: pointer;
}
.error {
  color: red;
}
</style>
