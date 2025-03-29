import MovieInfo from "./MovieBookingComponents/MovieInfo";
import MovieBookingDetail from "./MovieBookingComponents/MovieBookingDetail";
const MovieBooking = () => {
  return (
    <div className="">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <MovieBookingDetail />
          </div>
          <div className="pt-20">
            <MovieInfo />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MovieBooking;
