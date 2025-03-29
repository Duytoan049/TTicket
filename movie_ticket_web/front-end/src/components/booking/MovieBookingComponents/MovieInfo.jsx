import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MovieInfo = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);

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
    };

    fetchMovieDetail();
  }, [id]);

  // Kiểm tra nếu movieDetail chưa có dữ liệu
  if (!movieDetail) {
    return <p>Loading...</p>; // Hiển thị Loading khi chưa có dữ liệu
  }
  return (
    <div className="flex flex-col items-center">
      <img
        src={`${import.meta.env.VITE_IMG_URL}${movieDetail.poster_path}`}
        alt="Movie Poster"
        className="w-[300px] h-[450px] rounded-lg"
      />
      <h2 className="text-white text-2xl mt-4 font-custom">
        {movieDetail.title}
      </h2>
      <p className="text-gray-400 items-start text-xl font-custom_semi">
        Duration: {Math.floor(movieDetail.runtime / 60)}h{" "}
        {movieDetail.runtime % 60}m
      </p>
      <p className="text-gray-400 text-xl font-custom_semi">
        Type: {movieDetail.genres.length > 0 && movieDetail.genres[0].name}
      </p>
    </div>
  );
};

export default MovieInfo;
