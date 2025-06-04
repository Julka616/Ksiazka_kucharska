const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Połączono z MongoDB"))
  .catch((err) => console.error(" Błąd MongoDB:", err));

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/recipes", require("./routes/recipes"));


// TEST ROUTE
app.get("/", (req, res) => {
  res.send(" Serwer działa!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Serwer działa na porcie ${PORT}`));
