const db = require("../../db");

class Ticket {
  async createTicket(ticketDataArray) {
    try {
      // Sử dụng db.insert và truyền vào mảng các đối tượng ticketData
      const tickets = await db("Ticket").insert(ticketDataArray).returning("*");
      return tickets;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findSeatByShowId(showid) {
    try {
      const tickets = await db("Ticket").where({ show_id: showid }).select("*");
      return tickets;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findTicketByUserId(userid) {
    try {
      const tickets = await db("Ticket").where({ user_id: userid }).select("*");
      return tickets;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAllTicketByUserId(userid) {
    try {
      const tickets = await db("Ticket as t")
        .join("Show_time as st", "t.show_id", "st.show_id")
        .join("Movie as m", "st.movie_id", "m.movie_id")
        .join("Theater as th", "st.theater_id", "th.theater_id")
        .select(
          "t.ticket_id",
          "t.seat_number",
          "t.price",
          "t.purchase_date",
          "m.movie_name",
          "m.poster_path",
          "st.show_date",
          "st.show_time",
          "th.theater_name",
          "th.location"
        )
        .where({ "t.user_id": userid });
      return tickets;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
module.exports = new Ticket();
