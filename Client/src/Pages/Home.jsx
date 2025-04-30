import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useUser();
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);

  useEffect(() => {
    fetchSeats();
  }, []);

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

  const getBestSeats = (seats, n) => {
    // Step 1: Filter and sort available seats row-wise and left to right
    const availableSeats = seats
      .filter((seat) => seat.status === "available")
      .sort((a, b) => {
        if (a.row === b.row) {
          return a.seatNumber - b.seatNumber;
        }
        return a.row - b.row;
      });

    const selectedSeats = [];
    for (let seat of availableSeats) {
      selectedSeats.push(seat.seatNumber);
      if (selectedSeats.length === n) break;
    }

    return selectedSeats;
  };

  const handleNumSeatsChange = (e) => {
    setNumSeats(Number(e.target.value));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    const seatNumbers = getBestSeats(seats, numSeats);

    if (seatNumbers.length < numSeats) {
      alert("Not enough available seats.");
      return;
    }
    console.log("Selected Seats:", seatNumbers);

    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        "https://seat-booking-backendsystem.onrender.com/seat/book",
        { seatNumbers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Seats booked successfully!");
      fetchSeats();
    } catch (error) {
      console.error("Error booking seats:", error);
      alert("Failed to book seats.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Seat Booking</h2>
      {user && <p>Welcome, {user.name}!</p>}
      <form onSubmit={handleBooking}>
        <label htmlFor="numSeats">How many seats?</label>
        <input
          id="numSeats"
          type="number"
          min="1"
          value={numSeats}
          onChange={handleNumSeatsChange}
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
