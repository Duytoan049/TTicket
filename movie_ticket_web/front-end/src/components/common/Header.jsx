import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios để gửi yêu cầu

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin người dùng

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
          setUser(response.data.data.user); // Cập nhật state với thông tin người dùng
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/"; // Chuyển hướng đến trang chủ
    setUser(null); // Xóa thông tin người dùng
  };

  return (
    <header className="font-custom bg-transparent text-white p-4 flex items-center z-10 justify-between absolute top-0 left-0 w-full backdrop-filter backdrop-blur-none">
      {/* Logo */}
      <div className="text-3xl font-bold ml-7">
        <a href="/">T TICKET</a>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden xl:flex space-x-16 text-lg">
        <a href="/" className="hover:text-red-600 font-bold">
          Home
        </a>
        <a href="/movies" className="hover:text-red-600 font-bold">
          Movies
        </a>
        <a href="/showtimes" className="hover:text-red-600 font-bold">
          Showtimes
        </a>
        <a href="#contact" className="hover:text-red-600 font-bold">
          Contact
        </a>
      </nav>

      {/* Action Buttons */}
      <div className="hidden xl:flex w-1/3 h-10 space-x-4 items-center justify-end">
        {user ? (
          <>
            <Link
              className="flex flex-row items-center space-x-2"
              to={`/myticket`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 48 48"
              >
                <defs>
                  <mask id="ipTTicket0">
                    <g
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeWidth={4}
                    >
                      <path strokeLinejoin="round" d="M9 16L34 6l4 10"></path>
                      <path
                        fill="#555"
                        strokeLinejoin="round"
                        d="M4 16h40v6c-3 0-6 2-6 5.5s3 6.5 6 6.5v6H4v-6c3 0 6-2 6-6s-3-6-6-6z"
                      ></path>
                      <path d="M17 25.385h6m-6 6h14"></path>
                    </g>
                  </mask>
                </defs>
                <path
                  fill="red"
                  d="M0 0h48v48H0z"
                  mask="url(#ipTTicket0)"
                ></path>
              </svg>{" "}
              <p className="underline text-lg">My ticket</p>
            </Link>
            <Link
              to={`/CustomerProfile/${user.userId}`}
              className="flex flex-row items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="2em"
                height="2em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="red"
                  d="M6.25 7a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0m5.548 7.261a1 1 0 0 1 .13-.011h.144q.066 0 .13.011l7.295 1.283l.038.008c1.344.31 2.788 1.163 3.069 2.82l.004.029l.114.877v.002c.264 2.009-1.329 3.47-3.21 3.47a1 1 0 0 1-.124-.01h-14.9c-1.881 0-3.475-1.462-3.21-3.472l.114-.869l.005-.03c.28-1.627 1.736-2.528 3.077-2.819l.029-.006z"
                ></path>
              </svg>
              <span className="text-lg underline hover:text-red-800">
                {user.userName}
              </span>{" "}
            </Link>
            {/* Hiển thị tên người dùng */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={`/login`}>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                Sign In
              </button>
            </Link>
            <Link to={`/register`}>
              <button className="border border-red-600 text-red-600 px-6 py-2 rounded hover:bg-red-700 hover:text-black">
                Register
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Icon for mobile menu
      <div className="xl:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div> */}

      {/* Mobile Menu */}
      {/* {isMobileMenuOpen && (
        <div className="absolute top-16 right-0 w-[50%] bg-black p-4 flex flex-col space-y-4">
          <a href="#home" className="hover:text-red-600">
            Home
          </a>
          <a href="#movies" className="hover:text-red-600">
            Movies
          </a>
          <a href="#showtimes" className="hover:text-red-600">
            Showtimes
          </a>
          <a href="#contact" className="hover:text-red-600">
            Contact
          </a>

          {user ? (
            <>
              <span className="text-lg">{user.userName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-black px-4 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={`/login`}>
                <button className="bg-red-600 text-black px-4 py-1 rounded hover:bg-red-700">
                  Sign In
                </button>
              </Link>
              <Link to={`/register`}>
                <button className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-700 hover:text-black">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      )} */}
    </header>
  );
};

export default Header;
