<script setup lang="ts">
import { RouterView } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <div class="container">
    <RouterView />
    <p>Year: {{ year }}</p>
  </div>
</template>