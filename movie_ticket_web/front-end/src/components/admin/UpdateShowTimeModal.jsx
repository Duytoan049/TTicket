import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateShowTime = () => {
  const { show_id } = useParams(); // Lấy show_id từ URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    theater_id: "",
    show_date: "",
    show_time: "",
  });

  // Fetch thông tin hiện tại của suất chiếu
  useEffect(() => {
    const fetchShowTime = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/showtime/${show_id}`
        );
        const data = await response.json();

        if (data.status === "success") {
          setFormData({
            theater_id: data.data.theater_id,
            show_date: new Date(data.data.show_date).toISOString().slice(0, 10), // Format ngày
            show_time: data.data.show_time,
          });
        }
      } catch (error) {
        console.error("Error fetching showtime data:", error);
      }
    };

    fetchShowTime();
  }, [show_id]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/showtime/${show_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        alert("Showtime updated successfully!");
        navigate("/"); // Điều hướng về trang danh sách phim hoặc nơi bạn muốn
      } else {
        alert("Failed to update showtime.");
      }
    } catch (error) {
      console.error("Error updating showtime:", error);
      alert("An error occurred while updating the showtime.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Update Showtime</h2>
      <form
        onSubmit={handleUpdate}
        className="max-w-md mx-auto bg-white p-6 shadow-md rounded"
      >
        <div className="mb-4">
          <label
            htmlFor="theater_id"
            className="block text-gray-700 font-medium"
          >
            Theater ID
          </label>
          <input
            type="text"
            id="theater_id"
            name="theater_id"
            value={formData.theater_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="show_date"
            className="block text-gray-700 font-medium"
          >
            Show Date
          </label>
          <input
            type="date"
            id="show_date"
            name="show_date"
            value={formData.show_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="show_time"
            className="block text-gray-700 font-medium"
          >
            Show Time
          </label>
          <input
            type="time"
            id="show_time"
            name="show_time"
            value={formData.show_time}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Showtime
        </button>
      </form>
    </div>
  );
};

export default UpdateShowTime;
