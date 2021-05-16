const express = require('express')
const MongoClient = require('mongodb').MongoClient;



const app = express()
const port = 5000

// username = peopleuser
// pass = peopleuser123

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const uri = "mongodb+srv://peopleuser:peopleuser123@cluster0.cqpfg.mongodb.net/peoples?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("peoples").collection("peopleList");
    // perform actions on the collection object
    console.log("Success");
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})