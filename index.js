const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
//configure midleware cors
app.use(cors());
app.use(express.json());
//connect to db
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvy8c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('tour_serviceDb');
        const servicesCollection = database.collection('servicesList');
        //GET APi to get data
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
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
