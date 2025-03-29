import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PropTypes from "prop-types";
const CountdownTimer = ({ duration, onComplete }) => {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={duration}
      colors={["#4CAF50", "#F7B801", "#A30000"]}
      colorsTime={[duration, duration / 2, 0]}
      size={80}
      strokeWidth={8}
      onComplete={onComplete}
    >
      {({ remainingTime }) => (
        <div style={{ fontSize: "20px", color: "white" }}>{remainingTime}s</div>
      )}
    </CountdownCircleTimer>
  );
};

CountdownTimer.propTypes = {
  duration: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default CountdownTimer;
