<script setup lang="ts">
import Navigation from '@/components/Navigation.vue';
import type { SimpleModel } from '@/models/simple.model';
import { MovieService } from '@/services/movie.service';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const movies = ref<SimpleModel[]>([])
const filtered = ref<SimpleModel[]>([])
const search = ref<string>('')
const router = useRouter()

MovieService.getMovies()
  .then(data => {
    movies.value = data
    filtered.value = data
  })

const updateMovies = () => {
  filtered.value = movies.value.filter(m =>
    m.title.toLowerCase().includes(search.value.toLowerCase()) ||
    m.shortDescription.toLowerCase().includes(search.value.toLowerCase())
  )
}

function openDetails(movie: SimpleModel) {
  router.push(`/movie/${movie.shortUrl}`)
}

watch(search, updateMovies)
</script>

<template>
  <Navigation>
    <form class="d-flex" role="search" @submit.prevent="updateMovies">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="search" />
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
  </Navigation>
  <div class="row" v-if="filtered.length > 0">
    <div class="col-md-3 col-12 mb-3" v-for="movie in filtered">
      <div class="card h-100 pointer" @click="openDetails(movie)">
        <img :src="movie.poster" class="card-img-top" :alt="movie.title">
        <div class="card-body">
          <h5 class="card-title">{{ movie.title }}</h5>
          <p>{{ movie.shortDescription }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="filtered.length == 0 && movies.length > 0">
    We couldn't find any movies for that criteria!
  </div>

  <div v-if="movies.length == 0">
    Movies are loading... Please wait!
  </div>
</template>
