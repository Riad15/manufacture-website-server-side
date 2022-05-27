const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const stripe = require("stripe")(process.env.STRIPE_KEY);


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
function verifyJWT(req, res, next) {
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}
async function run() {
    try {
        await client.connect();
        const allProducts = client.db('computer_accessories').collection('Products');
        const myProducts = client.db('computer_accessories').collection('my-products');
        const allUsers = client.db('computer_accessories').collection('users');

        // find all products from allProducts
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = allProducts.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });

        // update user information
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await allUsers.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '20h' })
            res.send({ result, token });

        })


        // find one products 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await allProducts.findOne(query);
            res.send(product);
        });

        // insert one for add to card data
        app.put('/my-products', async (req, res) => {
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
            const price = myItem.total_price;
            const amount = parseFloat(price) * 100;

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