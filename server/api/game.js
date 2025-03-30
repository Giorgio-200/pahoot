export default defineEventHandler((event) => {
    const pin = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit PIN
    return { pin };
});
