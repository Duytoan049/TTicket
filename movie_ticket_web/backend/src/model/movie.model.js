// models/movie.model.js
const db = require("../../db");

class Movie {
  async getAllMovie() {
    try {
      const movies = await db("Movie").select(
        "movie_id",
        "movie_name",
        "ticket_price"
      );
      return { movies };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createMovie(movieData) {
    try {
      const movie = await db("Movie").insert(movieData).returning("*");
      return movie;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateMovie(movie_id, movieData) {
    try {
      const movie = await db("Movie")
        .where({ movie_id })
        .update(movieData)
        .returning("*");
      return movie;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  }
  async findMoviebyId(movie_id) {
    try {
      const movie = await db("Movie").where({ movie_id }).select("*");
      if (movie.length === 0) {
        return null;
      }
      return movie[0];
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  async deleteMovie(movie_id) {
    try {
      const movie = await db("Movie").where({ movie_id }).del();
      return movie;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

module.exports = new Movie();
