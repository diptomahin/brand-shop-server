const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port= process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//techFusion
//kpek3YLrWYiQDJlb


const uri = "mongodb+srv://techFusion:kpek3YLrWYiQDJlb@cluster0.pwyhut1.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);

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
    // await client.connect();

    
    const productCollection = client.db('productDB').collection('productCollection');

    app.get('/products', async (req, res) => {
      const cursor =  productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await productCollection.findOne(query);
    res.send(result);
})

  app.post("/products", async (req, res) => {
    const product = req.body;
    console.log("product", product);
    const result = await productCollection.insertOne(product);
    console.log(result);
    res.send(result);
  });


  app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updated = req.body;

    const product = {
        $set: {
            name: updated.name,
            quantity: updated.quantity,
            supplier: updated.supplier,
            taste: updated.taste,
            category: updated.category,
            details: updated.details,
            photo: updated.photo
        }
    }

    const result = await productCollection.updateOne(filter, product, options);
    res.send(result);
})


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running')
})


app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})