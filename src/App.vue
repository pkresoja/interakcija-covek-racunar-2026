<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';

const year = new Date().getFullYear()

// Stanje za chat widget
const isOpen = ref<boolean>(false)
const chatInput = ref<string>('')
const messages = ref<Array<{ sender: 'user' | 'bot', text: string }>>([])

function toggleChat() {
  isOpen.value = !isOpen.value
}

async function handleChat() {
  const text = chatInput.value.trim()
  if (!text) return

  // Dodaj korisničku poruku u lokalnu istoriju
  messages.value.push({ sender: 'user', text })
  chatInput.value = ''

  // Poziv tvog postojećeg servisa
  // Pretpostavka je da ChatService vraća odgovor ili obrađuje poruku
  const response = await ChatService.handleUserInput(text.toLowerCase())

  // Ako tvoj servis vraća odgovor sinhrono ili asinhrono:
  if (response) {
    messages.value.push({ sender: 'bot', text: response })
  }
}
</script>

<template>
  <!-- Glavni sadržaj aplikacije -->
  <div class="container">
    <RouterView :key="$route.fullPath" />
    <footer class="my-3 text-center">
      <span>&copy; {{ year }} - Interakcija čovek računar</span><br>
      <span>Univerzitet Singidunum</span>
    </footer>
  </div>

  <!-- FLOATING CHAT WIDGET U ĆOŠKU -->
  <div class="chat-widget-container">
    <!-- Dugme za otvaranje/zatvaranje (plutajuće) -->
    <button class="chat-toggle-btn" @click="toggleChat">
      💬 {{ isOpen ? 'Zatvori chat' : 'Podrška' }}
    </button>

    <!-- Prozor chata koji se prikazuje samo ako je isOpen === true -->
    <div v-if="isOpen" class="chat-window shadow-lg">
      <div class="chat-header">
        <span>AI Asistent</span>
        <button class="close-btn" @click="toggleChat">&times;</button>
      </div>

      <div class="chat-body">
        <div v-if="messages.length === 0" class="text-muted text-center mt-3">
          Kako vam mogu pomoći danas?
        </div>
        <div v-for="(msg, index) in messages" v-html="msg.text" :key="index" :class="['chat-message', msg.sender]">
        </div>
      </div>

      <div class="chat-footer">
        <input type="text" v-model="chatInput" @keyup.enter="handleChat" placeholder="Unesite poruku...">
        <button type="button" @click="handleChat">Pošalji</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- CHAT WIDGET STILOVI (Usklađeni sa temom filma) --- */
.chat-widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: inherit;
}

.chat-toggle-btn {
  background-color: #e63946; /* Prepoznatljiva crvena boja sa stranice filma */
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  font-weight: 700;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.chat-toggle-btn:hover {
  background-color: #d02e3b;
}

.chat-window {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 350px;
  height: 440px;
  background: #252832; /* Tamna pozadina kartica iz MovieView.vue (#252832) */
  border: 1px solid #30333b; /* Boja ivica kartica (#30333b) */
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  color: #fff;
  overflow: hidden;
}

.chat-header {
  background: #1e2129; /* Tamnija nijansa za zaglavlje */
  padding: 12px 16px;
  border-bottom: 1px solid #30333b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  color: #858b97; /* Siva boja teksta za sporedne elemente */
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.chat-body {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #252832;
}

.chat-message {
  padding: 10px 14px;
  border-radius: 8px;
  max-width: 85%;
  word-break: break-word;
  font-size: 0.9rem;
  line-height: 1.5;
}

.chat-message.user {
  background: #e63946; /* Crvena boja za korisnikove poruke */
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 2px;
}

.chat-message.bot {
  background: #30333b; /* Pozadina za botove poruke usklađena sa ivicama/poster wrapper-om */
  color: #f2f2f5;
  align-self: flex-start;
  border-bottom-left-radius: 2px;
}

.chat-footer {
  padding: 10px 12px;
  border-top: 1px solid #30333b;
  display: flex;
  gap: 8px;
  background: #1e2129;
}

.chat-footer input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #484c59;
  background: #252832; /* Tamno polje za unos */
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
}

.chat-footer input:focus {
  border-color: #e63946; /* Fokus efekt sa crvenom naglašenom bojom */
}

.chat-footer button {
  padding: 8px 16px;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.chat-footer button:hover {
  background-color: #d02e3b;
}

/* Prilagođavanje za manje ekrane (mobiteli) */
@media (max-width: 767.98px) {
    .chat-window {
      width: calc(100vw - 40px);
      right: -10px;
    }
}
</style>