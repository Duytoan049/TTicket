import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieRating from "../common/MovieRating";
import Modal from "react-modal";
import YouTube from "react-youtube";
import Loading from "../common/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10000, // Đặt z-index cao để modal luôn ở trên cùng
  },
};

const opts = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 1,
  },
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);
  const [directorName, setDirectorName] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [trailerId, setTrailerId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMovieDetail = async () => {
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
      setMovieDetail(data);

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
    fetchMovieDetail(id);
  }, [id]);
  const [user, setUser] = useState(null);
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
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  if (!movieDetail) {
    return <Loading />;
  }

  // Fetch trailer từ youtube
  const fetchTrailer = async (id) => {
    setTrailerId("");
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      };
      const trailerResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      );
      const trailersData = await trailerResponse.json();
      setTrailerId(trailersData.results[0].key);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
      setIsOpen(false);
    }
  };

  const runtime = movieDetail.runtime;
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  const languageMap = {
    en: "Tiếng Anh",
    vi: "Tiếng Việt",
    fr: "Tiếng Pháp",
    // Thêm các ngôn ngữ khác
  };
  const Booking = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt vé");
      navigate("/login"); // Điều hướng đến trang login
    } else {
      navigate(`/booking/${movieDetail.id}`); // Điều hướng đến trang booking
    }
  };

  return (
    <div className="h-screen w-full">
      <div className="pt-20">
        <div
          className="space-x-10 w-full h-[600px] flex flex-row justify-center bg-movie-bg bg-no-repeat relative bg-cover"
          style={{
            backgroundImage: `url(${import.meta.env.VITE_IMG_URL_PRO}${
              movieDetail.backdrop_path
            })`,
          }}
        >
          <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-70 z-0"></div>

          {!modalIsOpen && ( // Ẩn phần tử khi modal mở
            <div className="z-10 items-center flex">
              <img
                src={`${import.meta.env.VITE_IMG_URL}${
                  movieDetail.poster_path
                }`}
                alt={movieDetail.title}
                className="w-[300px] h-[450px] object-cover rounded-2xl"
              />
            </div>
          )}

          {!modalIsOpen && ( // Ẩn phần tử khi modal mở
            <div className="z-10 w-[50%] pt-16">
              <p className="text-4xl text-white font-custom_bold">
                {movieDetail.title}
              </p>
              <div className="font-custom flex items-center space-x-4 text-white p-2">
                <MovieRating rating={movieDetail.vote_average} />
                <p className="text-white ">
                  {movieDetail.genres.map((genre) => genre.name).join(", ")}
                </p>
                <p>|</p>
                <p className="text-white">{movieDetail.release_date}</p>
                <p>|</p>
                <p className="text-white">
                  {`${hours}h${minutes < 10 ? `0${minutes}` : minutes}`}m
                </p>
              </div>
              <p className="text-white font-custom_bold text-2xl">Overview</p>
              <p className="text-white pt-2">{movieDetail.overview}</p>
              <p className="text-white pt-2">
                <span className="font-custom text-xl">Đạo diễn: </span>
                {directorName}
              </p>
              <p className="text-white pt-2">
                <span className="font-custom text-xl">Ngôn ngữ: </span>
                {languageMap[movieDetail.original_language] ||
                  movieDetail.original_language}
              </p>
              <p className="text-white pt-2">
                <span className="font-custom text-xl">Rated: </span>{" "}
                {movieDetail.adult
                  ? "Bộ phim này có chứa nội dung dành cho người lớn."
                  : "Bộ phim này không chứa nội dung dành cho người lớn, phù hợp cho mọi đối tượng."}
              </p>
              <div className="mt-7 space-x-6">
                <button
                  className="font-custom1 h-12 w-32 text-base border border-white text-stone-300 hover:bg-white hover:text-black rounded-lg duration-200 ease-in-out"
                  onClick={() => fetchTrailer(movieDetail.id)}
                >
                  Watch trailer
                </button>

                <button
                  className="font-custom1 h-12 w-32 text-base bg-red-600 text-white hover:bg-red-700 hover:text-black rounded-lg duration-200 ease-in-out "
                  onClick={Booking}
                >
                  Booking now
                </button>
              </div>
            </div>
          )}

          <div className="z-20">
            {" "}
            {/* Đảm bảo modal có z-index lớn hơn */}
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setIsOpen(false)}
              style={customStyles}
              contentLabel="Trailer Modal"
            >
              {trailerId ? (
                <YouTube videoId={trailerId} opts={opts} />
              ) : (
                <p>Trailer not available</p>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
