<script setup lang="ts">
import NavBar from '../components/NavBar.vue';

defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="main-layout">
    <NavBar />
    <div class="content-wrapper">
      <div class="content-container">
        <h1 v-if="title" class="page-title">{{ title }}</h1>
        
        <div class="content-area">
          <slot></slot>
        </div>
      </div>
    </div>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="footer-logo-icon">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="11" height="11" rx="3" fill="var(--color-primary)" />
              <rect x="13" width="11" height="11" rx="3" fill="var(--color-complementary)" opacity="0.8" />
              <rect y="13" width="11" height="11" rx="3" fill="var(--color-contrast)" opacity="0.8" />
              <rect x="13" y="13" width="11" height="11" rx="3" fill="var(--color-accent)" opacity="0.8" />
            </svg>
          </div>
          <span class="footer-copyright">© 2025 SpectrumVision</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-primary);
}

.content-wrapper {
  flex: 1;
  background-image: 
    radial-gradient(circle at 10% 20%, var(--color-primary-bg) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, var(--color-complementary-bg) 0%, transparent 20%),
    radial-gradient(circle at 50% 50%, var(--color-contrast-bg) 0%, transparent 30%);
  background-attachment: fixed;
}

.content-container {
  width: 95%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 3.5rem;
  text-align: center;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 20%;
  transform: translateX(-50%);
  width: 150px;
  height: 3px;
  background: linear-gradient(to right, var(--color-primary), var(--color-contrast));
  border-radius: 4px;
}

.content-area {
  min-height: 60vh;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.footer {
  margin-top: auto;
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-divider);
  padding: 1.5rem 0;
}

.footer-content {
  width: 95%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-logo-icon {
  display: flex;
  align-items: center;
}

.footer-copyright {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .content-container {
    width: 85%;
    padding: 2.5rem;
  }

  .page-title {
    font-size: 2.5rem;
  }
}
</style>