const movieModel = require("../model/movie.model");
const jsend = require("jsend");

const MovieController = {
  // Lấy tất cả phim từ db
  getAllMovie: async (req, res) => {
    try {
      const { movies } = await movieModel.getAllMovie();
      return res.json(jsend.success({ movies }));
    } catch (error) {
      console.log(error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  // Tạo mới phim
  createMovie: async (req, res) => {
    try {
      const { movies } = await movieModel.createMovie(req.body);
      return res.json(jsend.success({ movies }));
    } catch (error) {
      console.error("Error creating movie:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  updateMovie: async (req, res) => {
    try {
      const { movie_id } = req.params;
      const { movies } = await movieModel.updateMovie(movie_id, req.body);
      return res.json(jsend.success({ movies }));
    } catch (error) {
      console.error("Error updating movie:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  // Tìm phim theo ID
  findMoviebyId: async (req, res) => {
    try {
      const { movie_id } = req.params;
      const movieData = await movieModel.findMoviebyId(movie_id);
      if (!movieData) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.json(jsend.success({ movieData }));
    } catch (error) {
      console.error("Error fetching movie:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const { movie_id } = req.params;
      const movieData = await movieModel.deleteMovie(movie_id);
      if (!movieData) {
        return res.status(404).json({ message: "Movie not found" });
      }
      return res.json(jsend.success({ movieData }));
    } catch (error) {
      console.error("Error deleting movie:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
};

module.exports = MovieController;
