import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import JsBarcode from "jsbarcode";
import { useNavigate } from "react-router-dom";
function Ticket() {
  const location = useLocation();
  const bookingInfo = location.state || {};
  const id = bookingInfo.user_id;
  const seats = bookingInfo.seats || [];
  const [ticket, getTicket] = useState([]);
  const barcodeRef = useRef(null); // Tham chiếu đến thẻ SVG để hiển thị mã Code 39
  const navigate = useNavigate(); // Khởi tạo hàm navigate
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/ticket?userid=${id}`
        );
        const data = await response.json();
        getTicket(data.data.ticket);
        console.log(data.data.ticket);
      } catch (error) {
        console.error("Error fetching Ticket: ", error);
      }
    };
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("vi-VN");
  };

  const lastTicket = ticket[ticket.length - 1];

  useEffect(() => {
    // Chỉ render mã Code 39 khi đã có thông tin ticket
    if (lastTicket && barcodeRef.current) {
      JsBarcode(barcodeRef.current, `${lastTicket.ticket_id}`, {
        format: "CODE39",
        lineColor: "#000",
        width: 5,
        height: 50,
        displayValue: true,
      });
    }
  }, [lastTicket]);

  return (
    <div className="bg-gradient w-full h-screen bg-no-repeat bg-cover flex items-center justify-center">
      <div className="border-white border text-white p-8 rounded-lg max-w-lg mx-auto w-1/2">
        <h2 className="text-2xl font-bold mb-6 font-custom_bold">
          Ticket Detail
        </h2>
        <div className="mb-6">
          <p>
            <strong>
              Ticket ID: <br />
            </strong>
            {lastTicket ? lastTicket.ticket_id : "N/A"}
          </p>
          <div className="mt-4">
            <p>
              <strong>
                Movie Title: <br />
              </strong>
              {bookingInfo.title}
            </p>
            <p>
              <strong>
                Date: <br />
              </strong>
              {bookingInfo.date}
            </p>
            <p>
              <strong>
                Ticket ({seats.length}):
                <br />
              </strong>
              {seats.join(", ")}
            </p>
            <p>
              <strong>
                Hours:
                <br />
              </strong>
              {bookingInfo.time}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <hr className="my-4 border-gray-600" />
          <p className="flex justify-between font-bold">
            <span>Total payment</span>
            <span>
              {formatCurrency(
                lastTicket ? lastTicket.price : bookingInfo.price
              )}{" "}
              VND
            </span>
          </p>
        </div>

        <p className="mt-4 text-sm text-center text-gray-400">
          Use the code below to exchange your ticket at the counter
        </p>

        {lastTicket && (
          <div className="flex justify-center">
            <svg ref={barcodeRef}></svg> {/* Hiển thị mã Code 39 */}
          </div>
        )}
        <p className="mt-4 text-sm text-center text-gray-400">
          *Purchased ticket cannot be canceled
        </p>
        <button
          className="mt-4 text-xl text-center w-full bg-white rounded-xl h-10 text-black"
          onClick={() => navigate("/")}
        >
          Back to homepage
        </button>
      </div>
    </div>
  );
}

export default Ticket;
