import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import CountdownTimer from "../common/CountdownTimer";
const SeatSelection = () => {
  const seats = [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "B10",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "C8",
    "C9",
    "C10",
  ];
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // Sử dụng useLocation để lấy state
  const { bookingInfo } = location.state || {}; // Lấy bookingInfo từ state
  const [seatPrice, setSeatPrice] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const handleProceedPayment = () => {
    const payload = {
      Seat: selectedSeats,
      Price: seatPrice,
      Theater: bookingInfo.theater,
      Date: bookingInfo.date,
      Time: bookingInfo.time,
      showId: bookingInfo.showId,
    };
    navigate(`/bookingdetail/${id}`, { state: payload });
  };

  const handleSeatClick = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  useEffect(() => {
    const fetchMovieInfor = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/movies/${id}`);
        const data1 = await response.json();
        setSeatPrice(data1.data.movieData.ticket_price);
      } catch (error) {
        console.error("Error fetching movie: ", error);
      }
    };
    fetchMovieInfor();
  }, [id]);
  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tickets?showid=${bookingInfo.showId}`
        );
        const reserved = [];

        response.data.data.seats.forEach((ticket) => {
          reserved.push(
            ...ticket.seat_number.split(", ").map((seat) => seat.trim())
          );
        });

        setReservedSeats(reserved); // Cập nhật danh sách ghế đã đặt
      } catch (error) {
        console.error("Error fetching reserved seats: ", error);
      }
    };

    if (bookingInfo.showId) {
      fetchReservedSeats();
    }
  }, [bookingInfo.showId]);
  const handleTimeOut = () => {
    alert("Hết thời gian! Vui lòng chọn lại vé.");
    setSelectedSeats([]); // Hủy ghế đã chọn
  };

  return (
    <div className="h-full flex-col flex items-center">
      {/* Hiển thị thông tin đặt chỗ */}
      <div className="text-center text-white mb-4">
        <h2 className="text-2xl font-custom_bold">Booking Information</h2>
        {bookingInfo && (
          <>
            <p>
              <strong>Theater:</strong> {bookingInfo.theater}
            </p>
            <p>
              <strong>Date:</strong> {bookingInfo.date}
            </p>
            <p>
              <strong>Time:</strong> {bookingInfo.time}
            </p>
          </>
        )}
      </div>

      {/* Lưới ghế */}
      <div className="grid grid-cols-10 items-center justify-center w-[800px] h-[400px]">
        {seats.map((seat) => (
          <button
            key={seat}
            className={`w-14 h-14 border rounded-md font-bold text-black ${
              selectedSeats.includes(seat)
                ? "bg-red-600"
                : reservedSeats.includes(seat)
                ? "bg-black text-white cursor-not-allowed"
                : "bg-white"
            }`}
            onClick={() => handleSeatClick(seat)}
            disabled={reservedSeats.includes(seat)} // Disable ghế đã được đặt
          >
            {seat}
          </button>
        ))}
      </div>

      <CountdownTimer duration={60} onComplete={handleTimeOut} />
      {/* Hiển thị tổng tiền và ghế đã chọn */}
      <div className="flex flex-row h-[100px] items-end justify-evenly w-screen">
        <div className="flex justify-evenly w-1/2">
          <div>
            <p className="text-white">
              <span className="text-2xl font-custom_bold">Total:</span> <br />
              {(selectedSeats.length * seatPrice || 0).toLocaleString(
                "vi-VN"
              )}{" "}
              VND
            </p>
          </div>
          <div>
            <p className="text-white">
              <span className="text-2xl font-custom_bold">Seat:</span> <br />
              {selectedSeats.join(", ") || "None"}
            </p>
          </div>
        </div>

        {/* Nút quay lại và thanh toán */}
        <div className="flex justify-evenly w-1/2">
          <button
            onClick={() => window.history.back()}
            className="border-white border text-white rounded-md px-16 py-3 hover:bg-white hover:text-black duration-200 ease-in-out"
          >
            Back
          </button>

          <button
            onClick={handleProceedPayment}
            className="bg-red-600 text-white rounded-md px-12 py-3 hover:bg-red-700 hover:text-black duration-200 ease-in-out hover:scale-105"
          >
            Proceed Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
