const db = require("../../db");

class UserModel {
  // Lấy tất cả người dùng
  async getAllUsers() {
    try {
      const [totalrecordsResult] = await db("User").count("user_id as count");
      const totalrecords = totalrecordsResult.count;

      const users = await db("User").select(
        "user_id",
        "user_name",
        "name",
        "email",
        "phone",
        "role"
      );

      return { totalrecords, users };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  // Tạo người dùng mới
  async createUser(userData) {
    try {
      const [newUser] = await db("User")
        .insert(userData)
        .returning(["user_id", "user_name", "email", "phone", "role"]);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Cập nhật thông tin người dùng
  async updateUser(user_id, userData) {
    try {
      await db("User").where({ user_id }).update(userData);
      return { message: "User updated successfully" };
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Xóa người dùng
  async deleteUser(user_id) {
    try {
      await db("User").where({ user_id }).del();
      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  //Tìm người dùng bằng email
  async findUserByEmail(email) {
    try {
      const user = await db("User")
        .where({ email })
        .select(
          "user_id",
          "user_name",
          "name",
          "email",
          "phone",
          "role",
          "password"
        );
      if (user.length === 0) {
        console.log("User not found");
        return null;
      }

      return user[0];
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
}

module.exports = new UserModel();
