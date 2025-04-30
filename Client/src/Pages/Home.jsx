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

  const handleNumSeatsChange = (e) => {
    setNumSeats(Number(e.target.value));
  };

  return (
    <div className="dashboard">
      <h2>Seat Booking</h2>
      <form>
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
            {seat.seatNumber} {seat.reservedBy === user.userId && "(Your Booking)"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
