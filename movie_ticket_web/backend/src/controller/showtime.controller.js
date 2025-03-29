const showtimeModel = require("../model/showtime.model");
const jsend = require("jsend");

const ShowTimeController = {
  getAllShowTimes: async (req, res) => {
    try {
      const { showTimes } = await showtimeModel.getAllShowTimes();
      return res.json(jsend.success({ showTimes }));
    } catch (error) {
      console.log(error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  // Thêm phương thức để lấy lịch chiếu theo movieId
  getShowtimesByMovieId: async (req, res) => {
    const { movieId } = req.query;

    if (!movieId) {
      return res
        .status(400)
        .json(jsend.error({ message: "movieId is required" }));
    }

    try {
      const { showTimes } = await showtimeModel.findShowTimesByMovieId(movieId);
      return res.json(jsend.success({ showTimes }));
    } catch (error) {
      console.log("Error fetching showtimes:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  // Controller
  insertShowtimeByIdTheater: async (req, res) => {
    try {
      const showTimes = await showtimeModel.createShowTime(req.body);
      return res.json(jsend.success({ showTimes }));
    } catch (error) {
      console.error("Error showtimes:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  updateShowTimeById: async (req, res) => {
    try {
      const { show_id } = req.params;
      await showtimeModel.updateShowTime(show_id, req.body);
      return res.json(
        jsend.success({ message: "Showtime updated successfully" })
      );
    } catch (error) {
      console.error("Error updating showtime:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  deleteShowTimeById: async (req, res) => {
    try {
      const { show_id } = req.params;
      await showtimeModel.deleteShowTime(show_id);
      return res.json(
        jsend.success({ message: "Showtime deleted successfully" })
      );
    } catch (error) {
      console.error("Error deleting showtime:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
};

module.exports = ShowTimeController;
