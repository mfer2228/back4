const fs = require("fs");
const { title } = require("process");

class ProductManager {
  productsFilePath = "src/db/products.json";

  constructor(id, title, description, code, thumbnails, price, category, stock) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.code = code;
      this.price = price;
      this.thumbnails = thumbnails;
      this.category = category;
      this.stock = stock;
  }

  async getProductById(id) {
    try {
        const products = await this.getAllProducts();
        const product = products.find((product) => product.id == id);
        return product || null;
    } catch (error) {
        console.log(error);
        alert(error);
        throw new Error("Esa id no da producto");
        
    }
}

async getAllProducts(limit = null) {
    try {
        let fileContent = await fs.promises.readFile(this.productsFilePath, "utf8");
        let products = JSON.parse(fileContent);
        if (limit) {
            products = products.slice(0, limit);
        }
        return products;
    } catch (error) {
        console.log(error);
        alert (error)
        throw new Error("Error obteniendo los productos");
    }
}

async saveProduct(newProduct) {
    try {
        // Verificar que se envíen todos los parámetros del producto
        const requiredParams = ["title", "description", "code", "price", "stock"];
        const missingParams = requiredParams.filter(param => !(param in newProduct));
        if (missingParams.length > 0) {
          let errorr=  new Error(`Faltan parámetros obligatorios: ${missingParams.join(", ")}`);
          alert(errorr)   
          throw new errorr     
        }

        let products = await this.getAllProducts();
        // Verificar si ya existe un producto con el mismo código
        const existingProductIndex = products.findIndex((product) => product.code === newProduct.code);
        if (existingProductIndex !== -1) {
            alert(Error);
            throw new Error(`Ya existe un producto con el código ${newProduct.code}`);
         
    }
        // Generar un nuevo ID
        const lastId = products.length > 0 ? products[products.length - 1].id : 0;
        newProduct.id = lastId + 1;
        // Agregar el nuevo producto a la lista
        products.push(newProduct);
        // Guardar la lista actualizada en el archivo JSON
        await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
        return newProduct;
    } catch (error) {
        console.log(error);
        alert(error);
        throw new Error("Error al guardar el producto");
    }
}

  async deleteProductById(id) {
      try {
          let fileContent = await fs.promises.readFile(this.productsFilePath, "utf8");
          if (fileContent != "") {
              let products = JSON.parse(fileContent);
              const index = products.findIndex((product) => product.id == id);
              if (index != -1) {
                  products.splice(index, 1);
                  await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
                  return 1;
              } else {
                  throw new Error(`No se encontró ningún producto con el ID ${id}`);
              }
          }
      } catch (error) {
          console.log(`Error al borrar el producto con ID ${id}: ${error}`);
          alert(error);
          throw new Error("Error al borrar el producto");
      }
  }

  async updateProductById(id, updatedProductData) {
      try {
          let fileContent = await fs.promises.readFile(this.productsFilePath, "utf8");
          if (fileContent != "") {
              let products = JSON.parse(fileContent);
              const index = products.findIndex((product) => product.id == id);
              if (index != -1) {
                  products[index] = { ...products[index], ...updatedProductData };
                  await fs.promises.writeFile(this.productsFilePath, JSON.stringify(products, null, 2));
                  return products[index];
              } else {
                  alert(error);
                  throw new Error(`No se encontró ningún producto con el ID ${id}`);
              }
          }
      } catch (error) {
          console.log(error);
          alert(error);
          throw new Error("Error al actualizar el producto");
      }
  }
}
module.exports= ProductManager