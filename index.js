const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("Be Strong with Rayan is running...");
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
