import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Đảm bảo bạn đã import Link từ react-router-dom

const ManageMovie = () => {
  const [movie, setMovie] = useState([]); // Dữ liệu từ TheMovieDB
  const [movieDB, setMovieDB] = useState([]); // Dữ liệu từ cơ sở dữ liệu

  useEffect(() => {
    // Fetch dữ liệu phim từ TheMovieDB
    const fetchMovie = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      };
      const url1 =
        "https://api.themoviedb.org/3/movie/popular?language=vi&page=1";
      const [response1] = await Promise.all([fetch(url1, options)]);
      const data1 = await response1.json();
      setMovie(data1.results); // Lưu kết quả vào state movie
    };
    fetchMovie();
  }, []);

  useEffect(() => {
    // Fetch dữ liệu phim từ cơ sở dữ liệu
    const fetchMovieFromDB = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies`);
        const data = await response.json();
        console.log("Fetched movies from DB:", data); // Kiểm tra dữ liệu
        setMovieDB(data.data.movies); // Cập nhật state movieDB
      } catch (error) {
        console.error("Error fetching movie from database:", error);
      }
    };
    fetchMovieFromDB();
  }, []);

  const chunkArray = (arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };

  // Kết hợp dữ liệu từ movie và movieDB
  const combinedMovies = movie.map((item) => {
    const dbMovie = movieDB.find((dbItem) => dbItem.movie_id === item.id);
    return {
      ...item,
      ticket_price: dbMovie ? dbMovie.ticket_price : null, // Lấy giá vé từ DB nếu có
    };
  });

  const chunkedMovies = chunkArray(combinedMovies, 5); // Chia mảng thành các phần
  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("vi-VN");
  };
  return (
    <div className="text-black bg-cover bg-center bg-no-repeat w-full h-full relative">
      <p className="text-black text-center text-4xl font-custom_bold pt-5 pb-10">
        SHOWING NOW
      </p>
      <div>
        {chunkedMovies.map((chunk, index) => (
          <div key={index}>
            <div className="relative"></div>
            <div className="flex item-center justify-between space-x-4 pl-10 pr-10">
              {chunk.length > 0 ? (
                chunk.map((item) => (
                  <div
                    key={item.id}
                    className="w-[225px] h-[355px] relative group cursor-pointer mb-10"
                  >
                    <Link to={`/editmovie/${item.id}`}>
                      <div className="absolute top-0 left-0 w-full h-[325px] bg-black/50 rounded-2xl" />
                      <img
                        src={`${import.meta.env.VITE_IMG_URL}${
                          item.poster_path
                        }`}
                        alt={item.title}
                        className="w-full h-[325px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                      <p className="text-center text-black font-custom pt-3">
                        {item.title}
                      </p>
                      {item.ticket_price && (
                        <p className="text-center text-black font-custom pt-1">
                          Ticker Price:
                          {formatCurrency(item.ticket_price)}
                        </p>
                      )}
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-white text-center">No movies available</p>
              )}
            </div>
          </div>
        ))}
        <div className="pt-20">{/* <Contact /> */}</div>
      </div>
    </div>
  );
};

export default ManageMovie;
