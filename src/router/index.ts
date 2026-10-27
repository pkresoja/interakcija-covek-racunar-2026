import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DetailsView from '@/views/DetailsView.vue'
import LoginView from '@/views/LoginView.vue'
import OrderView from '@/views/OrderView.vue'
import CartView from '@/views/CartView.vue'
import UserView from '@/views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/about',
      component: AboutView,
      meta: {
        title: 'About'
      }
    },
    {
      path: '/movie/:perma/order',
      component: OrderView,
      meta: {
        title: 'New Order'
      }
    },
    {
      path: '/movie/:perma',
      component: DetailsView,
      meta: {
        title: 'Details'
      }
    },
    {
      path: '/login',
      component: LoginView,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/cart',
      component: CartView,
      meta: {
        title: 'Cart'
      }
    },
    {
      path: '/account',
      component: UserView,
      meta: {
        title: 'My Account'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.afterEach((to, from, next)=>{
  if (to.meta.title) {
    document.title = `${to.meta.title} :: ICR 2026`
  }
})

export default router
