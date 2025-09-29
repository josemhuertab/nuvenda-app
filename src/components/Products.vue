<template>
  <div class="products-container">
    <div class="search-section mb-4">
      <div class="row">
        <div class="col-md-6">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar productos por nombre..."
              v-model="searchTerm"
              @input="filterProducts"
            />
            <button class="btn btn-primary" type="button" @click="filterProducts">
              <i class="fa-solid fa-magnifying-glass"></i> Buscar
            </button>
          </div>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="selectedCategory" @change="filterProducts">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <button class="btn btn-outline-secondary" @click="clearAllFilters">
            <i class="fa-solid fa-xmark"></i> Limpiar filtros
          </button>
        </div>
      </div>
      
      <div class="row mt-3">
        <div class="col-md-6">
          <label class="form-label">Rango de precio:</label>
          <div class="row">
            <div class="col-6">
              <input
                type="number"
                class="form-control"
                placeholder="Precio mínimo"
                v-model.number="priceRange.min"
                @input="filterProducts"
                min="0"
              />
            </div>
            <div class="col-6">
              <input
                type="number"
                class="form-control"
                placeholder="Precio máximo"
                v-model.number="priceRange.max"
                @input="filterProducts"
                min="0"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label">Ordenar por:</label>
          <select class="form-select" v-model="sortBy" @change="sortProducts">
            <option value="">Sin ordenar</option>
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio (menor a mayor)</option>
            <option value="price-desc">Precio (mayor a menor)</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando productos...</span>
      </div>
      <p class="mt-2">Cargando productos...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <i class="fa-solid fa-triangle-exclamation"></i>
      Error al cargar los productos: {{ error }}
    </div>

    <div v-else-if="filteredProducts.length === 0 && !loading" class="text-center py-5">
      <i class="fa-solid fa-search fa-3x text-muted mb-3"></i>
      <h4 class="text-muted">No se encontraron productos</h4>
      <p class="text-muted">
        {{ searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay productos disponibles' }}
      </p>
    </div>

    <div v-else class="row">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="col-lg-4 col-md-6 col-sm-12 mb-4"
      >
        <div class="card h-100 product-card" :class="{ 'out-of-stock': product.stock === 0 }">
          <img
            :src="product.image"
            class="card-img-top"
            :alt="product.name"
            style="height: 200px; object-fit: cover;"
          />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">
              <i class="fa-solid fa-box"></i>
              {{ product.name }}
            </h5>
            <p class="card-text flex-grow-1">{{ product.description }}</p>
            <div class="product-info">
              <p class="price h4 text-primary mb-2">${{ product.price.toFixed(2) }}</p>
              <p class="stock mb-3" :class="stockClass(product.stock)">
                <i class="fa-solid fa-box"></i>
                {{ stockText(product.stock) }}
              </p>
            </div>
          </div>
          <div class="card-footer bg-transparent" v-if="product.stock > 0">
            <div class="row align-items-center">
              <div class="col-4">
                <select
                  class="form-select form-select-sm"
                  v-model="quantities[product.id]"
                  :max="product.stock"
                >
                  <option
                    v-for="n in Math.min(product.stock, 10)"
                    :key="n"
                    :value="n"
                  >
                    {{ n }}
                  </option>
                </select>
              </div>
              <div class="col-8">
                <button
                  class="btn btn-success w-100"
                  @click="addToCart(product)"
                  :disabled="product.stock === 0"
                >
                  <i class="fa-solid fa-cart-plus"></i>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer bg-transparent" v-else>
            <button class="btn btn-secondary w-100" disabled>
              <i class="fa-solid fa-xmark"></i>
              Sin stock
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API } from '../services/api.js'

export default {
  name: 'Products',
  inject: ['showNotification', 'cartItems', 'updateCart'],
  data() {
    return {
      products: [],
      filteredProducts: [],
      searchTerm: '',
      selectedCategory: '',
      priceRange: {
        min: null,
        max: null
      },
      sortBy: '',
      loading: true,
      error: null,
      quantities: {} // Para almacenar las cantidades seleccionadas por producto
    }
  },
  computed: {
    categories() {
      // Extraer categorías únicas de los productos
      const cats = [...new Set(this.products.map(product => product.category).filter(Boolean))]
      return cats.sort()
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        this.products = await API.all()
        this.filteredProducts = [...this.products]
        
        // Inicializar cantidades por defecto
        this.products.forEach(product => {
          this.quantities[product.id] = 1
        })
      } catch (err) {
        this.error = err.message || 'Error al cargar los productos'
        console.error('Error loading products:', err)
      } finally {
        this.loading = false
      }
    },
    filterProducts() {
      let filtered = [...this.products]
      
      // Filtro por término de búsqueda
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase().trim()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
        )
      }
      
      // Filtro por categoría
      if (this.selectedCategory) {
        filtered = filtered.filter(product => product.category === this.selectedCategory)
      }
      
      // Filtro por rango de precio
      if (this.priceRange.min !== null && this.priceRange.min !== '') {
        filtered = filtered.filter(product => product.price >= this.priceRange.min)
      }
      if (this.priceRange.max !== null && this.priceRange.max !== '') {
        filtered = filtered.filter(product => product.price <= this.priceRange.max)
      }
      
      this.filteredProducts = filtered
      this.sortProducts()
    },
    sortProducts() {
      if (!this.sortBy) return
      
      const [field, direction] = this.sortBy.split('-')
      
      this.filteredProducts.sort((a, b) => {
        let valueA = a[field]
        let valueB = b[field]
        
        if (field === 'name') {
          valueA = valueA.toLowerCase()
          valueB = valueB.toLowerCase()
        }
        
        if (direction === 'asc') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0
        }
      })
    },
    clearAllFilters() {
      this.searchTerm = ''
      this.selectedCategory = ''
      this.priceRange.min = null
      this.priceRange.max = null
      this.sortBy = ''
      this.filteredProducts = [...this.products]
    },
    addToCart(product) {
      const quantity = this.quantities[product.id] || 1
      const cartItems = this.cartItems()
      const existingItem = cartItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Si el producto ya existe, aumentar la cantidad
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity <= product.stock) {
          existingItem.quantity = newQuantity
        } else {
          this.showNotification(`No hay suficiente stock. Máximo disponible: ${product.stock}`, 'warning')
          return
        }
      } else {
        // Si es un producto nuevo, agregarlo al carrito
        cartItems.push({
          ...product,
          quantity: quantity,
          cartId: Date.now() + Math.random(), // ID único para el carrito
          addedAt: new Date().toISOString()
        })
      }
      
      // Actualizar el carrito usando inject
      this.updateCart(cartItems)
      
      this.showNotification(`${product.name} agregado al carrito (${quantity} unidad${quantity > 1 ? 'es' : ''})`, 'success')
    },
    stockClass(stock) {
      if (stock === 0) return 'text-danger'
      if (stock <= 5) return 'text-warning'
      return 'text-success'
    },
    stockText(stock) {
      if (stock === 0) return 'Sin stock'
      if (stock === 1) return '1 unidad disponible'
      return `${stock} unidades disponibles`
    }
  },
  watch: {
    searchTerm() {
      this.filterProducts()
    }
  }
}
</script>

<style scoped>
.products-container {
  padding: 20px 0;
}

.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  border: 1px solid #dee2e6;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.product-card.out-of-stock {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.price {
  font-weight: bold;
  margin: 0;
}

.stock {
  font-size: 0.9em;
  margin: 0;
}

.search-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.card-img-top {
  transition: transform 0.2s ease-in-out;
}

.product-card:hover .card-img-top {
  transform: scale(1.05);
}

.product-info {
  border-top: 1px solid #dee2e6;
  padding-top: 15px;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .products-container {
    padding: 10px 0;
  }
  
  .search-section {
    padding: 15px;
  }
}
</style>