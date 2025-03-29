const express = require("express");
const cors = require("cors");
const userRouter = require("./router/user.router");
const movieRouter = require("./router/movie.router");
const theaterRouter = require("./router/theater.router");
const showtimeRouter = require("./router/showtime.router");
const ticketRouter = require("./router/ticket.router");
const paymentRouter = require("./router/payment.router");
require("dotenv").config();
const session = require("express-session");
const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Địa chỉ frontend
    credentials: true, // Cho phép gửi cookie
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình session trước các route
app.use(
  session({
    secret: "mySuperSecretKey12345",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Để true nếu dùng HTTPS
      httpOnly: true,
      sameSite: "strict", // Ngăn trình duyệt chặn cookie
      maxAge: 24 * 60 * 60 * 1000, // Giữ session 24h
    }, // Chỉ bật secure khi dùng HTTPS
  })
);

app.use("/api", userRouter);
app.use("/api", movieRouter);
app.use("/api", theaterRouter);
app.use("/api", showtimeRouter);
app.use("/api", ticketRouter);
app.use("/api", paymentRouter);

app.get("/", (req, res) => {
  return res.json({
    message: "ok",
  });
});

module.exports = app;
