const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: new Error("Email et mot de passe requis"),
    });
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({
        email,
        password: hash,
      });

      return user.save();
    })
    .then(() => {
      res.status(201).json({ message: "Utilisateur créé !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
