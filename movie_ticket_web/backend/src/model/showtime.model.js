// models/showtime.model.js
const db = require("../../db");

class ShowTime {
  async getAllShowTimes() {
    try {
      const showTimes = await db("Show_time").select(
        "show_id",
        "movie_id",
        "theater_id",
        "show_date",
        "show_time"
      );
      return { showTimes };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Model
  async createShowTime(showTimeData) {
    try {
      const showTime = await db("Show_time")
        .insert(showTimeData)
        .returning("*");
      return showTime;
    } catch (error) {
      console.error("Error creating show time:", error);
      throw error;
    }
  }

  async findShowTimebyId(show_id) {
    try {
      const showTime = await db("Show_time").where({ show_id }).select("*");
      if (showTime.length === 0) {
        return null;
      }
      return showTime[0];
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  // Thêm phương thức tìm kiếm lịch chiếu theo movieId
  async findShowTimesByMovieId(movieId) {
    try {
      const showTimes = await db("Show_time as st")
        .join("Movie as m", "st.movie_id", "m.movie_id")
        .where({ "st.movie_id": movieId })
        .select("*");
      return { showTimes };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  async updateShowTime(show_id, updateData) {
    try {
      const updatedShowTime = await db("Show_time")
        .where({ show_id })
        .update(updateData)
        .returning("*");

      // Kiểm tra số lượng bản ghi được cập nhật
      if (updatedShowTime.length === 0) {
        return null; // Nếu không có bản ghi nào được cập nhật
      }

      return updatedShowTime[0]; // Trả về bản ghi được cập nhật
    } catch (error) {
      console.error("Error updating show time:", error);
      throw error;
    }
  }
  async deleteShowTime(show_id) {
    try {
      await db("Show_time").where({ show_id }).del();

      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting show time:", error);
      throw error;
    }
  }
}

module.exports = new ShowTime();
