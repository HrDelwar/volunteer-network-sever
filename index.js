const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vzza0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db(process.env.DB_NAME).collection("events");

  //add new event
  app.post('/addEvent', (req, res) => {
    const event = req.body;

    eventCollection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  //get all event
  app.get('/allEvents', (req, res) => {
    eventCollection.find({})
      .toArray((err, docs) => {
        res.send(docs)
      })
  })

  //delete event
  app.delete('/deleteEvent/:id', (req, res) => {
    const id = req.params.id;
    eventCollection.deleteOne({ _id: ObjectId(id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
      .catch(err => res.send(err))
  })
  // client.close()
});


app.get('/', (req, res) => {
  res.send(`${port} is working`);
})

app.listen(port);