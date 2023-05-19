const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.0w2mrif.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toyDB").collection("toyos");

    app.post("/addtoy", async (req, res) => {
      const body = req.body;
      console.log(body);
      const result = await toyCollection.insertOne(body);
      res.send(result);
    });

    app.get("/alltoy", async (req, res) => {
      const result = await toyCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/getJobByCategory/:category", async (req, res) => {
      const category = req.params.category;
      if (category === "all") {
        const result = await toyCollection.find({}).toArray();
        return res.send(result);
      } else {
        const result = await toyCollection
          .find({ sub_category: category })
          .toArray();
       return res.send(result);
      }
    });


    app.get("/myCar/:email",async(req,res)=>{
        const result = await toyCollection.find({seller_email: req.params.email}).toArray();
        res.send(result)
    })

    app.get("/singleToy/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toyCollection.findOne(query)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Toy universe running");
});

app.listen(port, () => {
  console.log(`The Toy universe server is running ${port}`);
});
