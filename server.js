const {
  syncAndSeed,
  models: { User, Car, Sale },
} = require("./db");

const path = require("path");
const express = require("express");
const app = express();

app.use("/dist", express.static(path.join(__dirname, "dist")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/api", require("./api"));

const init = async () => {
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
init();
