<script setup lang="ts">
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>