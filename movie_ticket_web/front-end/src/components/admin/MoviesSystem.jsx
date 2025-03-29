import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const MoviesSystem = () => {
  const [movieDB, setMovieDB] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieFromDB = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies`);
        const data = await response.json();

        if (data.status === "success") {
          setMovieDB(data.data.movies);
        }
      } catch (error) {
        console.error("Error fetching movies from database:", error);
      }
    };

    fetchMovieFromDB();
  }, []);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movieDB.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleDelete = async (event, showId) => {
    event.stopPropagation(); // Ngừng điều hướng trang khi nhấn vào nút delete
    event.preventDefault(); // Ngừng hành động mặc định nếu có (ví dụ điều hướng)
    const confirmation = window.confirm(
      "Are you sure you want to delete this movie?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/movies/${showId}`
        );

        if (response.status === 200) {
          setMovieDB((prevMovie) =>
            prevMovie.filter((movie) => movie.movie_id !== showId)
          );
          alert("Movie deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Error deleting movie.");
      }
    }
  };
  const handleMovieClick = (movieId) => {
    navigate(`/theaters/${movieId}`);
  };
  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("vi-VN");
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Movies Management</h2>

      {movieDB.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentMovies.map((movie) => (
            <div
              key={movie.movie_id}
              className="border border-gray-300 p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => handleMovieClick(movie.movie_id)}
            >
              <h3 className="text-xl font-semibold mb-2">{movie.movie_name}</h3>
              <p>Movie ID: {movie.movie_id}</p>
              <p>
                Ticket Price:{" "}
                {formatCurrency(movie.ticket_price) > 0
                  ? `${formatCurrency(movie.ticket_price)} VND`
                  : "Free"}
              </p>
              <button
                onClick={(event) => handleDelete(event, movie.movie_id)}
                className="font-custom1 h-12 w-32 text-base bg-red-500 text-white hover:bg-red-700 hover:text-white rounded-lg duration-200 ease-in-out"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found.</p>
      )}

      {/* Pagination */}
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
        {[...Array(Math.ceil(movieDB.length / moviesPerPage)).keys()].map(
          (number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={`mx-1 px-3 py-1 rounded-md ${
                currentPage === number + 1
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200"
              }`}
            >
              {number + 1}
            </button>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(movieDB.length / moviesPerPage)}
          className={`mx-2 px-3 py-1 rounded-md ${
            currentPage === Math.ceil(movieDB.length / moviesPerPage)
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MoviesSystem;
