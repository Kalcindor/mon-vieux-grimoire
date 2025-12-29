const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const cors = require("cors");
const path = require("path");

mongoose
  .connect(
    "mongodb+srv://ka_user:nlzzeLHp5QAbSEtA@clusterkal.jyeeufm.mongodb.net/?appName=ClusterKal"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée :", error));

app.use(express.json());
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

app.use((req, res) => {
  res.json({ message: "Server response" });
});

module.exports = app;
