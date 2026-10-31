<script setup lang="ts">
import { RouterView } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <div class="container">
    <RouterView :key="$route.fullPath"/>
    <footer class="my-3 text-center">
      <span>&copy; {{ year }} - Interakcija čovek računar</span><br>
      <span>Univerzitet Singidunum</span>
    </footer>
  </div>
</template>