import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe requis",
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
      res.status(400).json({ message: error.message });
    });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email et mot de passe requis",
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Utilisateur non trouvé !",
        });
      }

      return bcrypt.compare(password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({
            message: "Mot de passe incorrect !",
          });
        }

        res.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          }),
        });
      });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};
