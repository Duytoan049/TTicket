const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ticketController = require("../controller/ticket.controller");
//Tạo vé mới
router.post("/ticket", ticketController.insertTicket);
//Lấy ghế bằng showID
router.get("/tickets", ticketController.getSeatByShowId);
//Lấy vé bằng userID
router.get("/ticket", ticketController.getSeatByUserId);
// Lấy tất cả vé bằng userID
router.get("/myticket", ticketController.getAllTicketByUserId);
module.exports = router;
