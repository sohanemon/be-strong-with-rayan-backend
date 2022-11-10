require("dotenv").config();
const jwt = require("jsonwebtoken");
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
const faqCollection = client.db("be-strong").collection("faqs");

// jwt verification
const verifyJWT = (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.status(401).send("Unauthorized access");
  jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    if (err) return res.status(401).send("Unauthorized access");
    req.email = data;
    next();
  });
};

try {
  app.post("/jwt", (req, res) => {
    const token = jwt.sign(req.headers.authorization, process.env.SECRET_KEY);
    res.send(token);
  });
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
  app.get("/review", verifyJWT, async (req, res) => {
    if (req.email != req.query.email)
      return res.status(401).send("Unauthorized access");
    const cursor = reviewCollection.find({ email: req.query.email });

    const result = await cursor
      .sort({ timestamp: parseInt(req.query.order) || -1 })
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
    res.send(result);
  });
  app.patch("/reviews/:review_id", async (req, res) => {
    const result = await reviewCollection.updateOne(
      { _id: ObjectId(req.params.review_id) },
      { $set: { message: req.body.message } }
    );

    res.send(result);
  });
  app.get("/faqs", async (req, res) => {
    const cursor = faqCollection.find({});
    const data = await cursor.toArray();
    res.send(data);
  });
} catch (error) {
  console.error("🚀 > error", error);
}
app.listen(port, () => console.info(`App listening on port ${port}!`));
