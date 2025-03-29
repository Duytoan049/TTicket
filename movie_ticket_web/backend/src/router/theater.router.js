const express = require("express");
const router = express.Router();
const TheaterController = require("../controller/theater.controller");

router.get("/theaters", TheaterController.getAllTheaters);
// Thêm các route khác...

module.exports = router;
