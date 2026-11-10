<script lang="ts" setup>
import Loading from '@/components/Loading.vue';
import Navigation from '@/components/Navigation.vue';
import type { GenreModel } from '@/models/genre.model';
import type { MovieModel } from '@/models/movie.model';
import type { OrderModel } from '@/models/order.model';
import { MovieService } from '@/services/movie.service';
import { UserService } from '@/services/user.service';
import { formatDate } from '@/uitls';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const user = UserService.getActiveUser()
const orders = ref<OrderModel[]>([])
const genre = ref<GenreModel>()
const movies = ref<MovieModel[]>([])

onMounted(() => {
    if (!UserService.getActiveUser()) {
        router.push('/login')
        return
    }

    UserService.mapMovieObjectToOrders(user!.orders)
        .then(data => orders.value = data)

    MovieService.getGenreById(user!.genreId)
        .then(rsp => genre.value = rsp.data)

    MovieService.getMoviesByGenreId(user!.genreId)
        .then(data => movies.value = data)
})
</script>

<template>
    <Navigation />
    <template v-if="user && genre && movies">
        <div class="row">
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
                            Omiljeni žanr: <strong>{{ genre.name }}</strong>
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
        <div class="card" v-if="orders.length > 0">
            <div class="card-header fw-bold">Istorija narudžbina</div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Naziv Filma</th>
                            <th scope="col">Vreme Projekcije</th>
                            <th scope="col">Sedište</th>
                            <th scope="col">Datum rezervacije</th>
                            <th scope="col">Datum plaćanja</th>
                            <th scope="col">Opcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders">
                            <th scope="row">{{ order.movie?.title }}</th>
                            <td>{{ order.time }}</td>
                            <td>{{ order.seat }}</td>
                            <td>{{ formatDate(order.createdAt) }}</td>
                            <td>{{ formatDate(order.paidAt!) }}</td>
                            <td>
                                <div class="btn-group">
                                    <RouterLink :to="`/movie/${order.movie?.shortUrl}`" class="btn btn-sm btn-primary">
                                        <i class="bi bi-box-arrow-up-right"></i> O filmu
                                    </RouterLink>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </template>
    <Loading v-else />
</template>