const ticketModel = require("../model/ticket.model");
const jsend = require("jsend");

const ticketController = {
  insertTicket: async (req, res) => {
    try {
      const { ticket } = await ticketModel.createTicket(req.body);
      return res.json(jsend.success({ ticket }));
    } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  getSeatByShowId: async (req, res) => {
    const { showid } = req.query;
    if (!showid) {
      return res
        .status(400)
        .json(jsend.error({ message: "showid is required" }));
    }

    try {
      const seats = await ticketModel.findSeatByShowId(showid); // Gọi hàm tìm ghế
      return res.json(jsend.success({ seats })); // Trả về danh sách ghế
    } catch (error) {
      console.error("Error fetching showtimes:", error); // Sử dụng console.error để in lỗi
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  getSeatByUserId: async (req, res) => {
    const { userid } = req.query;
    if (!userid) {
      return res
        .status(400)
        .json(jsend.error({ message: "userid is required" }));
    }

    try {
      const ticket = await ticketModel.findTicketByUserId(userid);
      return res.json(jsend.success({ ticket }));
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
  getAllTicketByUserId: async (req, res) => {
    const { userid } = req.query;
    if (!userid) {
      return res
        .status(400)
        .json(jsend.error({ message: "userid is required" }));
    }

    try {
      const tickets = await ticketModel.getAllTicketByUserId(userid);
      return res.json(jsend.success({ tickets }));
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },
};

module.exports = ticketController;
