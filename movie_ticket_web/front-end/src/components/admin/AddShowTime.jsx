import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function AddShowTime() {
  const { id } = useParams();
  const [movieTitle, setMovieTitle] = useState("");
  const [price, setPrice] = useState("");
  const [showingSchedule, setShowingSchedule] = useState(""); // Trường ngày chiếu
  const [showTimes, setShowTimes] = useState([]); // Mảng lưu nhiều giờ chiếu
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [theaters, setTheaters] = useState([]); // Lưu danh sách các rạp
  const [selectedTheater, setSelectedTheater] = useState(""); // Rạp đã chọn
  const location = useLocation();
  const title = location.state || {};
  const navigate = useNavigate();
  const handleCancel = () => {
    console.log("Cancel clicked");
    navigate(-1); // Điều hướng trở về trang trước đó
  };

  const handleInsert = async (e) => {
    e.preventDefault();
    const promises = showTimes.map(async (time) => {
      const payload = {
        movie_id: id,
        theater_id: selectedTheater,
        show_date: showingSchedule,
        show_time: time, // Gửi từng giờ chiếu
      };

      console.log("Payload to send:", payload);

      return await axios.post(`http://localhost:3000/api/showtimes`, payload);
    });

    try {
      await Promise.all(promises); // Chờ tất cả các promise hoàn thành
      setSuccessMessage("Show times added successfully!");
      setShowTimes([]);
      setShowingSchedule("");
      setSelectedTheater("");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(
          error.response.data.message || "Failed to add show time"
        );
      } else {
        setErrorMessage("Error during adding show time!");
      }
    }
  };

  const handleAddShowTime = () => {
    setShowTimes([...showTimes, ""]); // Thêm một khung giờ trống vào mảng
  };

  const handleShowTimeChange = (index, value) => {
    const newShowTimes = [...showTimes];
    newShowTimes[index] = value; // Cập nhật giờ chiếu theo chỉ mục
    setShowTimes(newShowTimes);
  };

  const handleRemoveShowTime = (index) => {
    const newShowTimes = showTimes.filter((_, i) => i !== index); // Xóa giờ chiếu theo chỉ mục
    setShowTimes(newShowTimes);
  };

  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/theaters`);
        setTheaters(response.data.data.theaters);
      } catch (error) {
        console.error("Error fetching theaters: ", error);
      }
    };
    fetchTheater();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto border">
      <h2 className="text-2xl font-bold mb-4">Add Show Time</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Select Theater</label>
        <select
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Select a theater</option>
          {theaters.length > 0 ? (
            theaters.map((theater) => (
              <option key={theater.theater_id} value={theater.theater_id}>
                {theater.theater_name}
              </option>
            ))
          ) : (
            <option value="">No theaters available</option>
          )}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Showing Date</label>
        <input
          type="date"
          value={showingSchedule}
          onChange={(e) => setShowingSchedule(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* <div className="mb-4">
        <label className="block text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div> */}

      <div className="mb-4">
        <label className="block text-gray-700">Show Times</label>
        {showTimes.map((time, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="time"
              value={time}
              onChange={(e) => handleShowTimeChange(index, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveShowTime(index)}
              className="ml-2 text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddShowTime}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          Add Show Time
        </button>
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <button
        onClick={handleInsert}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Insert Show Time
      </button>
      <button
        onClick={handleCancel}
        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ml-2"
      >
        Cancel
      </button>
    </div>
  );
}

export default AddShowTime;
