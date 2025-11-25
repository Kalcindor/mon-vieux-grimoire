const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ error: "Couple email/mot de passe incorrect" });
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  res.json({ message: "Login fonctionnera bientôt !" });
};
