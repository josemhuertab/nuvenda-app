export class API {
  static async all() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = [
          {
            id: 1,
            name: "Smartphone Samsung Galaxy S24",
            price: 899.99,
            stock: 15,
            image: "https://placehold.co/600x400?text=Samsung+S24&font=Montserrat",
            description: "Último modelo de Samsung con cámara de 200MP"
          },
          {
            id: 2,
            name: "Laptop Dell XPS 13",
            price: 1299.99,
            stock: 8,
            image: "https://placehold.co/600x400?text=Dell+XPS+13&font=Montserrat",
            description: "Laptop ultradelgada con procesador Intel i7"
          },
          {
            id: 3,
            name: "Auriculares Sony WH-1000XM5",
            price: 399.99,
            stock: 25,
            image: "https://placehold.co/600x400?text=Sony+WH-1000XM5&font=Montserrat",
            description: "Auriculares con cancelación de ruido premium"
          },
          {
            id: 4,
            name: "Tablet iPad Air",
            price: 599.99,
            stock: 12,
            image: "https://placehold.co/600x400?text=iPad+Air&font=Montserrat",
            description: "Tablet Apple con chip M1 y pantalla Liquid Retina"
          },
          {
            id: 5,
            name: "Smartwatch Apple Watch Series 9",
            price: 429.99,
            stock: 20,
            image: "https://placehold.co/600x400?text=Apple+Watch+S9&font=Montserrat",
            description: "Reloj inteligente con GPS y monitoreo de salud"
          },
          {
            id: 6,
            name: "Cámara Canon EOS R6",
            price: 2499.99,
            stock: 5,
            image: "https://placehold.co/600x400?text=Canon+EOS+R6&font=Montserrat",
            description: "Cámara mirrorless profesional de 20MP"
          },
          {
            id: 7,
            name: "Teclado Mecánico Logitech MX",
            price: 149.99,
            stock: 30,
            image: "https://placehold.co/600x400?text=Logitech+MX&font=Montserrat",
            description: "Teclado mecánico inalámbrico para productividad"
          },
          {
            id: 8,
            name: "Monitor LG UltraWide 34\"",
            price: 799.99,
            stock: 7,
            image: "https://placehold.co/600x400?text=LG+UltraWide&font=Montserrat",
            description: "Monitor curvo ultrawide 4K para gaming y trabajo"
          },
          {
            id: 9,
            name: "Consola PlayStation 5",
            price: 499.99,
            stock: 3,
            image: "https://placehold.co/600x400?text=PlayStation+5&font=Montserrat",
            description: "Consola de videojuegos de última generación"
          },
          {
            id: 10,
            name: "Altavoz Bluetooth JBL Charge 5",
            price: 179.99,
            stock: 18,
            image: "https://placehold.co/600x400?text=JBL+Charge+5&font=Montserrat",
            description: "Altavoz portátil resistente al agua con 20h de batería"
          }
        ];
        resolve(products);
      }, 1000);
    });
  }
}

export default API;