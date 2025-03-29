import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ca } from "date-fns/locale";

const BookingDetail = () => {
  const { id } = useParams();
  const location = useLocation(); // Lấy dữ liệu state từ location
  const bookingInfo = location.state || {}; // Dữ liệu được truyền từ SeatSelection

  const seats = bookingInfo.Seat || []; // Ghế đã chọn
  const ticketPrice = parseFloat(bookingInfo.Price) || 0; // Giá vé
  const serviceCharge = 0.06 * ticketPrice; // Tính phí dịch vụ
  const date = bookingInfo.Date || ""; // Ngày
  const time = bookingInfo.Time || ""; // Thời gian

  const totalTicketPrice = ticketPrice * seats.length; // Tính tổng giá vé
  const totalServiceCharge = serviceCharge * seats.length; // Tính tổng phí dịch vụ
  const [amount, setAmount] = useState(totalTicketPrice + totalServiceCharge); // Tính tổng thanh toán
  const totalPrice = ticketPrice * seats.length;
  const [movieDetail, setMovieDetail] = useState(null);
  const [user, setUser] = useState(null); // Thêm state để lưu thông tin người dùng
  const navigate = useNavigate();
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
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/current_user",
          {
            withCredentials: true,
          }
        );
        if (response.data.status === "success") {
          setUser(response.data.data.user); // Cập nhật state với thông tin người dùng
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/payment", {
        amount: amount,
        show_id: bookingInfo.showId,
        user_id: user.userId,
        seats: seats,
      });

      if (response.data.paymentUrl) {
        window.open(response.data.paymentUrl, "_blank");

        // ✅ Lưu `transId` vào state để kiểm tra sau
        const transId = response.data.transId;
        checkPayment(transId, 0);
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
    }
  };

  const checkPayment = async (transId, attempt = 0) => {
    if (attempt >= 60) {
      // Dừng lại sau 15 phút (60 lần x 15 giây)
      console.log("⛔ Hết thời gian chờ thanh toán.");
      return;
    }

    try {
      console.log(`🔄 Lần kiểm tra thứ ${attempt + 1} với transId:`, transId);

      const result = await axios.get(
        `http://localhost:3000/api/check-payment/${transId}`
      );

      console.log("Dữ liệu nhận từ API:", result.data);

      if (Number(result.data.return_code) === 1) {
        console.log("✅ Thanh toán thành công!");
        handleInsertTicket();
      } else {
        console.log(
          `⏳ Đơn hàng chưa hoàn tất, kiểm tra lại sau (${attempt + 1}/60)`
        );
        setTimeout(
          () => checkPayment(transId, attempt + 1),
          attempt < 12 ? 5000 : 15000
        );
        // 12 lần đầu (1 phút) kiểm tra mỗi 5 giây, sau đó giãn ra 15 giây
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra thanh toán:", error);
    }
  };

  const handleInsertTicket = async () => {
    const seatString = seats.join(", "); // Chuyển đổi mảng ghế thành chuỗi
    const payload = {
      show_id: bookingInfo.showId,
      user_id: user.userId,
      seat_number: seatString, // Lưu chuỗi ghế
      price: amount, // Tổng tiền cho tất cả ghế
    };

    try {
      const insert = await axios.post(
        `http://localhost:3000/api/ticket`,
        payload
      );
      if (insert.status === 200 || insert.status === 201) {
        console.log("Purchase successful", insert.data);
      }
    } catch (error) {
      console.error("Error during Purchase: ", error);
    }
    const payloadnav = {
      show_id: bookingInfo.showId,
      user_id: user.userId,
      seats: seats, // Lưu chuỗi ghế
      price: amount, // Tổng tiền cho tất cả ghế
      time: time,
      title: movieDetail.title,
      date: date,
      ticketPrice: ticketPrice,
    };
    navigate(`/ticket`, { state: payloadnav });
    console.log(payloadnav);
  };

  // Kiểm tra nếu movieDetail chưa có dữ liệu
  if (!movieDetail) {
    return <p>Loading...</p>; // Hiển thị Loading khi chưa có dữ liệu
  }

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("vi-VN");
  };
  return (
    <div className="bg-gradient w-full h-screen bg-no-repeat bg-cover flex items-center justify-center">
      <div className="border-white border text-white p-8 rounded-lg max-w-lg mx-auto w-1/2">
        <h2 className="text-2xl font-bold mb-6 font-custom_bold">
          Booking Detail
        </h2>
        <p>Show ID: {bookingInfo.ShowId}</p>
        <div className="mb-6">
          <h3 className="text-lg font-custom">Schedule</h3>
          <div className="mt-4">
            <p>
              <strong>
                Movie Title: <br />
              </strong>{" "}
              {movieDetail.title}
            </p>
            <p>
              <strong>
                Date: <br />
              </strong>{" "}
              {date}
            </p>
            <p>
              <strong>
                Ticket ({seats.length}):
                <br />
              </strong>{" "}
              {seats.join(", ")}
            </p>
            <p>
              <strong>
                Hours:
                <br />
              </strong>{" "}
              {time}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Transaction Detail</h3>
          <div className="mt-4">
            <p className="flex justify-between">
              <span>REGULAR SEAT</span>
              <span>
                {formatCurrency(ticketPrice)} x {seats.length} VND
              </span>
            </p>
            <p className="flex justify-between">
              <span>Service Charge (6%)</span>
              <span>
                {formatCurrency(serviceCharge)} x {seats.length} VND
              </span>
            </p>
          </div>
          <hr className="my-4 border-gray-600" />
          <p className="flex justify-between font-bold">
            <span>Total payment</span>
            <span>{formatCurrency(amount)} VND</span>
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="bg-red-500 text-white py-2 px-6 rounded-lg w-full hover:bg-red-600 transition duration-300"
        >
          Checkout Ticket
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          *Purchased ticket cannot be canceled
        </p>
      </div>
    </div>
  );
};

export default BookingDetail;
