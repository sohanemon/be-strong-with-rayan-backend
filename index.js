require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
app.use(cors());
app.use(express.json());
const port = 5000;
const client = new MongoClient(process.env.URI);
const serviceCollection = client.db("be-strong").collection("services");
try {
  app.get("/", (req, res) => {
    res.send("Be Strong with Rayan is running...");
  });
  app.post("/services", async (req, res) => {
    const result = await serviceCollection.insertOne(req.body);
    res.send(result);
  });
} catch (error) {
  console.log("🚀 > error", error);
}

app.listen(port, () => console.log(`App listening on port ${port}!`));
