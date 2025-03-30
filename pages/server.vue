
<script setup>
import { ref, onMounted } from "vue";

const ws = ref(null);
const gamePIN = ref("Loading...");

onMounted(() => {
  ws.value = new WebSocket("ws://localhost:3001");

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "game-pin") {
      gamePIN.value = data.pin;
    }
  };
});
</script>

<template>
  <div class="server-panel">
    <h1>Admin Panel</h1>
    <h2>Game PIN: <span>{{ gamePIN }}</span></h2>
  </div>
</template>

<style scoped>
.server-panel {
  text-align: center;
  font-size: 1.5rem;
}
</style>

