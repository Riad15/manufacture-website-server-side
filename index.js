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

        // find all products
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


    } finally {

    }

} run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})