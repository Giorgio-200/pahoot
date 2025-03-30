import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3001 });

let players = new Map();
let questions = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
  { question: "What is the capital of France?", options: ["Berlin", "Paris", "Madrid", "Rome"], correct: 1 },
];
let correctAnswer = null;
let answers = [];

let currentQuestionIndex = -1;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("📩 Received:", message);

    if (message.type === "join-game") {
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
    
        // Store answer and mark player as answered
        player.answered = true;
        player.lastAnswer = message.answer; // Store for reference
    
        // Check if correct
        const correctAnswerIndex = questions[currentQuestionIndex].correct;
        if (message.answer === correctAnswerIndex) {
            player.score += 10;
        }
    
        // Check if all players have answered
        const allAnswered = [...players.values()].every(p => p.answered);
    
        if (allAnswered) {
            // Send correct answer and other responses to server.vue
            const answerData = {
                type: "show-correct-answer",
                correctAnswer: correctAnswerIndex,
                answers: [...players.values()].map(p => ({
                    name: p.name,
                    answer: p.lastAnswer
                }))
            };
            broadcast(answerData);
    
            setTimeout(() => {
                sendNextQuestion();
            }, 3000); // Delay to show correct answer before next question
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
    const question = questions[currentQuestionIndex]; // Don't shift, just reference
    broadcast({
      type: "next-question",
      question: question // Send full object
    });
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
    client.send(JSON.stringify(message));
  });
}
