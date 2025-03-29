// models/theater.model.js
const db = require("../../db");

class Theater {
  async getAllTheaters() {
    try {
      const theaters = await db("Theater").select(
        "theater_id",
        "theater_name",
        "location"
      );
      return { theaters };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createTheater(theaterData) {
    try {
      const theater = await db("Theater").insert(theaterData).returning("*");
      return theater;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findTheaterbyId(theater_id) {
    try {
      const theater = await db("Theater").where({ theater_id }).select("*");
      if (theater.length === 0) {
        return null;
      }
      return theater[0];
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

module.exports = new Theater();
