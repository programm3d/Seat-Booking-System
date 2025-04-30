import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";

const Home = () => {
  const { user } = useUser();
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          "https://seat-booking-backendsystem.onrender.com/seat/all-seats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSeats(response.data);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, []);

//   const selectBestSeats = (seats, numSeats) => {
//     const availableSeats = seats.filter((seat) => seat.status === "available");

//     for (let row = 1; row <= 5; row++) {
//       const rowSeats = availableSeats.filter((seat) => seat.row === row);

//       for (let i = 0; i <= rowSeats.length - numSeats; i++) {
//         const possibleSeats = rowSeats.slice(i, i + numSeats);
//         if (possibleSeats.length === numSeats) {
//           return possibleSeats; // Return the closest available seats in the same row
//         }
//       }
//     }

//     return availableSeats.slice(0, numSeats); // If perfect adjacency isn't possible, return the first available seats
//   };

//   const bookSeats = async (event) => {
//     event.preventDefault();
//     const selectedSeats = selectBestSeats(seats, numSeats);

//     if (selectedSeats.length < numSeats) {
//       alert("Not enough adjacent seats available.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("jwt");
//       await axios.post(
//         "https://seat-booking-backendsystem.onrender.com/seat/book",
//         {
//           userId: user.userId,
//           seatIds: selectedSeats.map((seat) => seat._id),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const updatedSeats = await axios.get(
//         "https://seat-booking-backendsystem.onrender.com/seat/all-seats",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setSeats(updatedSeats.data);
//     } catch (error) {
//       console.error("Error booking seats:", error);
//     }
//   };

  return (
    <div className="dashboard">
      <h2>Seat Booking</h2>
      <form onSubmit={bookSeats}>
        <label>How many seats?</label>
        <input
          type="number"
          min="1"
          value={numSeats}
          onChange={(e) => setNumSeats(Number(e.target.value))}
        />
        <button type="submit">Book Seats</button>
      </form>

      <div className="seating-layout">
        {seats.map((seat) => (
          <div key={seat._id} className={`seat ${seat.status}`}>
            {seat.seatNumber}{" "}
            {seat.reservedBy === user.userId && "(Your Booking)"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
