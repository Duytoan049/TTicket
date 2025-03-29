const express = require("express");
const router = express.Router();
const ShowTimeController = require("../controller/showtime.controller");

router.get("/showtimes", ShowTimeController.getShowtimesByMovieId);
router.post("/showtimes", ShowTimeController.insertShowtimeByIdTheater);
router.put("/showtime/:show_id", ShowTimeController.updateShowTimeById);
router.delete("/showtime/:show_id", ShowTimeController.deleteShowTimeById);
module.exports = router;