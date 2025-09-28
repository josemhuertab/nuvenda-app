<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div class="container-fluid px-3">
      <!-- Brand/Logo -->
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="fa-solid fa-store"></i>
        Nuvastore
      </router-link>

      <!-- Mobile toggle button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">
              <i class="fa-solid fa-house"></i>
              Inicio
            </router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/products" active-class="active">
              <i class="fa-solid fa-box"></i>
              Productos
            </router-link>
          </li>
        </ul>

        <!-- Right side navigation -->
        <ul class="navbar-nav">
          <!-- Cart button -->
          <li class="nav-item" v-if="isAuthenticated">
            <button
              class="nav-link btn btn-link text-white position-relative"
              @click="toggleCart"
              style="border: none; background: none;"
            >
              <i class="fa-solid fa-cart-shopping"></i>
              Carrito
              <span
                v-if="cartItemsCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ cartItemsCount }}
                <span class="visually-hidden">items en carrito</span>
              </span>
            </button>
          </li>

          <!-- Authentication section -->
          <li class="nav-item dropdown" v-if="isAuthenticated">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-solid fa-user"></i>
              {{ currentUser.name }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <span class="dropdown-item-text">
                  <small class="text-muted">{{ currentUser.email }}</small>
                </span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item" @click="logout">
                  <i class="fa-solid fa-right-from-bracket"></i>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </li>

          <!-- Login button when not authenticated -->
          <li class="nav-item" v-else>
            <router-link class="nav-link" to="/login" active-class="active">
              <i class="fa-solid fa-right-to-bracket"></i>
              Login
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { Auth } from '../services/auth.js'

export default {
  name: 'Navbar',
  inject: ['cartItems', 'toggleCart', 'showNotification'],
  data() {
    return {
      currentUser: null
    }
  },
  computed: {
    isAuthenticated() {
      return this.currentUser !== null
    },
    cartItemsCount() {
      const items = this.cartItems()
      return items.reduce((total, item) => total + item.quantity, 0)
    }
  },
  mounted() {
    this.checkAuthStatus()
    // Escuchar cambios en el localStorage para sincronizar entre pestañas
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    checkAuthStatus() {
      this.currentUser = Auth.getCurrentUser()
    },
    async logout() {
      try {
        await Auth.logout()
        Auth.removeUser()
        this.currentUser = null
        
        // Emitir evento de logout al componente padre
        this.$emit('user-logout')
        
        // Mostrar notificación
        this.showNotification('Sesión cerrada exitosamente', 'success')
        
        // Redirigir al login
        if (this.$route.path !== '/login') {
          this.$router.push('/login')
        }
      } catch (error) {
        console.error('Error during logout:', error)
        this.showNotification('Error al cerrar sesión', 'error')
      }
    },
    handleStorageChange(event) {
      if (event.key === 'nuvastore_user') {
        this.checkAuthStatus()
      }
    }
  },
  watch: {
    // Observar cambios en la ruta para actualizar el estado de autenticación
    '$route'() {
      this.checkAuthStatus()
    }
  }
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  text-decoration: none;
}

.navbar-brand:hover {
  color: #fff !important;
}

.nav-link {
  transition: color 0.2s ease-in-out;
  text-decoration: none;
}

.nav-link:hover {
  color: #e9ecef !important;
}

.nav-link.active {
  color: #fff !important;
  font-weight: 500;
}

.badge {
  font-size: 0.6rem;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 50%;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  transition: background-color 0.2s ease-in-out;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler:focus {
  box-shadow: none;
}

@media (max-width: 991px) {
  .navbar-nav {
    text-align: center;
  }
  
  .dropdown-menu {
    position: static !important;
    transform: none !important;
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
  
  .dropdown-item {
    color: #fff;
    padding: 0.5rem 1rem;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.navbar {
  width: 100%;
}
</style>