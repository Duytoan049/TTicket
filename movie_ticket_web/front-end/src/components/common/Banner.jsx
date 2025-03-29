const Banner = () => {
  return (
    <div>
      <div className="bg-cover bg-center h-screen w-full bg-no-repeat bg-banner">
        <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-40"></div>
        <div className=" w-full h-full flex pt-[15%] pl-[10%]  space-x-[30px]">
          <div className="text-stone-50 font-custom text-sm z-10 flex flex-col">
            <div className="text-5xl leading-[50px]">
              <p>Spider man</p>
              <p>No Way Home</p>
            </div>
            <p className="text-sm font-custom1 text-stone-300 pb-2">
              2021 | 1 hour 55 minutes | Sci-fi{" "}
            </p>
            <p className="text-sm font-sans w-[35%] leading-7">
              Spider-Man: No Way Home sees Peter Parker battling villains from
              across the multiverse after his identity is revealed. With reality
              at stake, he must team up with surprising allies in this thrilling
              action-packed adventure....{" "}
              <a href="#" className="text-red-500 hover:underline">
                See more
              </a>
            </p>
            <div className="mt-7 space-x-6">
              <button className="font-custom1 h-12 w-32 text-base border border-white text-stone-300 hover:bg-white hover:text-black rounded-lg duration-200 ease-in-out">
                Watch trailer
              </button>
              <button className="font-custom1 h-12 w-32 text-base bg-red-600 text-white hover:bg-red-700 hover:text-black rounded-lg duration-200 ease-in-out">
              Booking now 
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const Banner = () => {
//   const [movieDetail, setMovieDetail] = useState(null);
//   const [id, setId] = useState(""); // State để lưu trữ id nhập vào
//   const [inputId, setInputId] = useState(""); // State để lưu trữ id từ ô input

//   const fetchMovieDetail = async (movieId) => {
//     const options = {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//         Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
//       },
//     };
//     const response = await fetch(
//       `https://api.themoviedb.org/3/movie/${movieId}?language=vi-VN&region=VN`,
//       options
//     );
//     const data = await response.json();
//     setMovieDetail(data);
//   };

//   useEffect(() => {
//     if (id) {
//       fetchMovieDetail(id); // Gọi hàm fetchMovieDetail khi id được thay đổi
//     }
//   }, [id]);

//   const handleSearch = () => {
//     setId(inputId); // Khi người dùng nhấn nút, id từ input sẽ được lưu vào state 'id'
//   };

//   return (
//     <div>
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Enter movie ID"
//           value={inputId}
//           onChange={(e) => setInputId(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg"
//         />
//         <button
//           onClick={handleSearch}
//           className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
//         >
//           Search
//         </button>
//       </div>

//       {movieDetail && (
//         <div
//           className="bg-cover bg-center h-screen w-full bg-no-repeat relative"
//           style={{
//             backgroundImage: `url(${import.meta.env.VITE_IMG_URL_PRO}${movieDetail.backdrop_path})`,
//           }}
//         >
//           <div className="absolute w-full h-full top-0 left-0 bg-black bg-opacity-40"></div>
//           <div className="w-full h-full flex pt-[15%] pl-[10%] space-x-[30px]">
//             <div className="text-stone-50 font-custom text-sm z-10 flex flex-col">
//               <div className="text-5xl leading-[50px]">
//                 <p>{movieDetail.title}</p>
//               </div>
//               <p className="text-sm font-custom1 text-stone-300 pb-2">
//                 {movieDetail.release_date} | {`${Math.floor(movieDetail.runtime / 60)}h ${movieDetail.runtime % 60}m`} |{" "}
//                 {movieDetail.genres.map((genre) => genre.name).join(", ")}
//               </p>
//               <p className="text-sm font-sans w-[35%] leading-7">
//                 {movieDetail.overview.length > 150
//                   ? `${movieDetail.overview.slice(0, 150)}...`
//                   : movieDetail.overview}{" "}
//                 <a href="#" className="text-red-500 hover:underline">
//                   See more
//                 </a>
//               </p>
//               <div className="mt-7 space-x-6">
//                 <button className="font-custom1 h-12 w-32 text-base border border-white text-stone-300 hover:bg-white hover:text-black rounded-lg duration-200 ease-in-out">
//                   Watch trailer
//                 </button>
//                 <button className="font-custom1 h-12 w-32 text-base bg-red-600 text-white hover:bg-red-700 hover:text-black rounded-lg duration-200 ease-in-out">
//                   Booking now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
export default Banner;
