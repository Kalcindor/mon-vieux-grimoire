const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://ka_user:nlzzeLHp5QAbSEtA@clusterkal.jyeeufm.mongodb.net/?appName=ClusterKal"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée :", error));

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRoutes);

app.use((req, res) => {
  res.json({ message: "Server response" });
});

module.exports = app;
