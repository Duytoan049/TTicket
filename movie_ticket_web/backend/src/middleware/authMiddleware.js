const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    // Nếu người dùng đã đăng nhập, tiếp tục xử lý yêu cầu
    next();
  } else {
    // Nếu người dùng chưa đăng nhập, trả về thông báo và mã lỗi 401
    res.status(401).json({
      message: "Unauthorized, please log in first.",
    });
  }
};

module.exports = authMiddleware;
