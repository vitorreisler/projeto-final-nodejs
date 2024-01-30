require("dotenv/config");
const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const initialData = require("./middlewere/initialData.mw");

const app = express();
const PORT = process.env.PORT || 3000; 
app.use(cors());
const db = process.env.MONGO_URI_ATLAS ? "Production" : "" || process.env.MONGO_URI ? "Development" : "" 
mongoose
  .connect(process.env.MONGO_URI_ATLAS || process.env.MONGO_URI)
  .then(console.log(`connected to db ${db}`))
  .then(
    app.listen(PORT, initialData.createUser(), initialData.createCard(), () =>
      console.log(`connected to port ${PORT}`)
    )
  )
  .catch((err) => console.log(`Could not connect to DB`, err.message));


app.use(morgan(":method :url :status :date - :response-time ms"));
app.use(express.json());

app.use("/api/users", require("./routes/users.routes"));
app.use("/api/cards", require("./routes/cards.routes"));
app.use("/static", express.static(path.resolve(__dirname, "./static")));

/*app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.resolve(__dirname, "./static/pageNotFound.html"));
});
*/
