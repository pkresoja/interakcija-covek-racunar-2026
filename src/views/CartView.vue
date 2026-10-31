<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import type { OrderModel } from '@/models/order.model';
import { UserService } from '@/services/user.service';
import { getPrice } from '@/uitls';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const orders = ref<OrderModel[]>([])
UserService.getOrdersWithMovieObjectIncluded()
    .then(data => orders.value = data)

function getTotal() {
    return orders.value?.map(o => getPrice(o.seat))
        .reduce((sum, price) => sum + price)
}

function pay() {
    if (!confirm('Pay all?'))
        return

    if (!UserService.getActiveUser()) {
        sessionStorage.setItem('from', '/cart')
        router.push('/login')
        return
    }

    UserService.pay()
    router.push('/account')
}
</script>

<template>
    <Navigation />
    <div class="card">
        <div class="card-body" v-if="orders.length > 0">
            <table class="table">
                <thead>
                    <tr>
                        <th>Film</th>
                        <th>Žanr</th>
                        <th>Trajanje</th>
                        <th>Projekcija</th>
                        <th>Sedište</th>
                        <th>Cena po karti</th>
                        <th>Opcije</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders">
                        <td>{{ order.movie?.title }}</td>
                        <td>{{ order.movie?.movieGenres[0]?.genre.name }}</td>
                        <td>{{ order.movie?.runTime }} min</td>
                        <td>{{ order.time }}</td>
                        <td>{{ order.seat }}</td>
                        <td>{{ getPrice(order.seat) }} RSD</td>
                        <td>/</td>
                    </tr>
                </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center mx-2">
                <span class="h5">Ukupno: {{ getTotal() }} RSD</span>
                <button type="button" class="btn btn-success" @click="pay()">
                    <i class="bi bi-credit-card"></i> {{ UserService.getActiveUser() ? 'Plati' : 'Prijavi se i plati' }}
                </button>
            </div>
        </div>
        <div class="card-body text-center" v-else>
            <p class="h3">Nemate ništa u korpi!</p>
            <RouterLink to="/" class="btn btn-outline-primary">Pogeldajte ponudu filmova</RouterLink>
        </div>
    </div>
</template>