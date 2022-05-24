const express = require('express');
const cors = require('cors');
const { get } = require('express/lib/response');
const app = express()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());
// useername: Computer-Accessories
// pas: 5ofXvFglXI7XWVsm

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Computer-Accessories:5ofXvFglXI7XWVsm@cluster0.jex3yne.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const allProducts = client.db('computer_accessories').collection('Products');
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = allProducts.find(query);
            const products = await cursor.toArray();
            res.send(products);

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