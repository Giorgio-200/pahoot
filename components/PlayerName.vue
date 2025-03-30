<script setup>
import { ref } from "vue";
import { navigateTo } from "#app"; // Import Nuxt's navigation

const playerName = ref("");

const joinGame = () => {
  if (playerName.value.trim()) {
    localStorage.setItem("playerName", playerName.value);
    navigateTo("/quiz"); // Redirects after entering a name
  }
};
</script>
