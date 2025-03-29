import axios from "axios";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State để lưu thông báo thành công

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Xử lý khi đăng nhập thành công
        console.log("User login successfully!", response.data);
        setSuccessMessage("Login successful!"); // Thiết lập thông báo thành công
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Chuyển hướng người dùng đến trang chủ hoặc trang cá nhân
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        setErrorMessage("Error during login!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-red-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to your account
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="youremail@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
              required
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Login now
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Dont Have An Account?{" "}
          <a
            href="/register"
            className="text-red-500 font-semibold hover:underline"
          >
            Register Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
