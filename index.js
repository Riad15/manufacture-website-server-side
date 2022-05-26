const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

// app.use(express.static("public"));
// app.use(express.json());

// const calculateOrderAmount = (items) => {
//     // Replace this constant with a calculation of the order's amount
//     // Calculate the order total on the server to prevent
//     // people from directly manipulating the amount on the client
//     return 1400;
// };

// app.post("/create-payment-intent", async (req, res) => {
//     const { items } = req.body;

//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: calculateOrderAmount(items),
//         currency: "eur",
//         automatic_payment_methods: {
//             enabled: true,
//         },
//     });

//     res.send({
//         clientSecret: paymentIntent.client_secret,
//     });
// });

// app.listen(4242, () => console.log("Node server listening on port 4242!"));
// const { get } = require('express/lib/response');
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

        });

        // payment methode server site

        app.post('/create-payment-intent', async (req, res) => {
            const myItem = req.body;
            const price = myItem.price;
            const amount = price * 100;

            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ['card']
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });

        });

        // find a item from myProducts
        app.get('/my-products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myProducts.findOne(query);
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