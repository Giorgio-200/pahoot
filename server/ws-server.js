
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

let players = new Map();
let questions = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
  { question: "What is the capital of France?", options: ["Berlin", "Paris", "Madrid", "Rome"], correct: 1 },
];
let currentQuestionIndex = -1;
let gamePIN = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit PIN

wss.on("connection", (ws) => {
  // Send game PIN to new connections
  ws.send(JSON.stringify({ type: "game-pin", pin: gamePIN }));

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("📩 Received:", message);

    if (message.type === "join-game") {
      if (message.pin !== gamePIN) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid PIN" }));
        return;
      }
      players.set(ws, { name: message.name, score: 0, answered: false });
      console.log(`🔹 Player joined: ${message.name} (PIN: ${message.pin})`);
      broadcast({ type: "player-joined", name: message.name });
    }

    else if (message.type === "start-quiz") {
      console.log("🚀 Quiz started.");
      currentQuestionIndex = 0;
      sendNextQuestion();
    }

    else if (message.type === "submit-answer") {
      const player = players.get(ws);
      if (!player) return;

      player.answered = true;
      player.lastAnswer = message.answer;

      const correctAnswerIndex = questions[currentQuestionIndex].correct;
      if (message.answer === correctAnswerIndex) {
        player.score += 10;
      }

      const allAnswered = [...players.values()].every(p => p.answered);
      if (allAnswered) {
        broadcast({
          type: "show-correct-answer",
          correctAnswer: correctAnswerIndex,
          answers: [...players.values()].map(p => ({
            name: p.name,
            answer: p.lastAnswer
          }))
        });

        setTimeout(() => {
          sendNextQuestion();
        }, 3000);
      }
    }
  });

  ws.on("close", () => {
    players.delete(ws);
    console.log("❌ Player disconnected.");
  });
});

function sendNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    broadcast({
      type: "next-question",
      question: questions[currentQuestionIndex]
    });
    currentQuestionIndex++;
  } else {
    sendResults();
  }
}

function sendResults() {
  const leaderboard = Array.from(players.values()).sort((a, b) => b.score - a.score);
  broadcast({ type: "quiz-finished", leaderboard });
}

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

