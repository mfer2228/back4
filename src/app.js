const { Server } = require('socket.io');
const handlebars = require("express-handlebars");
const express = require('express');


const ProductsManager = require("./managers/products");

const app = express();

const productsManager = new ProductsManager();
const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Corriendo en el ${server.address().port}`);
});
server.on("error", error => console.log(`Server error: ${error}`));

const socketServer = new Server(server);

app.get("/", async (req, res) => {
    const id = req.params.id;
    const limit = req.query.limit;
    try {
        if (!!id) {
            res.send(await productsManager.getProductById(id));
        } else {
            return res.render("home", { products: await productsManager.getAllProducts(limit) });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: -1, description: "Error fetching products" });
    }
});

app.get("/realtimeproducts", async (req, res) => {
    return res.render("realtimeproducts");
});

socketServer.on('connection', (socket) => {
    console.log('User connected');
  
    socket.on('new-product', async (product) => {
        console.log('New product:', product);
        await productsManager.saveProduct(product);
        socket.emit('new-product-list', await productsManager.getAllProducts());
    });
  
    socket.on('delete-product', (productId) => {
        console.log('Delete product:', productId);
    });
  
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.engine("hbs", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(express.static('public'));

// app.use('/static', express.static(__dirname + '/public'));
app.use(express.json());
