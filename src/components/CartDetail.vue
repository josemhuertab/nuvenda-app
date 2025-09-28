<template>
  <!-- Modal backdrop -->
  <div
    v-if="isVisible"
    class="modal-backdrop fade show"
    @click="closeCart"
  ></div>

  <!-- Cart Modal -->
  <div
    v-if="isVisible"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    aria-labelledby="cartModalLabel"
    aria-hidden="false"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="cartModalLabel">
            <i class="fa-solid fa-cart-shopping"></i>
            Carrito de Compras
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="closeCart"
            aria-label="Cerrar"
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Empty cart state -->
            <div v-if="cartItems.length === 0" class="text-center py-5">
              <i class="fa-solid fa-cart-shopping fa-3x text-muted mb-3"></i>
              <h4 class="text-muted">Tu carrito está vacío</h4>
              <p class="text-muted">Agrega algunos productos para comenzar</p>
              <button class="btn btn-primary" @click="closeCart">
                <i class="fa-solid fa-arrow-left"></i>
                Continuar comprando
              </button>
            </div>

          <!-- Cart items -->
          <div v-else>
            <!-- Cart summary -->
            <div class="cart-summary mb-4 p-3 bg-light rounded">
              <div class="row">
                <div class="col-md-6">
                  <h6 class="mb-1">
                     <i class="fa-solid fa-box"></i>
                     {{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }}
                   </h6>
                </div>
                <div class="col-md-6 text-md-end">
                  <h5 class="mb-0 text-primary">
                    <strong>Total: ${{ totalPrice.toFixed(2) }}</strong>
                  </h5>
                </div>
              </div>
            </div>

            <!-- Cart items list -->
            <div class="cart-items">
              <div
                v-for="item in cartItems"
                :key="item.id"
                class="cart-item border rounded p-3 mb-3"
              >
                <div class="row align-items-center">
                  <!-- Product image -->
                  <div class="col-md-2 col-3">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="img-fluid rounded"
                      style="max-height: 80px; object-fit: cover;"
                    />
                  </div>

                  <!-- Product info -->
                  <div class="col-md-4 col-9">
                    <div class="d-flex align-items-center">
                      <i class="fa-solid fa-box me-2 text-primary"></i>
                      <div class="flex-grow-1">
                        <h6 class="mb-1">{{ item.name }}</h6>
                        <small class="text-muted">{{ item.description }}</small>
                      </div>
                    </div>
                    <p class="text-primary mb-0 mt-2">
                      <strong>${{ item.price.toFixed(2) }}</strong>
                    </p>
                  </div>

                  <!-- Quantity controls -->
                  <div class="col-md-3 col-6 mt-2 mt-md-0">
                    <label class="form-label small">Cantidad:</label>
                    <div class="input-group input-group-sm">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="decreaseQuantity(item)"
                        :disabled="item.quantity <= 1"
                      >
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <input
                        type="number"
                        class="form-control text-center"
                        :value="item.quantity"
                        @change="updateQuantity(item, $event.target.value)"
                        min="1"
                        :max="item.stock"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="increaseQuantity(item)"
                        :disabled="item.quantity >= item.stock"
                      >
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Subtotal and remove -->
                  <div class="col-md-3 col-6 mt-2 mt-md-0 text-md-end">
                    <p class="mb-2">
                      <strong>${{ (item.price * item.quantity).toFixed(2) }}</strong>
                    </p>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      @click="removeFromCart(item)"
                      title="Eliminar del carrito"
                    >
                      <i class="fa-solid fa-trash"></i>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div v-if="cartItems.length > 0" class="modal-footer">
          <div class="w-100">
            <div class="row">
              <div class="col-md-6">
                <button
                  class="btn btn-outline-danger w-100"
                  @click="clearCart"
                >
                  <i class="fa-solid fa-trash"></i>
                  Vaciar carrito
                </button>
              </div>
              <div class="col-md-6 mt-2 mt-md-0">
                <button
                  class="btn btn-success w-100"
                  @click="proceedToCheckout"
                >
                  <i class="fa-solid fa-credit-card"></i>
                  Proceder al pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartDetail',
  inject: ['showNotification'],
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    cartItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },
  methods: {
    closeCart() {
      this.$emit('close-cart')
    },
    increaseQuantity(item) {
      if (item.quantity < item.stock) {
        const updatedItem = { ...item, quantity: item.quantity + 1 }
        this.$emit('update-cart-item', updatedItem)
      }
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        const updatedItem = { ...item, quantity: item.quantity - 1 }
        this.$emit('update-cart-item', updatedItem)
      }
    },
    updateQuantity(item, newQuantity) {
      const quantity = parseInt(newQuantity)
      if (quantity >= 1 && quantity <= item.stock) {
        const updatedItem = { ...item, quantity }
        this.$emit('update-cart-item', updatedItem)
      }
    },
    removeFromCart(item) {
      // Confirmar eliminación
      if (confirm(`¿Estás seguro de que quieres eliminar "${item.name}" del carrito?`)) {
        this.$emit('remove-from-cart', item)
        this.showNotification(`${item.name} eliminado del carrito`, 'info')
      }
    },
    clearCart() {
      // Confirmar vaciado del carrito
      if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        this.$emit('clear-cart')
        this.showNotification('Carrito vaciado', 'info')
      }
    },
    proceedToCheckout() {
      // Simular proceso de checkout
      alert(`Procediendo al pago de $${this.totalPrice.toFixed(2)} por ${this.totalItems} productos.\n\nEsta es una simulación - funcionalidad de pago no implementada.`)
    },

  },
  watch: {
    isVisible(newVal) {
      // Controlar el scroll del body cuando el modal está abierto
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  },
  beforeUnmount() {
    // Asegurar que el scroll se restaure al destruir el componente
    document.body.style.overflow = 'auto'
  }
}
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.cart-item {
  transition: all 0.2s ease-in-out;
  background-color: #fff;
}

.cart-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-summary {
  border: 1px solid #dee2e6;
}

.input-group-sm .form-control {
  max-width: 70px;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }
  
  .cart-item .row > div {
    margin-bottom: 0.5rem;
  }
  
  .cart-item .col-md-3:last-child {
    text-align: center !important;
  }
}

/* Animaciones */
.modal.show {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-backdrop.show {
  animation: backdropFadeIn 0.3s ease-out;
}

@keyframes backdropFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
</style>