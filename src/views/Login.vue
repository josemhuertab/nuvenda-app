<template>
  <div class="login-view">
    <div class="container-fluid h-100 px-3">
      <div class="row h-100">
        <!-- Left side - Login Form -->
        <div class="col-lg-6 col-md-8 mx-auto d-flex align-items-center">
          <div class="login-container w-100">
            <div class="text-center mb-5">
              <i class="fa-solid fa-store fa-3x text-primary mb-3"></i>
              <h1 class="h2 fw-bold text-primary">Nuvastore</h1>
              <p class="text-muted">Inicia sesión en tu cuenta</p>
            </div>

            <!-- Login Form -->
            <div class="card shadow-lg border-0">
              <div class="card-body p-5">
                <form @submit.prevent="handleLogin">
                  <!-- Email Field -->
                  <div class="mb-4">
                    <label for="email" class="form-label fw-semibold">
                      <i class="fa-solid fa-envelope text-primary"></i>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      class="form-control form-control-lg"
                      id="email"
                      v-model="credentials.email"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="usuario1@mitienda.com"
                      required
                      autocomplete="email"
                    />
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email }}
                    </div>
                  </div>

                  <!-- Password Field -->
                  <div class="mb-4">
                    <label for="password" class="form-label fw-semibold">
                      <i class="fa-solid fa-lock text-primary"></i>
                      Contraseña
                    </label>
                    <div class="input-group">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control form-control-lg"
                        id="password"
                        v-model="credentials.password"
                        :class="{ 'is-invalid': errors.password }"
                        placeholder="password"
                        required
                        autocomplete="current-password"
                      />
                      <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="togglePasswordVisibility"
                  >
                    <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                    </div>
                    <div v-if="errors.password" class="invalid-feedback d-block">
                      {{ errors.password }}
                    </div>
                  </div>

                  <!-- Remember Me -->
                  <div class="mb-4">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        v-model="rememberMe"
                      />
                      <label class="form-check-label" for="rememberMe">
                        Recordar mi sesión
                      </label>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div v-if="loginError" class="alert alert-danger" role="alert">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    {{ loginError }}
                  </div>

                  <!-- Success Message -->
                  <div v-if="loginSuccess" class="alert alert-success" role="alert">
                    <i class="fa-solid fa-circle-check"></i>
                    {{ loginSuccess }}
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg w-100 mb-3"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status">
                      <span class="visually-hidden">Cargando...</span>
                    </span>
                    <i v-else class="fa-solid fa-right-to-bracket me-2"></i>
                    {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                  </button>

                  <!-- Demo Credentials -->
                  <div class="text-center">
                    <small class="text-muted">
                      <strong>Credenciales de prueba:</strong><br>
                      Email: usuario1@mitienda.com<br>
                      Contraseña: password
                    </small>
                  </div>
                </form>
              </div>
            </div>

            <!-- Additional Links -->
            <div class="text-center mt-4">
              <p class="text-muted">
                ¿No tienes una cuenta?
                <a href="#" class="text-primary text-decoration-none fw-semibold" data-bs-toggle="modal" data-bs-target="#registerModal">
                  Regístrate aquí
                </a>
              </p>
              <router-link to="/" class="text-muted text-decoration-none">
                <i class="fa-solid fa-arrow-left"></i>
                Volver al inicio
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right side - Hero Image/Info -->
        <div class="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-primary text-white">
          <div class="hero-content text-center p-5">
            <i class="fa-solid fa-cart-shopping fa-5x mb-4 opacity-75"></i>
            <h2 class="display-5 fw-bold mb-4">
              ¡Bienvenido de vuelta!
            </h2>
            <p class="lead mb-4">
              Accede a miles de productos tecnológicos con las mejores ofertas del mercado.
            </p>
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
      </div>
    </div>

    <!-- Modal de Registro (dentro del template) -->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerModalLabel">Crear cuenta</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label" for="registerName">Nombre</label>
                <input id="registerName" v-model="registerForm.name" type="text" class="form-control" placeholder="Tu nombre" required />
              </div>
              <div class="mb-3">
                <label class="form-label" for="registerEmail">Correo electrónico</label>
                <input id="registerEmail" v-model="registerForm.email" type="email" class="form-control" placeholder="correo@ejemplo.com" required />
              </div>
              <div class="mb-3">
                <label class="form-label" for="registerPassword">Contraseña</label>
                <input id="registerPassword" v-model="registerForm.password" type="password" class="form-control" placeholder="Mínimo 6 caracteres" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">
                <i class="fa-solid fa-user-plus me-2"></i> Crear cuenta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from '../services/auth.js'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: ''
      },
      errors: {},
      loginError: '',
      loginSuccess: '',
      registerError: '',
      registerSuccess: '',
      isLoading: false,
      showPassword: false,
      rememberMe: false
    }
  },
  mounted() {
    // Si el usuario ya está autenticado, redirigir al home
    if (Auth.isAuthenticated()) {
      this.$router.push('/')
    }
    
    // Cargar credenciales guardadas si existen
    this.loadSavedCredentials()
  },
  methods: {
    async handleLogin() {
      // Limpiar errores previos
      this.clearErrors()
      
      // Validar formulario
      if (!this.validateForm()) {
        return
      }
      
      this.isLoading = true
      
      try {
        // Intentar login
        const user = await Auth.login(this.credentials)
        
        // Guardar usuario
        Auth.saveUser(user)
        
        // Guardar credenciales si se seleccionó "recordar"
        if (this.rememberMe) {
          this.saveCredentials()
        } else {
          this.clearSavedCredentials()
        }
        
        // Mostrar mensaje de éxito
        this.loginSuccess = `¡Bienvenido ${user.name}! Redirigiendo...`
        
        // Emitir evento de login exitoso
        this.$root.$emit('user-login', user)
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          this.$router.push('/')
        }, 1500)
        
      } catch (error) {
        // Mostrar error de login
        this.loginError = error.message || 'Error al iniciar sesión. Intenta nuevamente.'
        console.error('Login error:', error)
      } finally {
        this.isLoading = false
      }
    },
    async handleRegister() {
      this.registerError = ''
      this.registerSuccess = ''
      // Validación básica
      if (!this.registerForm.name || !this.registerForm.email || !this.registerForm.password) {
        this.registerError = 'Todos los campos son obligatorios'
        return
      }
      if (!this.isValidEmail(this.registerForm.email)) {
        this.registerError = 'Correo electrónico inválido'
        return
      }
      if (this.registerForm.password.length < 3) {
        this.registerError = 'La contraseña debe tener al menos 3 caracteres'
        return
      }
      try {
        const resp = await Auth.register({
          name: this.registerForm.name,
          email: this.registerForm.email,
          password: this.registerForm.password
        })
        this.registerSuccess = 'Cuenta creada con éxito. Ya puedes iniciar sesión.'
        // Limpiar formulario
        this.registerForm = { name: '', email: '', password: '' }
        // Cerrar modal tras breve delay
        setTimeout(() => {
          const modalEl = document.getElementById('registerModal')
          if (modalEl) {
            const modal = window.bootstrap?.Modal ? window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl) : null
            modal?.hide()
          }
        }, 800)
      } catch (e) {
        this.registerError = e.message || 'Error al registrar'
      }
    },
    validateForm() {
      let isValid = true
      
      // Validar email
      if (!this.credentials.email) {
        this.errors.email = 'El correo electrónico es requerido'
        isValid = false
      } else if (!this.isValidEmail(this.credentials.email)) {
        this.errors.email = 'Ingresa un correo electrónico válido'
        isValid = false
      }
      
      // Validar password
      if (!this.credentials.password) {
        this.errors.password = 'La contraseña es requerida'
        isValid = false
      } else if (this.credentials.password.length < 3) {
        this.errors.password = 'La contraseña debe tener al menos 3 caracteres'
        isValid = false
      }
      
      return isValid
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    clearErrors() {
      this.errors = {}
      this.loginError = ''
      this.loginSuccess = ''
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    saveCredentials() {
      const credentialsToSave = {
        email: this.credentials.email,
        rememberMe: this.rememberMe
      }
      localStorage.setItem('nuvastore_saved_credentials', JSON.stringify(credentialsToSave))
    },
    loadSavedCredentials() {
      const saved = localStorage.getItem('nuvastore_saved_credentials')
      if (saved) {
        const credentials = JSON.parse(saved)
        this.credentials.email = credentials.email || ''
        this.rememberMe = credentials.rememberMe || false
      }
    },
    clearSavedCredentials() {
      localStorage.removeItem('nuvastore_saved_credentials')
    }
  },
  watch: {
    // Limpiar errores cuando el usuario empiece a escribir
    'credentials.email'() {
      if (this.errors.email) {
        delete this.errors.email
      }
      if (this.loginError) {
        this.loginError = ''
      }
    },
    'credentials.password'() {
      if (this.errors.password) {
        delete this.errors.password
      }
      if (this.loginError) {
        this.loginError = ''
      }
    }
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.login-container {
  max-width: 500px;
  padding: 2rem 1rem;
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.card-body {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.form-control {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  border-radius: 10px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.hero-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-group .btn {
  border-radius: 0 10px 10px 0;
  border: 2px solid #e9ecef;
  border-left: none;
}

.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.alert {
  border-radius: 10px;
  border: none;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .card-body {
    padding: 2rem !important;
  }
}

/* Animaciones */
.login-container {
  animation: fadeInUp 0.6s ease-out;
}

.hero-content {
  animation: fadeInRight 0.8s ease-out;
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Efectos hover para inputs */
.form-control:hover {
  border-color: #007bff;
}

.form-label {
  color: #495057;
  margin-bottom: 0.75rem;
}

/* Estilo para el botón de mostrar/ocultar contraseña */
.input-group .btn-outline-secondary {
  color: #6c757d;
  border-color: #e9ecef;
}

.input-group .btn-outline-secondary:hover {
  color: #007bff;
  border-color: #007bff;
  background-color: transparent;
}
</style>

<!-- Modal de Registro MOVED INTO TEMPLATE -->