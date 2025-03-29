const express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/authMiddleware");
const jsend = require("jsend");
const router = express.Router();

// Route để lấy tất cả người dùng (yêu cầu đã đăng nhập)
router.get("/users", userController.getAllUsers);

// Route để tạo người dùng mới (không cần kiểm tra đăng nhập)
router.post("/register", userController.createUser);

// Route để cập nhật thông tin người dùng (yêu cầu đã đăng nhập)
router.put("/users/:user_id", userController.updateUser);

// Route để xóa người dùng (yêu cầu đã đăng nhập)
router.delete("/users/:user_id", userController.deleteUser);
// Route để đăng nhập (không cần kiểm tra đăng nhập)
router.post("/login", userController.loginUser);

router.get("/current_user", authMiddleware, (req, res) => {
  return res.json(jsend.success({ user: req.session.user }));
});

// Route để đăng xuất
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.clearCookie("connect.sid"); // Xóa cookie phiên
    return res.json({ message: "Logged out successfully" });
  });
});
module.exports = router;
