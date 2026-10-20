<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
    if (!email.value || !password.value) {
        error.value = 'Molimo popunite sva polja.';
        return;
    }

    loading.value = true;
    error.value = '';

    try {
        // Replace with your actual login endpoint
        const response = await axios.post('https://movie.pequla.com/api/auth/login', {
            email: email.value,
            password: password.value,
        });

        // Handle successful login (e.g., save token, redirect)
        // localStorage.setItem('token', response.data.token);
        router.push('/');
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Pogrešni pristupni podaci ili greška na serveru.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <Navigation />

    <main class="login-page">
        <div class="container-fluid p-0">
            <div class="row g-0 min-vh-100">

                <!-- Left Side: Cinema Booking Branding -->
                <div class="col-12 col-lg-6 login-brand-col d-none d-lg-flex flex-column justify-content-between p-5">
                    <div class="brand-top">
                        <span class="badge-accent">
                            <i class="bi bi-camera-reels me-2"></i>MY CINEMA
                        </span>
                    </div>

                    <div class="brand-content my-auto py-5">
                        <h1 class="display-5 fw-bold text-white mb-3">
                            Doživite magiju velikog platna.
                        </h1>
                        <p class="lead text-white-50 mb-4">
                            Prijavite se da rezervišete karte, pratite omiljene filmove i ostvarite ekskluzivne
                            pogodnosti.
                        </p>

                        <div class="row g-3 pt-3">
                            <div class="col-auto">
                                <div class="feature-badge">
                                    <i class="bi bi-ticket-perforated text-danger me-2"></i> Brza rezervacija
                                </div>
                            </div>
                            <div class="col-auto">
                                <div class="feature-badge">
                                    <i class="bi bi-star text-danger me-2"></i> VIP sedišta
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Login Form -->
                <div
                    class="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-form-wrapper">
                    <div class="login-card w-100" style="max-width: 440px;">

                        <div class="text-center text-lg-start mb-4">
                            <span class="movie-label d-lg-none">
                                <i class="bi bi-film me-2"></i> PEQULA CINEMA
                            </span>
                            <h2 class="fw-bold text-white mb-2">Dobro došli nazad</h2>
                            <p class="text-secondary small">Unesite svoje podatke za pristup nalogu.</p>
                        </div>

                        <div v-if="error" class="alert alert-danger py-2 small mb-4" role="alert">
                            {{ error }}
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="mb-3">
                                <label for="email" class="form-label text-secondary small fw-bold">E-mail adresa</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                    <input id="email" type="email" v-model="email" class="form-control"
                                        placeholder="vas@email.com" required />
                                </div>
                            </div>
                            <div class="mb-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <label for="password"
                                        class="form-label text-secondary small fw-bold">Lozinka</label>
                                    <router-link to="/forgot-password"
                                        class="text-danger small text-decoration-none">Zaboravili ste
                                        lozinku?</router-link>
                                </div>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                                    <input id="password" type="password" v-model="password" class="form-control"
                                        placeholder="Unesite lozinku" required />
                                </div>
                            </div>

                            <button type="submit" class="btn btn-danger w-100 py-2 fw-bold mb-3" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                                    aria-hidden="true"></span>
                                Prijavi se
                            </button>

                            <p class="text-center text-secondary small mb-0">
                                Nemate nalog?
                                <router-link to="/register"
                                    class="text-white text-decoration-none fw-bold ms-1">Registrujte se</router-link>
                            </p>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    </main>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    background-color: #1a1d24;
    color: #fff;
}

/* Left Brand Panel Styles */
.login-brand-col {
    position: relative;
    background:
        radial-gradient(ellipse at 15% 80%, rgba(190, 35, 50, 0.25), transparent 50%),
        #14171f;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.badge-accent {
    display: inline-block;
    color: #ff6976;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
}

.feature-badge {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    font-size: 0.85rem;
    color: #e0e1e6;
}

/* Right Form Wrapper Styles */
.bg-form-wrapper {
    background-color: #1a1d24;
}

.login-card {
    padding: 32px;
    border: 1px solid #2d323e;
    border-radius: 16px;
    background: #222630;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

/* Custom Bootstrap overrides for dark theme inputs */
.form-control,
.input-group-text {
    background-color: #1a1d24;
    border-color: #303542;
    color: #fff;
}

.form-control:focus {
    background-color: #1a1d24;
    border-color: #e63946;
    color: #fff;
    box-shadow: 0 0 0 0.25rem rgba(230, 57, 70, 0.25);
}

.input-group-text {
    color: #858b97;
}

.form-control::placeholder {
    color: #6c757d;
}

.btn-danger {
    background-color: #e63946;
    border-color: #e63946;
}

.btn-danger:hover {
    background-color: #d92f40;
    border-color: #d92f40;
}
</style>