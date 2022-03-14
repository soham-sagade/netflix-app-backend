const mongoose = require("mongoose");
const User = require("../models/User");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
module.exports = {
  async register(req, res) {
    const newUser = new User({ ...req.body });
    try {
      const user = await newUser.save();
      const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );
      const { password, ...info } = user._doc;
      res.status(201).send({ ...info, accessToken });
    } catch (e) {
      res.status(500).send(e);
    }
  },

  async login(req, res) {
    const username = req.body.username || req.body.email;
    const user = await User.findOne({
      username,
    });
    try {
      if (!user) {
        return res.status(404).send("user not found!");
      }

      const password = cryptoJs.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(cryptoJs.enc.Utf8);

      if (password === req.body.password) {
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.SECRET_KEY,
          { expiresIn: "1 hour" }
        );
        const { password, ...info } = user._doc;
        return res.status(201).send({ ...info, accessToken });
      } else {
        return res.status(401).send();
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  },

  async update(req, res) {
    const user = req.user;
    if (user.id === req.params.id || req.user.isAdmin) {
      try {
        const newUser = await User.findByIdAndUpdate(user.id, {
          $set: req.body,
        });
        await newUser.save();
        return res.status(200).send("successfully updated!");
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(403).send("Not allowed!");
    }
  },

  async delete(req, res) {
    const user = req.user;
    if (user.id === req.params.id || req.user.isAdmin) {
      try {
        const newUser = await User.findByIdAndDelete(user.id);
        return res.status(200).send("successfully deleted!");
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(403).send("Not allowed!");
    }
  },

  async getUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...info } = user._doc;
      return res.status(200).send(info);
    } catch (e) {
      res.status(500).send(e);
    }
  },

  async getUsers(req, res) {
    if (req.user.isAdmin) {
      const query = req.query.new;
      try {
        const users = query
          ? await User.find({}).sort({ _id: 1 }).limit(5)
          : await User.find({});
        return res.status(200).send(users);
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(403).send("Not Allowed!");
    }
  },

  async stats(req, res) {
    const date = new Date();
    const lastYear = date.setFullYear(date.setFullYear() - 1);
    const arr = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: {
              $month: "$createdAt",
            },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      return res.status(200).send(data);
    } catch (e) {
      res.status(500).send(e);
    }
  },
};
