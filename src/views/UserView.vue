<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import type { MovieModel } from '@/models/movie.model';
import { MovieService } from '@/services/movie.service';
import { UserService } from '@/services/user.service';
import { ref } from 'vue';

const user = UserService.getActiveUser()
const movies = ref<MovieModel[]>([])
MovieService.getMoviesByGenreId(3)
    .then(data => movies.value = data)
</script>

<template>
    <Navigation />
    <div class="row" v-if="user">
        <div class="col-12 col-md-4 mb-3">
            <div class="card">
                <div class="card-header fw-bold">Podaci o korisniku</div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        Ime: <strong>{{ user.firstName }}</strong>
                    </li>
                    <li class="list-group-item">
                        Prezime: <strong>{{ user.lastName }}</strong>
                    </li>
                    <li class="list-group-item">
                        Email: <strong>{{ user.email }}</strong>
                    </li>
                    <li class="list-group-item">
                        Omiljeni žanr: <strong>{{ user.genre }}</strong>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-12 col-md-8 mb-3">
            <div class="card">
                <div class="card-header fw-bold">Preporučeni filmovi</div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="movie in movies">
                        <RouterLink to="#">{{ movie.title }}</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header fw-bold">Istorija narudžbina</div>
        <div class="card-body">
            <pre>{{ user?.orders }}</pre>
        </div>
    </div>
</template>