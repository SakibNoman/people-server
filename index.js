const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
const jwt = require('jsonwebtoken')



const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqpfg.mongodb.net/peoples?retryWrites=true&w=majority`;

//mongodb client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//db connect
client.connect(err => {

    //db collection
    const collection = client.db("peoples").collection("peopleList");

    //middleware that verifying jwt token
    const verifyJWT = (req, res, next) => {
        const token = req.headers["x-access-token"]

        if (!token) {
            res.send("You have not a token")
        }
        else {
            jwt.verify(token, "jwtSecret", (err, decoded) => {
                if (err) {
                    res.json({ auth: false, message: "failed" })
                }
                else {
                    req.userId = decoded.id;
                    next();
                }
            })
        }
    }

    //api to add people in db
    app.post('/addPeople', verifyJWT, (req, res) => {
        const people = req.body;
        collection.insertOne(people)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //api to find all peoples
    app.get('/peoples', verifyJWT, (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    //api to delete specific people
    app.delete('/deletePeople/:id', verifyJWT, (req, res) => {
        const id = ObjectID(req.params.id);
        collection.findOneAndDelete({ _id: id })
            .then(res => res.json())
            .then(data => console.log("successfully deleted"))
    })

    //api to login
    app.post('/login', (req, res) => {
        const data = req.body;
        if (data.email === 'admin@namasys.co' && data.password === 'admin123') {
            const id = 12345;
            const token = jwt.sign({ id }, "jwtSecret", {
                expiresIn: 300
            })
            res.json({ auth: true, email: 'admin@namasys.co', token: token })
        }
        else {
            res.send({ auth: false })
        }
    })

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})