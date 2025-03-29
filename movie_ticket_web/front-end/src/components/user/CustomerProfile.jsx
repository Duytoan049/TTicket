import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [changepw, setChangepw] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/current_user",
          {
            withCredentials: true,
          }
        );
        if (response.data.status === "success") {
          setUser(response.data.data.user);
          setName(response.data.data.user.name || "");
          setPhone(response.data.data.user.phone || "");

          // Kiểm tra vai trò người dùng
          if (response.data.data.user.role === "admin") {
            navigate("/admin/dashboard");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      phone,
      ...(changepw && { password }),
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${id}`,
        updatedData,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 || response.status === 201) {
        // Hiển thị thông báo thành công
        setSuccessMessage(
          "Update successfully, you will be redirected to the login page !"
        );

        // Đăng xuất người dùng
        await axios.post(
          "http://localhost:3000/api/logout",
          {},
          {
            withCredentials: true,
          }
        );

        // Chuyển hướng về trang đăng nhập
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Đợi 1.5s để người dùng nhìn thấy thông báo

        // Xóa thông báo lỗi nếu có
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Cập nhật thất bại");
      } else {
        setErrorMessage("Lỗi khi cập nhật!");
      }
    }
  };

  return (
    <div>
      {user ? (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="form-row mb-4">
              <label
                htmlFor="customerNameInput"
                className="block font-semibold mb-2"
              >
                Full name:
              </label>
              <input
                type="text"
                id="customerNameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="form-row mb-4">
              <label
                htmlFor="customerPhoneInput"
                className="block font-semibold mb-2"
              >
                Telephone:
              </label>
              <input
                type="text"
                id="customerPhoneInput"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-row mb-4">
              <input
                type="checkbox"
                className="m-3"
                checked={changepw}
                onChange={() => setChangepw(!changepw)}
              />
              <label>I want to change password</label>
            </div>
            {changepw && (
              <div className="form-row mb-4">
                <label
                  htmlFor="customerPassword"
                  className="block font-semibold mb-2"
                >
                  New password:
                </label>
                <input
                  type="password"
                  id="customerPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mb-4">{successMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
            <button
              onClick={() => window.history.back()}
              type="button"
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors mt-3"
            >
              Back
            </button>
          </form>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CustomerProfile;
