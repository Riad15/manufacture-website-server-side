const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { get } = require('express/lib/response');
const app = express()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());
// useername: Computer-Accessories
// pas: 5ofXvFglXI7XWVsm

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jex3yne.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const allProducts = client.db('computer_accessories').collection('Products');
        const myProducts = client.db('computer_accessories').collection('my-products');

        // find all products from allProducts
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = allProducts.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });

        // find one products 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await allProducts.findOne(query);
            res.send(product);
        });

        // insert one for add to card data
        app.put('/my-product', async (req, res) => {
            const addToCartProduct = req.body;

            const result = await myProducts.insertOne(addToCartProduct);
            res.send(result);
        })

        // find all products from myProducts
        app.get('/my-products', async (req, res) => {
            const query = {};
            const cursor = myProducts.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });

        // delete a item from myProducts
        app.delete('/my-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myProducts.deleteOne(query);
            res.send(result);

        })



    } finally {

    }

} run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})