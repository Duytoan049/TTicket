import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieRating from "../common/MovieRating";
import Modal from "react-modal";
import YouTube from "react-youtube";
import Loading from "../common/Loading";
import axios from "axios";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10000,
  },
};

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 1,
  },
};

const EditMovieDetail = () => {
  const { id } = useParams();
  const [editmovieDetail, setEditMovieDetail] = useState(null);
  const [directorName, setDirectorName] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [trailerId, setTrailerId] = useState("");
  const [movieName, setMoviename] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [movieDB, setMovieDB] = useState([]);
  const navigate = useNavigate();

  const handleInsert = async (e) => {
    e.preventDefault();

    const payload = {
      movie_id: id,
      movie_name: editmovieDetail.title,
      ticket_price: price,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/movies",
        payload
      );
      if (response.status === 200 || response.status === 201) {
        console.log("User registered successfully!", response.data);
        setSuccessMessage("Registration successful!");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data.message.includes("Duplicate entry")
      ) {
        setErrorMessage(
          "The movie already exists in the system. Please update instead of adding new."
        );
      } else {
        setErrorMessage("Đã có lỗi xảy ra khi thêm phim!");
      }
    }
  };

  useEffect(() => {
    const fetchEditMovieDetail = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=vi-VN&region=VN`,
        options
      );
      const data = await response.json();
      setEditMovieDetail(data);

      const creditsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=vi-VN`,
        options
      );
      const creditsData = await creditsResponse.json();
      const director = creditsData.crew.find(
        (member) => member.job === "Director"
      );
      setDirectorName(director ? director.name : "Không rõ");
    };
    fetchEditMovieDetail(id);
  }, [id]);

  useEffect(() => {
    const fetchMovieFromDB = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`);
        const data1 = await response.json();
        setMovieDB(data1.data.movieData);
        setPrice(data1.data.movieData.ticket_price); // Đặt giá vé từ dữ liệu
      } catch (error) {
        console.error("Error fetching movie from database:", error);
      }
    };
    fetchMovieFromDB();
  }, [id]);

  const [price, setPrice] = useState([""]);

  if (!editmovieDetail) {
    return <Loading />;
  }

  // const handleaddShowtime = () => {
  //   const payload = {
  //     title: editmovieDetail.title,
  //     ticket_price: price,
  //   };
  //   navigate(`/addshowtimes/${id}`, { state: payload });
  // };
  const handUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      ticket_price: price,
    };
    try {
      const response = await axios.put(
        `http://localhost:3000/api/movies/${id}`,
        updatedData
      );
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("Movie updated successfully!");
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error updating movie!");
      setSuccessMessage("");
      console.error("Error updating movie:", error);
    }
  };
  const runtime = editmovieDetail.runtime;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const languageMap = {
    en: "English",
    vi: "Vietnamese",
    fr: "French",
    // Thêm các ngôn ngữ khác
  };

  return (
    <div className="h-screen w-full">
      <div className="pt-20">
        <div
          className="space-x-10 w-full h-[600px] flex flex-row justify-center bg-movie-bg bg-no-repeat relative bg-cover"
          style={{
            backgroundImage: `url(${import.meta.env.VITE_IMG_URL_PRO}${
              editmovieDetail.backdrop_path
            })`,
          }}
        >
          <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-70 z-0"></div>

          {!modalIsOpen && (
            <div className="z-10 items-center flex">
              <img
                src={`${import.meta.env.VITE_IMG_URL}${
                  editmovieDetail.poster_path
                }`}
                alt={editmovieDetail.title}
                className="w-[300px] h-[450px] object-cover rounded-2xl"
              />
            </div>
          )}

          {!modalIsOpen && (
            <div className="z-10 w-[50%] pt-16">
              <p
                onChange={(e) => setMoviename(e.target.value)}
                value={editmovieDetail.title}
                className="text-4xl text-white font-custom_bold"
              >
                {editmovieDetail.title}
              </p>
              <div className="font-custom flex items-center space-x-4 text-white p-2">
                <MovieRating rating={editmovieDetail.vote_average} />
                <p className="text-white ">
                  {editmovieDetail.genres.map((genre) => genre.name).join(", ")}
                </p>
                <p>|</p>
                <p className="text-white">{editmovieDetail.release_date}</p>
                <p>|</p>
                <p className="text-white">
                  {`${hours}h${minutes < 10 ? `0${minutes}` : minutes}`}m
                </p>
              </div>
              <p className="text-white font-custom_bold text-2xl">Overview</p>
              <p className="text-white pt-2">{editmovieDetail.overview}</p>
              <p className="text-white pt-2">
                <span className="font-custom text-xl">Director: </span>
                {directorName}
              </p>
              <p className="text-white pt-2">
                <span className="font-custom text-xl">Language: </span>
                {languageMap[editmovieDetail.original_language] ||
                  editmovieDetail.original_language}
              </p>
              <p className="text-white pt-2">
                <span className="font-custom text-xl">Rated: </span>{" "}
                {editmovieDetail.adult
                  ? "This movie contains adult content."
                  : "This movie does not contain adult content and is suitable for all audiences."}
              </p>
              <div className="pt-10 space-x-5">
                <label className="text-white font-custom_bold text-xl">
                  Ticket Price:
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-slate-300 w-[200px] p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mb-4">{successMessage}</p>
              )}
              <div className="mt-7 space-x-6">
                <button
                  className="font-custom1 h-12 w-32 text-base border border-white text-stone-300 hover:bg-white hover:text-black rounded-lg duration-200 ease-in-out"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button
                  onClick={handUpdate}
                  className="font-custom1 h-12 w-32 text-base bg-red-600 text-white hover:bg-red-700 hover:text-black rounded-lg duration-200 ease-in-out"
                >
                  Update
                </button>
                <button
                  onClick={handleInsert}
                  className="font-custom1 h-12 w-32 text-base bg-red-600 text-white hover:bg-red-700 hover:text-black rounded-lg duration-200 ease-in-out"
                >
                  Add
                </button>
                {/* <button
                  onClick={handleaddShowtime}
                  className="font-custom1 h-12 w-32 text-base bg-red-600 text-white hover:bg-red-700 hover:text-black rounded-lg duration-200 ease-in-out"
                >
                  Add Showtime
                </button> */}
              </div>
            </div>
          )}
          <div className="absolute z-10 bottom-10 right-10">
            {/* <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setIsOpen(true)}
            >
              Watch Trailer
            </button> */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setIsOpen(false)}
              style={customStyles}
              contentLabel="Trailer Modal"
            >
              {trailerId ? (
                <YouTube videoId={trailerId} opts={opts} />
              ) : (
                <p>No trailer available</p>
              )}
              <button onClick={() => setIsOpen(false)}>Close</button>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovieDetail;
