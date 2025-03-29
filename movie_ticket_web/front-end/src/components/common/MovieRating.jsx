import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PropTypes from "prop-types";
const MovieRating = ({ rating }) => {
  return (
    <div className="font-custom_bold">
      <div
        style={{
          maxWidth: "80px",
          maxHeight: "50px",
          width: "50px",
          height: "80px",
        }}
      >
        <CircularProgressbar
          value={rating * 10}
          text={`${Math.round(rating * 10)}%`}
          styles={buildStyles({
            textSize: "25px",
            pathColor: "#4CAF50",
            textColor: "white",
            trailColor: "grey",
          })}
        />
      </div>
    </div>
  );
};
MovieRating.propTypes = {
  rating: PropTypes.number, // Đúng kiểu dữ liệu cần dùng
};

export default MovieRating;
