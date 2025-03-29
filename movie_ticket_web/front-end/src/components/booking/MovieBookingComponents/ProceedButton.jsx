import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
const ProceedButton = () => {
  const { id } = useParams();
  const [movieDetail, setMovieDetail] = useState(null);

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

  // Kiểm tra nếu movieDetail chưa có dữ liệu
  if (!movieDetail) {
    return <p>Loading...</p>; // Hiển thị Loading khi chưa có dữ liệu
  }
  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4 text-center items-start w-[250px] ">
      <p className="text-white text-start font-custom_bold text-2xl">
        NINH KIEU
      </p>
      <p className="text-gray-400 text-start font-custom pt-4">
        22 October 2023
      </p>
      <p className="text-gray-400 text-start font-custom">12:40</p>
      <Link to={`/seatselection/${movieDetail.id}`}>
      <button className="mt-4 bg-red-600 text-white w-[200px] px-4 py-2 rounded-md">
        Proceed
      </button>
      </Link>
    </div>
  );
};

export default ProceedButton;
