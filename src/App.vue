<template>
  <div id="app">
    <!-- Navbar siempre visible -->
    <Navbar />
    
    <!-- Contenido principal con router-view -->
    <main class="main-content">
      <div class="container-fluid px-3 py-4">
        <router-view />
      </div>
    </main>
    
    <!-- Notificaciones globales -->
    <div 
      v-if="notification.show" 
      :class="['alert', `alert-${notification.type}`, 'notification-global']"
      role="alert"
    >
      <i :class="getNotificationIcon(notification.type)"></i>
      {{ notification.message }}
    </div>
  </div>
  <footer class="app-footer mt-5">
    <div class="container-fluid py-4 px-3">
      <div class="row align-items-center">
        <div class="col-md-4 mb-3 mb-md-0">
          <h5 class="fw-bold mb-2">Nuvastore</h5>
          <p class="small mb-0">Tu tienda de tecnología confiable. Ofertas, garantía y envío rápido.</p>
        </div>
        <div class="col-md-4 mb-3 mb-md-0 text-center">
          <div class="social-links">
            <a href="#" aria-label="Facebook" class="me-3"><i class="fa-brands fa-facebook"></i></a>
            <a href="#" aria-label="Twitter" class="me-3"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" aria-label="Instagram" class="me-3"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
        <div class="col-md-4 text-md-end text-center">
          <router-link to="/" class="footer-link me-3">Inicio</router-link>
          <router-link to="/products" class="footer-link me-3">Productos</router-link>
          <router-link to="/login" class="footer-link">Ayuda</router-link>
        </div>
      </div>
      <div class="border-top mt-3 pt-3 d-flex justify-content-between flex-wrap">
        <small>&copy; {{ new Date().getFullYear() }} Nuvastore. Todos los derechos reservados.</small>
        <small>Contacto: soporte@nuvastore.com</small>
      </div>
    </div>
  </footer>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      cartItems: [],
      cartVisible: false,
      notification: {
        show: false,
        message: '',
        type: 'info'
      }
    }
  },
  provide() {
    return {
      cartItems: () => this.cartItems,
      cartVisible: () => this.cartVisible,
      toggleCart: this.handleToggleCart,
      updateCart: this.handleUpdateCart,
      showNotification: this.handleShowNotification
    }
  },
  methods: {
    handleToggleCart() {
      this.cartVisible = !this.cartVisible
    },
    
    handleUpdateCart(items) {
      this.cartItems = items
      // Guardar en localStorage
      localStorage.setItem('nuvastore_cart', JSON.stringify(items))
    },
    
    handleShowNotification(message, type = 'info') {
      this.notification = {
        show: true,
        message,
        type
      }
      
      // Auto-ocultar después de 4 segundos
      setTimeout(() => {
        this.notification.show = false
      }, 4000)
    },
    
    getNotificationIcon(type) {
      const iconClasses = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-xmark',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info'
      }
      return iconClasses[type] || iconClasses.info
    },
    
    loadCartFromStorage() {
      try {
        const savedCart = localStorage.getItem('nuvastore_cart')
        if (savedCart) {
          this.cartItems = JSON.parse(savedCart)
        }
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error)
        this.cartItems = []
      }
    }
  },
  
  mounted() {
    // Cargar carrito desde localStorage al iniciar
    this.loadCartFromStorage()
  }
}
</script>

<style>
/* Estilos globales */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 76px; /* Altura del navbar fijo */
}

/* Notificaciones globales */
.notification-global {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 400px;
  animation: slideInRight 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 8px;
}

.notification-global i {
  margin-right: 8px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Mejoras de accesibilidad */
.btn:focus,
.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  border-color: #86b7fe;
}

/* Estilos para elementos de carga */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive utilities */
@media (max-width: 768px) {
  .notification-global {
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
  
  .main-content {
    padding-top: 70px;
  }
}

/* Estilos para mejorar la experiencia visual */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Estilos para botones personalizados */
.btn-nuvastore {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.btn-nuvastore:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-nuvastore:active {
  transform: translateY(0);
}
/* Footer */
.app-footer {
  background: var(--primary-dark);
  color: var(--primary-light);
}
.app-footer h5 { color: var(--primary-light); }
.footer-link {
  color: var(--primary-light);
  text-decoration: none;
}
.footer-link:hover { color: var(--primary-teal); }
.social-links i { font-size: 1.25rem; color: var(--primary-light); }
.social-links i:hover { color: var(--primary-teal); }

/* Main content */
</style>
