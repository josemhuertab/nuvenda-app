import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar Bootstrap CSS y JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Importar CSS personalizado para Bootstrap
import './assets/custom-bootstrap.css'

// Importar Font Awesome para iconos
import '@fortawesome/fontawesome-free/css/all.min.css'

// Crear la aplicación Vue
const app = createApp(App)

// Usar Vue Router
app.use(router)

// Configuración global para manejar errores
app.config.errorHandler = (err, vm, info) => {
  console.error('Error en la aplicación:', err)
  console.error('Información del error:', info)
}

// Propiedades globales
app.config.globalProperties.$appName = 'Nuvastore'
app.config.globalProperties.$appVersion = '1.0.0'

// Montar la aplicación
app.mount('#app')
