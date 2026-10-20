<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const movie = ref<MovieModel | null>(null);
const loading = ref(true);
const error = ref('');

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
            const response = await MovieService.getDetails(encodeURIComponent(String(perma)))
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
            <p class="text-secondary mt-3">Učitavanje detalja filma...</p>
        </div>

        <div v-else-if="error" class="container py-5">
            <div class="alert alert-danger">{{ error }}</div>
        </div>

        <template v-else-if="movie">
            <!-- Movie hero -->
            <section class="movie-hero">
                <div class="container position-relative">
                    <nav aria-label="Breadcrumb" class="movie-breadcrumb">
                        <span>Filmovi</span>
                        <span class="mx-2">/</span>
                        <span class="text-white-50">Detalji filma</span>
                    </nav>

                    <div class="row align-items-center g-4 g-lg-5 py-4 py-lg-5">
                        <!-- Poster -->
                        <div class="col-12 col-md-5 col-lg-4">
                            <div class="poster-wrapper">
                                <img :src="movie.poster" :alt="`Poster filma ${movie.title}`" class="movie-poster" />
                            </div>
                        </div>

                        <!-- Main information -->
                        <div class="col-12 col-md-7 col-lg-8">
                            <div class="movie-info">
                                <span class="movie-label">
                                    <i class="bi bi-film me-2"></i>
                                    DETALJI FILMA
                                </span>

                                <h1 class="movie-title">
                                    {{ movie.title }}
                                </h1>

                                <p class="movie-original-title">
                                    {{ movie.originalTitle }}
                                </p>

                                <div class="movie-meta">
                                    <span>
                                        <i class="bi bi-calendar3 me-2"></i>
                                        {{ formatDate(movie.startDate) }}
                                    </span>

                                    <span>
                                        <i class="bi bi-clock me-2"></i>
                                        {{ movie.runTime }} min
                                    </span>
                                </div>

                                <div class="movie-genres">
                                    <span v-for="item in movie.movieGenres" :key="item.movieGenreId"
                                        class="genre-badge">
                                        {{ item.genre.name }}
                                    </span>
                                </div>

                                <p class="movie-short-description">
                                    {{ movie.shortDescription }}
                                </p>

                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="movie-director">
                                        <span class="director-label">REŽIJA</span>
                                        <span class="director-name">
                                            {{ movie.director.name.trim() }}
                                        </span>
                                    </div>
                                    <RouterLink class="btn btn-success" :to="`/movie/${route.params.perma}/order`">
                                       <i class="bi bi-box-arrow-up-right"></i> Naruči odmah
                                    </RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Movie content -->
            <section class="container movie-content py-5">
                <div class="row g-5">
                    <!-- Synopsis -->
                    <div class="col-12 col-lg-8">
                        <section class="content-section">
                            <div class="section-heading">
                                <span class="section-accent"></span>
                                <h2>O filmu</h2>
                            </div>

                            <p class="movie-description">
                                {{ movie.description }}
                            </p>
                        </section>

                        <!-- Cast -->
                        <section class="content-section mt-5">
                            <div class="section-heading">
                                <span class="section-accent"></span>
                                <h2>Glumačka postava</h2>
                            </div>

                            <div class="row row-cols-2 row-cols-md-3 g-3">
                                <div v-for="item in movie.movieActors" :key="item.movieActorId" class="col">
                                    <div class="actor-card">
                                        <div class="actor-avatar">
                                            <i class="bi bi-person-fill"></i>
                                        </div>

                                        <div class="actor-name">
                                            {{ item.actor.name }}
                                        </div>

                                        <div class="actor-role">
                                            Glumac
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Sidebar -->
                    <aside class="col-12 col-lg-4">
                        <div class="details-card">
                            <h3>Informacije o filmu</h3>

                            <div class="detail-row">
                                <span>Originalni naslov</span>
                                <strong>{{ movie.originalTitle }}</strong>
                            </div>

                            <div class="detail-row">
                                <span>Datum početka prikazivanja</span>
                                <strong>{{ formatDate(movie.startDate) }}</strong>
                            </div>

                            <div class="detail-row">
                                <span>Trajanje</span>
                                <strong>{{ movie.runTime }} minuta</strong>
                            </div>

                            <div class="detail-row">
                                <span>Režiser</span>
                                <strong>{{ movie.director.name.trim() }}</strong>
                            </div>

                            <div class="detail-row">
                                <span>Žanrovi</span>
                                <strong>
                                    {{
                                        movie.movieGenres
                                            .map(item => item.genre.name)
                                            .join(', ')
                                    }}
                                </strong>
                            </div>
                        </div>

                        <div class="cinema-note mt-4">
                            <i class="bi bi-camera-reels"></i>
                            <div>
                                <h4>Filmski doživljaj</h4>
                                <p>
                                    Upoznajte priču, režiju i glumačku postavu ovog filma.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </template>

        <div v-else class="container py-5">
            <div class="alert alert-info">
                Nema dostupnih podataka o filmu.
            </div>
        </div>
    </main>
