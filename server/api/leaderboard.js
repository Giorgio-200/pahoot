const leaderboard = [];

export default defineEventHandler(async (event) => {
    if (event.method === "POST") {
        const body = await readBody(event);
        leaderboard.push({ name: body.name, score: body.score });
        leaderboard.sort((a, b) => b.score - a.score); // Sort highest first
        return { success: true, leaderboard };
    } else {
        return { leaderboard };
    }
});
