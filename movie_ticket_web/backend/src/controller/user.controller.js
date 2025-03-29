const userModel = require("../model/user.model");
const jsend = require("jsend");
const bcrypt = require("bcryptjs");
const userController = {
  // Lấy tất cả người dùng
  getAllUsers: async (req, res) => {
    try {
      const { totalrecords, users } = await userModel.getAllUsers();
      return res.json(jsend.success({ totalrecords, users }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  // Tạo người dùng mới
  createUser: async (req, res) => {
    try {
      const newUser = await userModel.createUser(req.body);
      return res.status(201).json(jsend.success(newUser));
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      await userModel.updateUser(user_id, req.body);
      return res.json(jsend.success({ message: "User updated successfully" }));
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  // Xóa người dùng
  deleteUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      await userModel.deleteUser(user_id);
      return res.json(jsend.success({ message: "User deleted successfully" }));
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json(jsend.error({ message: error.message }));
    }
  },

  //Đăng nhập người dùng
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // So sánh mật khẩu
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Thiết lập session sau khi đăng nhập thành công
      req.session.user = {
        userId: user.user_id,
        role: user.role,
        email: user.email,
        userName: user.user_name,
        name: user.name,
        phone: user.phone,
        password: user.password,
      };
      return res.json({
        message: "Login successfully!",
        user: {
          userId: user.user_id,
          role: user.role,
          email: user.email,
          userName: user.user_name,
          name: user.name,
          phone: user.phone,
          password: user.password,
        },
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
