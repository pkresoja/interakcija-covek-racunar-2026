<!-- <script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const movie = ref<MovieModel>()
MovieService.getDetails(route.params.perma as string)
    .then(rsp => movie.value = rsp.data)
</script>

<template>
    <Navigation />
    <pre>{{ movie }}</pre>
</template> -->

<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { OrderService } from '@/services/order.service';

import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const movie = ref<MovieModel | null>(null);
const loading = ref(true);
const error = ref('');

// Mocked screening times
const projectionTimes = ['15:30', '18:00', '20:30', '23:00'];
const selectedTime = ref<string>(projectionTimes[0]!);

// Seat picker configuration (Rows A-E, Seats 1-8)
const rows = ['A', 'B', 'C', 'D', 'E'];
const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
const selectedSeats = ref<string[]>([]);

const successMessage = ref(false);

const toggleSeat = (seatCode: string) => {
    const index = selectedSeats.value.indexOf(seatCode);
    if (index > -1) {
        selectedSeats.value.splice(index, 1);
    } else {
        selectedSeats.value.push(seatCode);
    }
};

const handleOrder = () => {
    if (!movie.value || selectedSeats.value.length === 0) return;

    // Call the mock service for each selected seat
    selectedSeats.value.forEach(seat => {
        OrderService.createOrder(movie.value!.movieId, selectedTime.value, seat);
    });

    successMessage.value = true;
    setTimeout(() => {
        router.push('/cart');
    }, 1500);
};

const formatDate = (date: string) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(`${date}T12:00:00`));
};

watch(
    () => route.params.perma,
    async (perma) => {
        if (!perma) {
            error.value = 'Film nije pronađen.';
            loading.value = false;
            movie.value = null;
            return;
        }

        loading.value = true;
        error.value = '';
        movie.value = null;

        try {
            const response = await MovieService.getDetails(encodeURIComponent(String(perma)));
            movie.value = response.data;
        } catch {
            error.value = 'Došlo je do greške prilikom učitavanja filma.';
        } finally {
            loading.value = false;
        }
    },
    { immediate: true }
);
</script>

