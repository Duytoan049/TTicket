import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const MovieList = ({ title, data }) => {
  return (
    <div>
      <div className="relative">
        <p className="text-white text-center text-4xl font-custom_bold pb-10">
          {title}
        </p>
      </div>
      <div className="flex item-center justify-between space-x-4 pl-10 pr-10">
        {data.length > 0 &&
          data.map((item) => (
            <div
              key={item.id}
              className="w-[225px] h-[355px] relative group cursor-pointer"
            >
              <Link to={`/movie/${item.id}`}>
                <div className="absolute top-0 left-0 w-full h-[325px] bg-black/50 rounded-2xl" />
                <img
                  src={`${import.meta.env.VITE_IMG_URL}${item.poster_path}`}
                  alt={item.title}
                  className="w-full h-[325px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <p className="text-center text-white font-custom pt-3">
                  {item.title}
                </p>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

MovieList.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default MovieList;
