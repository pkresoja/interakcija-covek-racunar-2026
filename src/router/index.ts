import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DetailsView from '@/views/DetailsView.vue'
import LoginView from '@/views/LoginView.vue'
import OrderView from '@/views/OrderView.vue'
import CartView from '@/views/CartView.vue'
import UserView from '@/views/UserView.vue'
import { UserService } from '@/services/user.service'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: {
        title: 'Home',
        protected: false
      }
    },
    {
      path: '/about',
      component: AboutView,
      meta: {
        title: 'About',
        protected: false
      }
    },
    {
      path: '/movie/:perma/order',
      component: OrderView,
      meta: {
        title: 'New Order',
        protected: false
      }
    },
    {
      path: '/movie/:perma',
      component: DetailsView,
      meta: {
        title: 'Details',
        protected: false
      }
    },
    {
      path: '/login',
      component: LoginView,
      meta: {
        title: 'Login',
        protected: false
      }
    },
    {
      path: '/cart',
      component: CartView,
      meta: {
        title: 'Cart',
        protected: false
      }
    },
    {
      path: '/account',
      component: UserView,
      meta: {
        title: 'My Account',
        protected: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.afterEach((to, from, next) => {
  if (to.meta.protected && !UserService.getActiveUser()) {
    sessionStorage.setItem('from', to.path)
    router.push('/login')
    return
  }

  if (to.meta.title) {
    document.title = `${to.meta.title} :: ICR 2026`
  }
})

export default router
