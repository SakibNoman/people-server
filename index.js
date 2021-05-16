const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()



const app = express()
const port = 5000

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqpfg.mongodb.net/peoples?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("peoples").collection("peopleList");
    app.post('/addPeople', (req, res) => {
        const people = req.body;
        collection.insertOne(people)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/peoples', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/deletePeople/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        collection.findOneAndDelete({ _id: id })
            .then(res => res.json())
            .then(data => console.log("successfully deleted"))
    })

});


app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})