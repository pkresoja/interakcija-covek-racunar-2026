<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import { UserService } from './services/user.service';

const year = new Date().getFullYear()
const chatInput = ref<string>('')

function handleChat() {
  const text = chatInput.value.toLowerCase().trim()
  chatInput.value = ''

  if (text.includes('sam ja')) {
    UserService.getActiveUser() ?
    alert(`Ulogovani ste kao ${UserService.getActiveUser()?.email}`) :
    alert('Niste ulogovani!')
    return
  }
  
  alert(text)
}
</script>

<template>
  <input type="text" width="450" v-model="chatInput">
  <button type="button" @click="handleChat">Posalji</button>
  <hr>

  <div class="container">
    <RouterView :key="$route.fullPath" />
    <footer class="my-3 text-center">
      <span>&copy; {{ year }} - Interakcija čovek računar</span><br>
      <span>Univerzitet Singidunum</span>
    </footer>
  </div>
</template>