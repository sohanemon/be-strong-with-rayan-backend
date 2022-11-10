require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId, Timestamp } = require("mongodb");
app.use(cors());
app.use(express.json());
const port = 5000;
const client = new MongoClient(process.env.URI);
const serviceCollection = client.db("be-strong").collection("services");
const reviewCollection = client.db("be-strong").collection("reviews");
try {
  app.get("/", (req, res) => {
    res.send("Be Strong with Rayan is running...");
  });
  app.get("/services", async (req, res) => {
    const cursor = serviceCollection.find({});
    const data = await cursor.limit(parseInt(req.query.limit) || 0).toArray();
    res.send(data);
  });
  app.post("/services", async (req, res) => {
    const result = await serviceCollection.insertOne(req.body);

    res.send(result);
  });
  app.get("/service/:id", async (req, res) => {
    const result = await serviceCollection.findOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });
  app.get("/review", async (req, res) => {
    const cursor = reviewCollection.find({ email: req.query.email });

    const result = await cursor
      .sort({ timestamp: parseInt(req.query.order) || 1 })
      .toArray();

    res.send(result);
  });
  app.post("/review", async (req, res) => {
    const result = await reviewCollection.insertOne({
      timestamp: new Timestamp(),
      ...req.body,
    });

    res.send(result);
  });
  app.get("/reviews/:service_id", async (req, res) => {
    const cursor = reviewCollection.find({
      service_id: req.params.service_id,
    });
    const result = await cursor.toArray();
    console.log("🚀 > app.get > result", result);
    res.send(result);
  });
} catch (error) {
  console.log("🚀 > error", error);
}
app.listen(port, () => console.log(`App listening on port ${port}!`));
