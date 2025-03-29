import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
const MovieDetails = () => {
  const { movieId } = useParams(); // Lấy movieId từ URL
  const [showTimes, setShowTimes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTimesPerPage] = useState(5); // Số lượng showtime trên mỗi trang
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [theaters, setTheaters] = useState([]); // Lưu danh sách các rạp
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const fetchShowTimes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/showtimes?movieId=${movieId}`
        );

        if (response.data.status === "success") {
          setShowTimes(response.data.data.showTimes);
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowTimes();
  }, [movieId]);
  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/theaters`);
        setTheaters(response.data.data.theaters);
      } catch (error) {
        console.error("Error fetching theaters: ", error);
      }
    };
    fetchTheater();
  }, []);
  // Tính toán các showtime hiện tại
  const indexOfLastShowTime = currentPage * showTimesPerPage;
  const indexOfFirstShowTime = indexOfLastShowTime - showTimesPerPage;
  const currentShowTimes = showTimes.slice(
    indexOfFirstShowTime,
    indexOfLastShowTime
  );

  // Chuyển trang
  const nextPage = () => {
    if (currentPage < Math.ceil(showTimes.length / showTimesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(showTimes.length / showTimesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setTheaterId(showtime.theater_id);
    setShowDate(showtime.show_date);
    setShowTime(showtime.show_time);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      theater_id: theaterId,
      show_date: showDate,
      show_time: showTime,
    };
    try {
      const response = await axios.put(
        `http://localhost:3000/api/showtime/${selectedShowtime.show_id}`,
        updatedData
      );
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("User updated successfully!");
        setErrorMessage("");
        setShowTimes((prevShowTimes) =>
          prevShowTimes.map((show) =>
            show.show_id === selectedShowtime.show_id
              ? { ...show, ...updatedData }
              : show
          )
        );
      }
    } catch (error) {
      console.error("Error updating showtime:", error);
      setErrorMessage("Error updating user!");
      setSuccessMessage("");
    }
  };
  const handleDelete = async (showId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this showtime?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/showtime/${showId}`
        );

        if (response.status === 200) {
          setShowTimes((prevShowTimes) =>
            prevShowTimes.filter((show) => show.show_id !== showId)
          );
          alert("Showtime deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting showtime:", error);
        alert("Error deleting showtime.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Showtimes for Movie {movieId}</h2>
      <button
        onClick={() => navigate(`/addshowtimes/${movieId}`)}
        className="font-custom1 h-12 w-32 text-base bg-red-500 text-white hover:bg-red-700 hover:text-white rounded-lg duration-200 ease-in-out"
      >
        Add Showtime
      </button>
      {currentShowTimes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pt-5">
          {currentShowTimes.map((show) => (
            <div
              key={show.show_id}
              className="p-4 border border-zinc-300 rounded"
              onClick={() => handleSelectShowtime(show)}
            >
              <p>Movie Name: {show.movie_name}</p>
              <p>Show Date: {format(new Date(show.show_date), "dd/MM/yyyy")}</p>
              <p>Show Time: {show.show_time}</p>
              <p>Theater ID: {show.theater_id}</p>
              <button
                onClick={() => handleDelete(show.show_id)}
                className="font-custom1 h-12 w-32 text-base bg-red-500 text-white hover:bg-red-700 hover:text-white rounded-lg duration-200 ease-in-out"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No showtimes available.</p>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 rounded-md ${
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
            onClick={() => setCurrentPage(number)}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === number ? "bg-blue-700 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === pageNumbers.length}
          className={`px-4 py-2 mx-2 rounded-md ${
            currentPage === pageNumbers.length
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
      {selectedShowtime && (
        <form
          onSubmit={handleUpdate}
          className="bg-white p-6 rounded-lg shadow-lg mt-6"
        >
          <h3 className="text-xl font-semibold mb-4">
            Update Showtime Information
          </h3>
          <div className="mb-4">
            <label htmlFor="userName" className="block font-semibold mb-2">
              Theater ID:
            </label>
            <select
              value={theaterId}
              onChange={(e) => setTheaterId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select a theater</option>
              {theaters.length > 0 ? (
                theaters.map((theater) => (
                  <option key={theater.theater_id} value={theater.theater_id}>
                    {theater.theater_name}
                  </option>
                ))
              ) : (
                <option value="">No theaters available</option>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="userName" className="block font-semibold mb-2">
              Show Date:
            </label>
            <input
              type="date"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block font-semibold mb-2">
              Show Time:
            </label>
            <input
              type="time"
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update User
          </button>
        </form>
      )}
    </div>
  );
};
export default MovieDetails;
