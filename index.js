const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kxul6c6.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('resaleProducts').collection('categories');
        const productsCollection = client.db('resaleProducts').collection('products')
        const usersCollection = client.db('resaleProducts').collection('users')
        const ordersCollection = client.db('resaleProducts').collection('orders')

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = categoriesCollection.findOne(query);
            res.send(result)
        });

        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        });

        app.patch('/products/:email', async (req, res) => {
            const email = req.params.email;
            const updateDoc = {
                $set: {
                    isVerified: true
                }
            }
            const result = await productsCollection.updateMany({ email: email }, updateDoc, true);
            res.send(result)
        })
        app.get('/products/:email', async (req, res) => {
            const query = {};
            const result = await productsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        });

        app.get('/myorders/:id', async (req, res) => {
            const email = req.params.id;
            const query = { email: email };
            const result = await ordersCollection.find(query).toArray();
            res.send(result)
        })

        app.delete('/products/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result)

        });


        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    isAdvertise: true
                }
            }
            const result = await productsCollection.updateOne(query, updateDoc);
            res.send(result)
        })

        app.get('/products/:categoryName', async (req, res) => {
            const category = req.params.categoryName;
            const separateCategory = category.split(' ')[0]
            const query = { category: separateCategory };
            const result = await productsCollection.find(query).toArray();
            console.log(result);
            res.send(result)
        })
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollection.insertOne(products)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users)
            res.send(result)
        });

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find({}).toArray()
            res.send(result);
        })
        app.get('/users/:email', async (req, res) => {
            const result = await usersCollection.findOne({ email: req.params.email })
            res.send(result);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = usersCollection.deleteOne(query);
            res.send(result)
        });

    }
    finally {

    }
}

run().catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Used resale products server is running')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})