import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

const MovieBookingDetail = () => {
  const { id } = useParams(); // Lấy movieId từ URL
  const [selectedTheater, setSelectedTheater] = useState("");
  const navigate = useNavigate(); // Khai báo hook useNavigate
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimes, setShowTimes] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedShowId, setSelectedShowId] = useState(null); // State để lưu show_id

  const handleProceed = () => {
    const bookingInfo = {
      theater: selectedTheater,
      date: selectedDate,
      time: selectedTime,
      movieId: id,
      showId: selectedShowId, // Truyền show_id vào bookingInfo
    };
    navigate(`/seatselection/${id}`, { state: { bookingInfo } }); // Sử dụng useNavigate
  };

  useEffect(() => {
    const fetchShowTimes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/showtimes?movieId=${id}`
        );
        setShowTimes(response.data.data.showTimes);
      } catch (error) {
        console.error("Error fetching show times: ", error);
      }
    };

    const fetchTheaters = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/theaters");
        setTheaters(response.data.data.theaters);
      } catch (error) {
        console.error("Error fetching theaters: ", error);
      }
    };

    fetchShowTimes();
    fetchTheaters();
  }, [id]);

  const handleTheaterSelect = (theaterId) => {
    const selectedTheater = theaters.find((t) => t.theater_id === theaterId);
    setSelectedTheater(selectedTheater?.theater_name || "");

    const dates = showTimes
      .filter((show) => show.theater_id === theaterId)
      .map((show) =>
        format(parseISO(show.show_date), "dd/MM/yyyy", { locale: vi })
      )
      .filter((date, index, self) => self.indexOf(date) === index);

    setAvailableDates(dates);
    setAvailableTimes([]);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    const times = showTimes
      .filter(
        (show) =>
          format(parseISO(show.show_date), "dd/MM/yyyy", { locale: vi }) ===
            date &&
          show.theater_id ===
            theaters.find((t) => t.theater_name === selectedTheater)?.theater_id
      )
      .map((show) => ({ time: show.show_time, showId: show.show_id })); // Bao gồm show_id cùng với thời gian

    setAvailableTimes(times);
    setSelectedTime("");
  };

  const handleTimeSelect = (time, showId) => {
    setSelectedTime(time);
    setSelectedShowId(showId); // Lưu show_id vào state
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Movie Booking Detail</h1>
      {/* Component TheaterSelection */}
      <div className="flex space-x-4 mt-4">
        {theaters.map((theater) => (
          <button
            key={theater.theater_id}
            className={`px-4 py-2 border rounded-full text-white ${
              selectedTheater === theater.theater_name
                ? "bg-red-600"
                : "border-gray-300"
            }`}
            onClick={() => handleTheaterSelect(theater.theater_id)}
          >
            {theater.theater_name}
          </button>
        ))}
      </div>

      {/* Component DateSelection */}
      {availableDates.length > 0 && (
        <div className="flex space-x-4 mt-4">
          {availableDates.map((date, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded-xl text-white ${
                selectedDate === date ? "bg-red-600" : "border-gray-300"
              }`}
              onClick={() => handleDateSelect(date)}
            >
              {date}
            </button>
          ))}
        </div>
      )}

      {/* Component TimeSelection */}
      {availableTimes.length > 0 && (
        <div className="flex space-x-4 mt-4">
          {availableTimes.map((timeObj, index) => (
            <button
              key={index}
              className={`px-4 py-2 border rounded-xl text-white ${
                selectedTime === timeObj.time ? "bg-red-600" : "border-gray-300"
              }`}
              onClick={() => handleTimeSelect(timeObj.time, timeObj.showId)}
            >
              {timeObj.time}
            </button>
          ))}
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg mt-4 text-center absolute bottom-52 h-[200px] w-[500px]">
        <p className="text-white text-start font-bold text-xl">
          Booking Summary
        </p>
        <p className="text-gray-400 text-start">Theater: {selectedTheater}</p>
        <p className="text-gray-400 text-start">Date: {selectedDate}</p>
        <p className="text-gray-400 text-start">Time: {selectedTime}</p>
        <p className="text-gray-400 text-start">
          Show ID: {selectedShowId}
        </p>{" "}
        {/* Hiển thị show_id */}
        <button
          className="mt-4 bg-red-600 text-white w-full px-4 py-2 rounded-md"
          onClick={handleProceed}
        >
          Proceed to Seat Selection
        </button>
      </div>
    </div>
  );
};

export default MovieBookingDetail;
