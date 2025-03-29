const express = require("express");
const router = express.Router();
const MovieController = require("../controller/movie.controller");

router.get("/movies", MovieController.getAllMovie);
router.post("/movies", MovieController.createMovie);
router.get("/movies/:movie_id", MovieController.findMoviebyId);
router.delete("/movies/:movie_id", MovieController.deleteMovie);
router.put("/movies/:movie_id", MovieController.updateMovie);
module.exports = router;
