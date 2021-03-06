const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

//configure midleware cors
app.use(cors());
app.use(express.json());
//single data loading by objectId
const ObjectId = require('mongodb').ObjectId;
//connect to db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvy8c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('tour_serviceDb');
        const servicesCollection = database.collection('servicesList');
        //colection for insert place order data
        const orderCollection = database.collection('orderList');



        //GET APi to get data
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });


        //API for post service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });



        //API for single data load
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);
            res.json(service);
        });


        //API for getting all order list data
        app.get('/orderlist', async (req, res) => {
            const cursor = orderCollection.find({});
            const allOrder = await cursor.toArray();
            res.send(allOrder)
        });


        //API for submit place order
        app.post('/orderlist', async (req, res) => {
            const order = req.body;

            const result = await orderCollection.insertOne(order)
            console.log('hiot', order)
            res.json(result)
        });
        //API for delete a order
        app.delete('/orderlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        });

        //API for update status approve or pending 
        app.put('/orderlist/:id', async (req, res) => {
            const id = req.params.id;
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            console.log(id);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateOrder.status,
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        });




        console.log('db connected');
    } finally {

        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