<template>
    <Navigation />

    <main class="movie-page">
        <div v-if="loading" class="container py-5 text-center">
            <div class="spinner-border text-danger" role="status" aria-label="Učitavanje"></div>
            <p class="text-secondary mt-3">Učitavanje podataka za rezervaciju...</p>
        </div>

        <div v-else-if="error" class="container py-5">
            <div class="alert alert-danger">{{ error }}</div>
        </div>

        <template v-else-if="movie">
            <div class="container">
                <!-- Breadcrumb -->
                <nav aria-label="Breadcrumb" class="movie-breadcrumb mb-4">
                    <RouterLink :to="`/movie/${route.params.perma}`" class="text-decoration-none text-secondary">
                        <i class="bi bi-arrow-left me-1"></i> Nazad na detalje filma
                    </RouterLink>
                    <span class="mx-2 text-secondary">/</span>
                    <span class="text-white-50">Rezervacija karata</span>
                </nav>

                <div class="row g-5">
                    <!-- Left Column: Showtime & Seat Picker -->
                    <div class="col-12 col-lg-8">
                        <div class="details-card mb-4">
                            <h3 class="mb-3">1. Izaberite vreme projekcije</h3>
                            <div class="d-flex flex-wrap gap-2">
                                <button 
                                    v-for="time in projectionTimes" 
                                    :key="time"
                                    type="button"
                                    class="btn"
                                    :class="selectedTime === time ? 'btn-danger' : 'btn-outline-secondary text-white'"
                                    @click="selectedTime = time"
                                >
                                    <i class="bi bi-clock me-1"></i> {{ time }}
                                </button>
                            </div>
                        </div>

                        <div class="details-card">
                            <h3 class="mb-3">2. Izaberite sedišta</h3>
                            <p class="text-secondary small mb-4">Kliknite na jedno ili više slobodnih sedišta da biste ih izabrali.</p>

                            <!-- Cinema Screen Indicator -->
                            <div class="screen-indicator mb-5 text-center">
                                <div class="screen-bar mx-auto mb-2"></div>
                                <span class="text-muted small tracking-wide">PLATNO</span>
                            </div>

                            <!-- Seat Grid -->
                            <div class="d-flex flex-column align-items-center gap-2 mb-4">
                                <div v-for="row in rows" :key="row" class="d-flex align-items-center gap-2">
                                    <span class="text-secondary fw-bold row-label">{{ row }}</span>
                                    <div class="d-flex gap-2">
                                        <button 
                                            v-for="seatNum in seatNumbers" 
                                            :key="seatNum"
                                            type="button"
                                            class="btn btn-sm seat-btn"
                                            :class="selectedSeats.includes(`${row}${seatNum}`) ? 'btn-danger' : 'btn-outline-light'"
                                            @click="toggleSeat(`${row}${seatNum}`)"
                                        >
                                            {{ seatNum }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Legend -->
                            <div class="d-flex justify-content-center gap-4 text-secondary small pt-3 border-top border-secondary">
                                <div class="d-flex align-items-center gap-2">
                                    <div class="legend-box border border-light rounded"></div> Slobodno
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="legend-box bg-danger rounded"></div> Izabrano
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Order Summary Sidebar -->
                    <div class="col-12 col-lg-4">
                        <div class="details-card sticky-top" style="top: 2rem;">
                            <h3>Pregled rezervacije</h3>
                            
                            <div class="detail-row">
                                <span>Film</span>
                                <strong>{{ movie.title }}</strong>
                            </div>

                            <div class="detail-row">
                                <span>Datum prikazivanja</span>
                                <strong>{{ formatDate(movie.startDate) }}</strong>
                            </div>

                            <div class="detail-row">
                                <span>Vreme projekcije</span>
                                <strong>{{ selectedTime }}</strong>
                            </div>

                            <div class="detail-row">
                                <span>Izabrana sedišta</span>
                                <strong>
                                    {{ selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Nije izabrano sedište' }}
                                </strong>
                            </div>

                            <div v-if="successMessage" class="alert alert-success mt-3 mb-0 py-2 small">
                                Uspešno kreirane rezervacije! Preusmeravanje...
                            </div>

                            <button 
                                type="button" 
                                class="btn btn-success w-100 mt-4 py-2 fw-bold"
                                :disabled="selectedSeats.length === 0 || successMessage"
                                @click="handleOrder"
                            >
                                <i class="bi bi-check-circle me-1"></i> Potvrdi rezervaciju
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </main>
</template>

<style scoped>
.movie-page {
    min-height: 100vh;
    color: #fff;
}

.details-card {
    padding: 26px;
    border: 1px solid #2d3139;
    border-radius: 14px;
    background: #252832;
    box-shadow: 0 8px 25px rgba(20, 25, 35, 0.035);
}

.details-card h3 {
    margin-bottom: 24px;
    font-size: 1.2rem;
    font-weight: 750;
    color: #fff;
}

.detail-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px 0;
    border-bottom: 1px solid #2d3139;
}

.detail-row:first-of-type {
    padding-top: 0;
}

.detail-row span {
    color: #858b97;
    font-size: 0.82rem;
}

.detail-row strong {
    overflow-wrap: anywhere;
    font-size: 0.94rem;
    font-weight: 600;
    line-height: 1.6;
    color: #fff;
}

.screen-bar {
    width: 70%;
    height: 6px;
    background: #ff6976;
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(255, 105, 118, 0.5);
}

.row-label {
    width: 20px;
    text-align: center;
    font-size: 0.9rem;
}

.seat-btn {
    width: 36px;
    height: 36px;
    padding: 0;
    font-size: 0.8rem;
    font-weight: 600;
}

.legend-box {
    width: 16px;
    height: 16px;
}
</style>