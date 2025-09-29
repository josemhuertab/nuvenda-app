<template>
  <div class="home-view">
    <section class="hero-section bg-dark text-white py-5 mb-5 position-relative">
      <div class="hero-overlay"></div>
      <div class="container-fluid position-relative px-0">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-3">
              Bienvenido a Nuvastore
            </h1>
            <p class="lead mb-4">
              Descubre los mejores productos tecnológicos con las mejores ofertas.
              Calidad garantizada y envío rápido a todo el país.
            </p>
            <div class="hero-stats">
              <div class="row text-center">
                <div class="col-4">
                  <h3 class="fw-bold">500+</h3>
                  <small>Productos</small>
                </div>
                <div class="col-4">
                  <h3 class="fw-bold">24/7</h3>
                  <small>Soporte</small>
                </div>
                <div class="col-4">
                  <h3 class="fw-bold">99%</h3>
                  <small>Satisfacción</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <i class="fa-solid fa-store fa-10x opacity-75"></i>
          </div>
        </div>
      </div>
    </section>

    <div v-if="isAuthenticated" class="container-fluid px-0 mb-4">
      <div class="alert alert-success" role="alert">
        <i class="fa-solid fa-user-check"></i>
        <strong>¡Hola {{ currentUser.name }}!</strong>
        Explora nuestro catálogo de productos y encuentra lo que necesitas.
      </div>
    </div>

    <div v-else class="container-fluid px-3 mb-4">
      <div class="alert alert-info" role="alert">
        <i class="fa-solid fa-circle-info"></i>
        <strong>¡Inicia sesión para comenzar a comprar!</strong>
        <router-link to="/login" class="btn btn-primary btn-sm ms-2">
          <i class="fa-solid fa-right-to-bracket"></i>
          Iniciar sesión
        </router-link>
      </div>
    </div>

    <section class="products-section">
      <div class="container-fluid px-3">
        <div class="row">
          <div class="col-12">
            <div class="section-header text-center mb-5">
              <h2 class="display-5 fw-bold text-primary">
                <i class="fa-solid fa-box-open"></i>
                Nuestros Productos
              </h2>
              <p class="lead text-muted">
                Encuentra la tecnología más avanzada al mejor precio
              </p>
            </div>
          </div>
        </div>

        <div v-if="isAuthenticated">
          <Products />
        </div>
        
        <div v-else class="text-center py-5">
          <i class="fa-solid fa-lock fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">Inicia sesión para ver los productos</h4>
          <p class="text-muted mb-4">
            Necesitas estar autenticado para acceder a nuestro catálogo de productos
          </p>
          <router-link to="/login" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-right-to-bracket"></i>
            Iniciar sesión ahora
          </router-link>
          <div id="publicProductsCarousel" class="carousel slide mt-5" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div v-for="(chunk, idx) in productChunks" :key="idx" :class="['carousel-item', { active: idx === 0 }]">
                <div class="row g-3 justify-content-center">
                  <div v-for="product in chunk" :key="product.id" class="col-10 col-sm-6 col-md-4 col-lg-3">
                    <div class="card h-100 shadow-sm">
                      <img :src="product.image" :alt="product.name" class="card-img-top" style="height: 180px; object-fit: cover;" />
                      <div class="card-body">
                        <h6 class="card-title mb-2">{{ product.name }}</h6>
                        <p class="card-text text-muted">${{ product.price.toFixed(2) }}</p>
                        <span class="badge bg-secondary">Stock: {{ product.stock }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#publicProductsCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Anterior</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#publicProductsCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section bg-light py-5 mt-5">
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h3 class="fw-bold text-primary">¿Por qué elegir Nuvastore?</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 text-center mb-4">
            <div class="feature-card p-4">
              <i class="fa-solid fa-truck-fast fa-3x text-primary mb-3"></i>
              <h5 class="fw-bold">Envío Rápido</h5>
              <p class="text-muted">
                Entrega en 24-48 horas en toda la ciudad
              </p>
            </div>
          </div>
          <div class="col-md-4 text-center mb-4">
            <div class="feature-card p-4">
              <i class="fa-solid fa-shield-halved fa-3x text-primary mb-3"></i>
              <h5 class="fw-bold">Garantía Total</h5>
              <p class="text-muted">
                Todos nuestros productos tienen garantía oficial
              </p>
            </div>
          </div>
          <div class="col-md-4 text-center mb-4">
            <div class="feature-card p-4">
              <i class="fa-solid fa-headset fa-3x text-primary mb-3"></i>
              <h5 class="fw-bold">Soporte 24/7</h5>
              <p class="text-muted">
                Atención al cliente disponible las 24 horas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CartDetail
      :is-visible="isCartVisible"
      :cart-items="currentCartItems"
      @close-cart="closeCart"
      @update-cart-item="updateCartItem"
      @remove-from-cart="removeFromCart"
      @clear-cart="clearCart"
    />
  </div>
</template>

<script>
import Products from '../components/Products.vue'
import CartDetail from '../components/CartDetail.vue'
import { Auth } from '../services/auth.js'
import { API } from '../services/api.js'

export default {
  name: 'Home',
  components: {
    Products,
    CartDetail
  },
  inject: ['cartItems', 'cartVisible', 'toggleCart', 'updateCart', 'showNotification'],
  data() {
    return {
      currentUser: null,
      publicProducts: [],
      productChunks: []
    }
  },
  computed: {
    isAuthenticated() {
      return this.currentUser !== null
    },
    currentCartItems() {
      return this.cartItems()
    },
    isCartVisible() {
      return this.cartVisible()
    }
  },
  mounted() {
    this.checkAuthStatus()
    this.loadPublicProducts()
  },
  methods: {
    checkAuthStatus() {
      this.currentUser = Auth.getCurrentUser()
    },
    async loadPublicProducts() {
      try {
        const products = await API.all()
        this.publicProducts = products
        this.productChunks = this.chunkArray(products, 4)
      } catch (e) {
        console.error('Error cargando productos públicos', e)
      }
    },
    chunkArray(arr, size) {
      const chunks = []
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
      }
      return chunks
    },
    addToCart(product) {
      const cartItems = this.cartItems()
      const existingItem = cartItems.find(item => item.id === product.id)
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + product.quantity
        if (newQuantity <= product.stock) {
          existingItem.quantity = newQuantity
        } else {
          this.showNotification(`No hay suficiente stock. Máximo disponible: ${product.stock}`, 'warning')
          return
        }
      } else {
        cartItems.push({
          ...product,
          cartId: Date.now() + Math.random()
        })
      }
      
      this.updateCart(cartItems)
      this.showNotification(`${product.name} agregado al carrito`, 'success')
    },
    updateCartItem(updatedItem) {
      const cartItems = this.cartItems()
      const index = cartItems.findIndex(item => item.id === updatedItem.id)
      if (index !== -1) {
        cartItems[index] = updatedItem
        this.updateCart(cartItems)
      }
    },
    removeFromCart(itemToRemove) {
      const cartItems = this.cartItems()
      const updatedCart = cartItems.filter(item => item.id !== itemToRemove.id)
      this.updateCart(updatedCart)
    },
    clearCart() {
      this.updateCart([])
    },
    closeCart() {
      if (this.cartVisible()) {
        this.toggleCart()
      }
    },
    handleUserLogout() {
      this.currentUser = null
      this.clearCart()
      this.closeCart()
    },
    showNotification(message, type = 'info') {
      const alertClass = type === 'success' ? 'alert-success' : 
                        type === 'warning' ? 'alert-warning' :
                        type === 'error' ? 'alert-danger' : 'alert-info'
      
      const notification = document.createElement('div')
      notification.className = `alert ${alertClass} position-fixed`
      notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;'
      notification.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i>
        ${message}
      `
      
      document.body.appendChild(notification)
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 3000)
    }
  },
  watch: {
    '$route'() {
      this.checkAuthStatus()
    }
  }
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-gray) 100%);
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 173, 181, 0.15);
}
.hero-stats h3 {
  color: var(--primary-teal);
}
.section-header h2 {
  color: var(--primary-teal);
}
.btn-primary {
  background-color: var(--primary-teal);
  border-color: var(--primary-teal);
}
.btn-primary:hover {
  background-color: var(--primary-teal-soft);
  border-color: var(--primary-teal-soft);
}

.hero-stats {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-top: 30px;
  backdrop-filter: blur(10px);
}

.section-header {
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-teal), var(--primary-teal-soft));
  border-radius: 2px;
}

.feature-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.features-section {
  border-top: 1px solid #dee2e6;
}

.products-section {
  min-height: 400px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0 !important;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .hero-stats {
    margin-top: 20px;
    padding: 15px;
  }
  
  .feature-card {
    margin-bottom: 20px;
  }
}

.hero-section {
  animation: fadeInUp 0.8s ease-out;
}

.feature-card {
  animation: fadeInUp 0.6s ease-out;
}

.feature-card:nth-child(2) {
  animation-delay: 0.1s;
}

.feature-card:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>