</template>

<style scoped>
.movie-page {
    min-height: 100vh;
    /* background: #f7f8fa; */
    /* color: #20242c; */
}

/* Hero */

.movie-hero {
    position: relative;
    overflow: hidden;
    background:
        radial-gradient(ellipse at 85% 20%,
            rgba(190, 35, 50, 0.23),
            transparent 48%);
    color: #fff;
}

.movie-breadcrumb {
    padding-top: 24px;
    color: #d0d1d6;
    font-size: 0.875rem;
}

.poster-wrapper {
    max-width: 440px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 12px;
    background: #30333b;
    /* box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35); */
}

.movie-poster {
    display: block;
    width: 100%;
    aspect-ratio: 446 / 648;
    object-fit: cover;
}

.movie-label {
    display: inline-block;
    margin-bottom: 18px;
    color: #ff6976;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.14em;
}

.movie-title {
    margin: 0 0 12px;
    font-size: clamp(2rem, 4vw, 3.5rem);
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.035em;
}

.movie-original-title {
    margin-bottom: 24px;
    color: #b9bbc5;
    font-size: 1.05rem;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    margin-bottom: 24px;
    color: #e0e1e6;
    font-size: 0.95rem;
}

.movie-meta i {
    color: #ff6976;
}

.movie-genres {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
}

.genre-badge {
    padding: 7px 13px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.07);
    color: #f2f2f5;
    font-size: 0.8rem;
}

.movie-short-description {
    max-width: 680px;
    margin-bottom: 30px;
    /* color: #e0e1e6; */
    font-size: 1.05rem;
    line-height: 1.8;
}

.movie-director {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-left: 15px;
    border-left: 3px solid #e63946;
}

.director-label {
    color: #a9abb6;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
}

.director-name {
    font-size: 1rem;
    font-weight: 600;
}

/* Content */

.movie-content {
    max-width: 1200px;
}

.content-section {
    min-width: 0;
}

.section-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.section-accent {
    width: 4px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #e63946;
}

.section-heading h2 {
    margin: 0;
    font-size: 1.55rem;
    font-weight: 750;
    letter-spacing: -0.025em;
}

.movie-description {
    margin: 0;
    /* color: #555c68; */
    font-size: 1rem;
    line-height: 1.95;
    white-space: pre-line;
}

/* Cast */

.actor-card {
    height: 100%;
    padding: 20px 12px;
    border: 1px solid #e9eaf0;
    border-radius: 12px;
    background: #252832;
    text-align: center;
    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.actor-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(20, 25, 35, 0.07);
}

.actor-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    margin: 0 auto 14px;
    border-radius: 50%;
    background: #fff0f1;
    color: #d92f40;
    font-size: 1.65rem;
}

.actor-name {
    overflow-wrap: anywhere;
    font-size: 0.92rem;
    font-weight: 700;
}

.actor-role {
    margin-top: 5px;
    color: #858b97;
    font-size: 0.8rem;
}

/* Sidebar */

.details-card {
    padding: 26px;
    border: 1px solid #e9eaf0;
    border-radius: 14px;
    background: #252832;
    box-shadow: 0 8px 25px rgba(20, 25, 35, 0.035);
}

.details-card h3 {
    margin-bottom: 24px;
    font-size: 1.2rem;
    font-weight: 750;
}

.detail-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px 0;
    border-bottom: 1px solid #eff0f3;
}

.detail-row:first-of-type {
    padding-top: 0;
}

.detail-row:last-child {
    padding-bottom: 0;
    border-bottom: 0;
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
}

.cinema-note {
    display: flex;
    gap: 15px;
    padding: 22px;
    border-radius: 14px;
    background: #252832;
    border: 1px solid #e9eaf0;
    color: #fff;
}

.cinema-note>i {
    color: #ff6976;
    font-size: 1.8rem;
}

.cinema-note h4 {
    margin-bottom: 8px;
    font-size: 1rem;
    font-weight: 700;
}

.cinema-note p {
    margin: 0;
    color: #c5c7d0;
    font-size: 0.875rem;
    line-height: 1.7;
}

@media (max-width: 767.98px) {
    .movie-breadcrumb {
        padding-top: 18px;
    }

    .poster-wrapper {
        max-width: 500px;
    }

    .movie-title {
        font-size: 2.1rem;
    }

    .movie-short-description {
        font-size: 0.98rem;
    }

    .movie-content {
        padding-top: 32px !important;
    }
}

@media (prefers-reduced-motion: reduce) {
    .actor-card {
        transition: none;
    }
}
</style>