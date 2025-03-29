import { useState, useEffect, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";

function MyTicket() {
  const [userid, setUserId] = useState(null);
  const [ticket, setTicket] = useState([]);
  const [showBarcode, setShowBarcode] = useState({}); // Store barcode visibility for each ticket
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const [ticketsPerPage] = useState(2); // Number of tickets per page
  const barcodeRefs = useRef([]); // Store refs for each barcode

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
          setUserId(response.data.data.user.userId);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userid) return; // Only fetch if userid is set
      try {
        const response = await axios.get(
          `http://localhost:3000/api/myticket?userid=${userid}`
        );
        setTicket(response.data.data.tickets); // Save the tickets array to state
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert(error.response.data.message); // Display error message
          setTimeout(() => {
            window.location.href = error.response.data.redirectTo; // Redirect after 1 second
          }, 1000);
        } else {
          console.error("Error fetching tickets: ", error);
        }
      }
    };

    fetchTickets();
  }, [userid]);

  // Function to format currency to VND
  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("vi-VN");
  };

  // Get current tickets to display on the page
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = ticket.slice(indexOfFirstTicket, indexOfLastTicket);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    // Generate barcode for each ticket when showBarcode is true for that ticket
    ticket.forEach((ticketItem) => {
      if (
        showBarcode[ticketItem.ticket_id] &&
        barcodeRefs.current[ticketItem.ticket_id]
      ) {
        JsBarcode(
          barcodeRefs.current[ticketItem.ticket_id],
          `${ticketItem.ticket_id}`,
          {
            format: "CODE39",
            lineColor: "#000",
            width: 5,
            height: 50,
            displayValue: true,
          }
        );
      }
    });
  }, [ticket, showBarcode]); // Re-run when tickets or barcode visibility state changes

  return (
    <div className="w-full h-screen bg-no-repeat bg-cover flex items-center justify-center">
      <div className="text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 font-custom_bold text-center">
          Your Tickets
        </h2>

        <div className="flex flex-wrap space-x-2">
          {currentTickets.length > 0 ? (
            currentTickets.map((ticketItem) => (
              <div
                key={ticketItem.ticket_id}
                className="border-white border text-white p-8 rounded-lg w-[500px] mb-4"
              >
                <p>
                  <strong>Ticket ID: </strong>
                  {ticketItem.ticket_id}
                </p>
                <div className="mt-2">
                  <p>
                    <strong>Movie Title: </strong>
                    {ticketItem.movie_name}
                  </p>
                  <p>
                    <strong>Seat Number: </strong>
                    {ticketItem.seat_number}
                  </p>
                  <p>
                    <strong>Price: </strong>
                    {formatCurrency(ticketItem.price)} VND
                  </p>
                  <p>
                    <strong>Theater: </strong>
                    {ticketItem.theater_name}
                  </p>
                  <p>
                    <strong>Location: </strong>
                    {ticketItem.location}
                  </p>
                  <p>
                    <strong>Show Date: </strong>
                    {new Date(ticketItem.show_date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Show Time: </strong>
                    {ticketItem.show_time}
                  </p>
                  <p>
                    <strong>Purchase Date: </strong>
                    {new Date(ticketItem.purchase_date).toLocaleString()}
                  </p>
                </div>

                {/* Show Barcode button */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() =>
                      setShowBarcode((prev) => ({
                        ...prev,
                        [ticketItem.ticket_id]: !prev[ticketItem.ticket_id], // Toggle barcode visibility for this ticket
                      }))
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    {showBarcode[ticketItem.ticket_id]
                      ? "Hide Barcode"
                      : "Show Barcode"}
                  </button>
                </div>

                {/* Barcode SVG will be displayed when showBarcode is true */}
                {showBarcode[ticketItem.ticket_id] && (
                  <div
                    className={`flex justify-center mt-4 barcode-container ${
                      showBarcode[ticketItem.ticket_id] ? "show" : ""
                    }`}
                  >
                    <svg
                      ref={(el) =>
                        (barcodeRefs.current[ticketItem.ticket_id] = el)
                      }
                    ></svg>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No tickets found for this user.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * ticketsPerPage >= ticket.length}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
          >
            Next
          </button>
        </div>

        <div className="mt-6">
          <hr className="my-4 border-gray-600" />
          <p className="text-center text-sm text-gray-400">
            Use the barcode above to exchange your ticket at the counter
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyTicket;
