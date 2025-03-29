import { useState } from 'react';
import axios from 'axios'; 

const Register = () => {
  const [user_name, setUserName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State để lưu thông báo thành công

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      user_name,
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/register', payload);

      if (response.status === 200 || response.status === 201) {
        // Xử lý khi đăng ký thành công
        console.log('User registered successfully!', response.data);
        setSuccessMessage('Registration successful!'); // Thiết lập thông báo thành công
        // Reset form
        setUserName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Registration failed');
      } else {
        setErrorMessage('Error during registration!');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-red-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create your account
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              User Name
            </label>
            <input
              type="text"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your user name"
              required
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Hiển thị thông báo lỗi nếu có */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Hiển thị thông báo thành công nếu có */}
          {successMessage && (
            <p className="text-green-500 text-sm mb-4">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Register now
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-red-500 font-semibold hover:underline"
          >
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
