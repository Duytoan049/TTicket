import Header from "../src/components/common/Header";
import MovieList from "../src/components/movies/MovieList";
import { useState, useEffect } from "react";
import Contact from "../src/components/contact/Contact";
const Movies = () => {
  const [movie, setMovie] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [movieRate, setMovieRate] = useState([]);

  useEffect(() => {
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
      const url2 =
        "https://api.themoviedb.org/3/movie/upcoming?language=vi-VN&region=VN&page=1";

      const [response1, response2] = await Promise.all([
        fetch(url1, options),
        fetch(url2, options),
      ]);
      const data1 = await response1.json();
      const data2 = await response2.json();

      setMovie(data1.results);
      setMovieRate(data2.results);
    };
    fetchMovie();
  }, []);
  const chunkArray = (arr, chunkSize) => {
    let result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  };
  const chunkedMovies = chunkArray(movie, 5);
  return (
    <div className="p-10 text-black bg-gradient bg-cover bg-center bg-no-repeat w-full h-full relative">
      <Header />
      <p className="text-white text-center text-4xl font-custom_bold pt-20">
        SHOWING NOW
      </p>
      <div>
        {chunkedMovies.map((chunk, index) => (
          <MovieList key={index} data={chunk} />
        ))}
        <div className="pt-20">
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default Movies;
