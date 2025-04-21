<script setup lang="ts">
const appName = "SpectrumVision";
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="18" height="18" rx="4" fill="var(--color-primary)" />
          <rect x="22" width="18" height="18" rx="4" fill="var(--color-complementary)" opacity="0.8" />
          <rect y="22" width="18" height="18" rx="4" fill="var(--color-contrast)" opacity="0.8" />
          <rect x="22" y="22" width="18" height="18" rx="4" fill="var(--color-accent)" opacity="0.8" />
        </svg>
        <span class="app-name">{{ appName }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background-color: var(--color-bg-primary);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;
}

.navbar::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    var(--color-primary) 0%, 
    var(--color-complementary) 33%, 
    var(--color-contrast) 66%, 
    var(--color-accent) 100%);
  opacity: 0.8;
}

.navbar-container {
  width: 85%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
  background: linear-gradient(to right, var(--color-primary), var(--color-contrast));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

@media (max-width: 768px) {
  .navbar-container {
    justify-content: center;
  }
}
</style>
