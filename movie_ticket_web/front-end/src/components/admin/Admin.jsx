import axios from "axios";
import { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4); // Số lượng người dùng hiển thị trên mỗi trang

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users`);
        if (response.data.status === "success") {
          setUsers(response.data.data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUsername(user.user_name);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      email,
      phone,
      role,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${selectedUser.user_id}`,
        updatedData
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("User updated successfully!");
        setErrorMessage("");

        // Update user list directly in state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === selectedUser.user_id
              ? { ...user, ...updatedData }
              : user
          )
        );

        // Clear selected user
        setSelectedUser(null);
      }
    } catch (error) {
      setErrorMessage("Error updating user!");
      setSuccessMessage("");
    }
  };

  // Get current users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="">
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        {users.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUsers.map((user) => (
                <div
                  key={user.user_id}
                  className="border border-[#C4C4C7] p-4 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectUser(user)}
                >
                  <p>User ID: {user.user_id}</p>
                  <p>User Name: {user.user_name || "N/A"}</p>
                  <p>Name : {user.name || "N/A"}</p>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone || "N/A"}</p>
                  <p>Role: {user.role}</p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`mx-2 px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === number
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
                className={`mx-2 px-3 py-1 rounded-md ${
                  currentPage === pageNumbers.length
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No users found.</p>
        )}

        {selectedUser && (
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-lg shadow-lg mt-6"
          >
            <h3 className="text-xl font-semibold mb-4">
              Update User Information
            </h3>
            <div className="mb-4">
              <label htmlFor="userName" className="block font-semibold mb-2">
                User Name:
              </label>
              <input
                type="text"
                id="userName"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-300 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userName" className="block font-semibold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userEmail" className="block font-semibold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="userEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userPhone" className="block font-semibold mb-2">
                Phone:
              </label>
              <input
                type="text"
                id="userPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userRole" className="block font-semibold mb-2">
                Role:
              </label>
              <select
                id="userRole"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Update User
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Admin;
