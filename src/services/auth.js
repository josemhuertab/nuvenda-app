export class Auth {
  static async register({ name, email, password }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password || password.length < 3) {
          reject(new Error('Datos de registro inválidos.'))
          return
        }
        const usersStr = localStorage.getItem('nuvastore_users')
        const users = usersStr ? JSON.parse(usersStr) : []
        if (users.some(u => u.email === email)) {
          reject(new Error('El correo ya está registrado.'))
          return
        }
        const newUser = {
          id: Date.now(),
          name,
          email,
          password
        }
        users.push(newUser)
        localStorage.setItem('nuvastore_users', JSON.stringify(users))
        resolve({ success: true, user: { id: newUser.id, name, email } })
      }, 600)
    })
  }

  static async login(credentials) {
    const usersStr = localStorage.getItem('nuvastore_users')
    const users = usersStr ? JSON.parse(usersStr) : []
    const found = users.find(u => u.email === credentials.email && u.password === credentials.password)
    if (found) {
      return Promise.resolve({ id: found.id, name: found.name, email: found.email, token: 'local-token', loginTime: new Date().toISOString() })
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password } = credentials;
        
        if (email === 'usuario1@mitienda.com' && password === 'password') {
          const user = {
            id: 1,
            name: 'Usuario Demo',
            email: 'usuario1@mitienda.com',
            token: 'demo-jwt-token-12345',
            loginTime: new Date().toISOString()
          };
          resolve(user);
        } else {
          reject(new Error('Credenciales inválidas. Email o contraseña incorrectos.'));
        }
      }, 800);
    });
  }

  static logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Sesión cerrada exitosamente' });
      }, 300);
    });
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('nuvastore_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static saveUser(user) {
    localStorage.setItem('nuvastore_user', JSON.stringify(user));
  }

  static removeUser() {
    localStorage.removeItem('nuvastore_user');
  }

  static isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
}

export default Auth;