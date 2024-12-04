const express = require('express')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 3000;

// Middleware configuration

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eywn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   
    const movieCollection = client.db("movies").collection("movies");


    /// get data functionality and showing data in UI---------

    app.get('/movie', async(req, res) => {
      const movies = await movieCollection.find().toArray();
      res.send(movies);
    })
    /// get data SingleData functionality and showing data in UI---------

    app.get('/details/:id', async(req, res) => {
      const movie = await movieCollection.findOne({ _id: new ObjectId(req.params.id) });
      console.log(movie);
      
      res.send(movie);
    })

    /// delete single movie in database and UI-------------
    app.delete('/delete/:id', async(req, res) => {
      const result = await movieCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    })
   
    // Create a database and  collection my info and stored data-----------------

    app.post('/movie', async(req, res) => {
      const movie = req.body;
      console.log(movie);
      const result = await movieCollection.insertOne(movie);
      res.send(result);
    })

    /// Update Movie data in database and UI 
    app.put('/updatemovie/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true };
      const updateMovie = req.body;
      const updated = {
        $set: {
          photo: updateMovie.photo,
          title: updateMovie.title,
          genre: updateMovie.genre,
          duration: updateMovie.duration,
          year: updateMovie.year,
          ratting: updateMovie.ratting
        }
      }
      const result = await movieCollection.updateOne(filter, updated, options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})