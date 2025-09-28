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

// Guards de navegación con autenticación
router.beforeEach((to, from, next) => {
  // Actualizar título de la página
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  const isAuthenticated = Auth.isAuthenticated()
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Guardar la ruta a la que el usuario quería ir
    sessionStorage.setItem('nuvastore_redirect_after_login', to.fullPath)
    
    // Redirigir al login
    next('/login')
    return
  }
  
  // Verificar si la ruta es solo para invitados (no autenticados)
  if (to.meta.requiresGuest && isAuthenticated) {
    // Si el usuario ya está autenticado, redirigir al home
    next('/')
    return
  }
  
  // Continuar con la navegación
  next()
})

export default router