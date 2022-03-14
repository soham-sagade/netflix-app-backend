const mongoose = require("mongoose");
const Movie = require("../models/Movie");
module.exports = {
  //CREATE
  async createMovie(req, res) {
    if (req.user.isAdmin) {
      try {
        const newMovie = new Movie({ ...req.body });
        const movie = await newMovie.save();
        return res.status(200).send(movie);
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(403).send("Not Allowed!");
    }
  },

  async getMovie(req, res) {
    try {
      const movie = await Movie.findById(req.params.id);
      return res.status(200).send(movie);
    } catch (e) {
      return res.status(500).send(e);
    }
  },

  async getMovies(req, res) {
    try {
      const movies = await Movie.find({});
      return res.status(200).send(movies.reverse());
    } catch (e) {
      return res.status(500).send(e);
    }
  },

  async updateMovie(req, res) {
    if (req.user.isAdmin) {
      try {
        const movie = await Movie.findByIdAndUpdate(
          req.params.id,
          {
            $set: { ...req.body },
          },
          {
            new: true,
          }
        );

        return res.status(200).send(movie);
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(403).send("Not Allowed!");
    }
  },

  async deleteMovie(req, res) {
    if (req.user.isAdmin) {
      try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        return res.status(200).send(movie);
      } catch (e) {
        res.status(500).send(e);
      }
    } else {
      res.status(403).send("Not Allowed!");
    }
  },

  async getRandom(req, res) {
    const type = req.query.type;
    let content;
    try {
      if (type === "series") {
        content = await Movie.aggregate([
          {
            $match: { isSeries: true },
          },
          {
            $sample: { size: 1 },
          },
        ]);
      } else {
        content = await Movie.aggregate([
          {
            $match: { isSeries: false },
          },
          {
            $sample: { size: 1 },
          },
        ]);
      }
      return res.status(200).send(content);
    } catch (e) {
      return res.status(500).send(e);
    }
  },
};
