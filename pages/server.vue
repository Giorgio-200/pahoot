
<template>
  <div>
    <button @click="startQuiz">Start Quiz</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws: null,
    };
  },
  mounted() {
    this.ws = new WebSocket("ws://localhost:3001");

    this.ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📩 Message received:", message);
    };
  },
  methods: {
    startQuiz() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "start-quiz" }));
        console.log("🚀 Sent: start-quiz");
      }
    },
  },
};
</script>

<style scoped>
.server-panel {
  text-align: center;
  font-size: 1.5rem;
}
</style>

