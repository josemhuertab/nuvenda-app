import { createRouter, createWebHistory } from 'vue-router'
import { Auth } from '../services/auth.js'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Inicio - Nuvastore'
    }
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Iniciar Sesión - Nuvastore',
      requiresGuest: true
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: Home,
    meta: {
      title: 'Productos - Nuvastore',
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  const isAuthenticated = Auth.isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    sessionStorage.setItem('nuvastore_redirect_after_login', to.fullPath)
    
    next('/login')
    return
  }
  
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router