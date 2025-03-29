import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import Showtimes from "../pages/Theater";
import MovieDetail from "./components/movies/MovieDetail"; // Import component MovieDetail
import Banner from "./components/common/Banner";
import Movielist from "./components/movies/MovieList";
import MovielistRate from "./components/movies/MovielistRate";
import Header from "./components/common/Header";
import MovieBooking from "./components/booking/MovieBooking";
import SeatSelection from "./components/booking/SeatSelection";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import BookingDetail from "./components/booking/BookingDetail";
import CustomerProfile from "./components/user/CustomerProfile";
import Admin from "./components/admin/Admin";
import AdminManage from "./components/admin/AdminManage";
import EditMovieDetail from "./components/admin/EditMovieDetail";
import AddShowTime from "./components/admin/AddShowTime";
import Ticket from "./components/booking/Ticket";
import MyTicket from "./components/user/MyTicket";
import TheaterDetail from "./components/theater/TheaterDetail";
import UpdateShowTime from "./components/admin/UpdateShowTimeModal";
const AppRoutes = () => {
  const [movie, setMovie] = useState([]);
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
        "https://api.themoviedb.org/3/movie/now_playing?language=vi&page=1";
      const url2 =
        "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";

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
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="bg-gradient pb-10 bg-cover bg-center bg-no-repeat">
            <div className="z-20">
              <Header />
            </div>
            <div>
              <Banner />
            </div>
            <Home />
            <div>
              <div className="flex relative flex-col pb-5 pt-10 ">
                <h1 className="text-white text-center text-4xl font-custom_bold">
                  SHOWING NOW
                </h1>
                <a
                  className="text-white text-base pr-10 text-end"
                  href="/Movies"
                >
                  See more
                </a>
                <Movielist data={movie.slice(0, 5)} />
              </div>
              <div className="pb-20">
                <Movielist data={movie.slice(5, 10)} />
              </div>
              <MovielistRate title="UP COMING" data={movieRate} />
            </div>
          </div>
        }
      />
      <Route path="/movies" element={<Movies />} />
      <Route path="/showtimes" element={<Showtimes />} />
      <Route
        path="/movie/:id"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div className="z-50 ">
              <Header />
            </div>
            <div className="z-0">
              <MovieDetail />
            </div>
          </div>
        }
      />
      {/* Thêm route cho chi tiết phim */}
      <Route
        path="/booking/:id"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div>
              <Header />
            </div>
            <div className="pt-20">
              <MovieBooking />
            </div>
          </div>
        }
      />
      <Route
        path="/addshowtimes/:id"
        element={
          <div className="w-screen h-screen relative">
            <div className="pt-20">
              <AddShowTime />
            </div>
          </div>
        }
      />
      <Route
        path="/seatselection/:id"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div>
              <Header />
            </div>
            <div className="pt-24">
              <SeatSelection />
            </div>
          </div>
        }
      />
      <Route
        path="/login"
        element={
          <div>
            <div>
              <Header />
            </div>
            <div>
              <Login />
            </div>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div>
            <div>
              <Header />
            </div>
            <div>
              <Register />
            </div>
          </div>
        }
      />
      <Route
        path="/bookingdetail/:id"
        element={
          <div>
            <div>
              <BookingDetail />
            </div>
          </div>
        }
      />
      <Route
        path="/CustomerProfile/:id"
        element={
          <div>
            <div>
              <CustomerProfile />
            </div>
          </div>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <div>
            <div>
              <AdminManage />
            </div>
          </div>
        }
      />
      <Route
        path="/editmovie/:id"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div className="z-0">
              <EditMovieDetail />
            </div>
          </div>
        }
      />
      <Route
        path="/editmovie/:id"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div className="z-0">
              <EditMovieDetail />
            </div>
          </div>
        }
      />
      <Route
        path="/ticket"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div className="z-0">
              <Ticket />
            </div>
          </div>
        }
      />
      <Route
        path="/myticket"
        element={
          <div className="bg-gradient bg-cover bg-center bg-no-repeat w-screen h-screen relative">
            <div>
              <Header />
            </div>
            <div>
              <MyTicket />
            </div>
          </div>
        }
      />
      <Route path="/theaters/:movieId" element={<TheaterDetail />} />
      <Route path="/update-showtime/:show_id" element={<UpdateShowTime />} />
    </Routes>
  );
};

export default AppRoutes;
