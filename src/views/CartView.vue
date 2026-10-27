<script lang="ts" setup>
import Navigation from '@/components/Navigation.vue';
import type { OrderModel } from '@/models/order.model';
import { OrderService } from '@/services/order.service';
import { getPrice } from '@/uitls';
import { ref } from 'vue';

const orders = ref<OrderModel[]>()
OrderService.getOrdersWithMovieObjectIncluded()
    .then(data => orders.value = data)

function getTotal() {
    return orders.value?.map(o => getPrice(o.seat))
        .reduce((sum, price) => sum + price)
}
</script>

<template>
    <Navigation />
    <div class="card">
        <div class="card-body">
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
                <button type="button" class="btn btn-success">
                    <i class="bi bi-credit-card"></i> Plati
                </button>
            </div>
        </div>
    </div>
</template>