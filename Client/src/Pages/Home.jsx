import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/userContext";

const Home = () => {
  const { user, logout } = useUser();
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

  function getBestSeats(seats, numRequested) {
    const rows = {};
    for (let seat of seats) {
      if (seat.status === "available") {
        if (!rows[seat.row]) {
          rows[seat.row] = [];
        }
        rows[seat.row].push(seat);
      }
    }

    Object.keys(rows).forEach((rowNum) => {
      rows[rowNum].sort((a, b) => a.seatNumber - b.seatNumber);
    });

    for (let rowNum of Object.keys(rows).sort((a, b) => a - b)) {
      const availableSeats = rows[rowNum];
      let start = 0;

      while (start <= availableSeats.length - numRequested) {
        const block = availableSeats.slice(start, start + numRequested);
        const isContiguous = block.every((seat, i) => {
          if (i === 0) return true;
          return seat.seatNumber === block[i - 1].seatNumber + 1;
        });

        if (isContiguous) {
          return block.map((s) => s.seatNumber);
        }

        start++;
      }
    }

    let bestSeats = [];
    for (let rowNum of Object.keys(rows).sort((a, b) => a - b)) {
      const availableSeats = rows[rowNum];
      let start = 0;

      while (start < availableSeats.length && bestSeats.length < numRequested) {
        let tempBlock = [availableSeats[start]];
        let i = start + 1;

        while (
          i < availableSeats.length &&
          availableSeats[i].seatNumber ===
            availableSeats[i - 1].seatNumber + 1 &&
          tempBlock.length < numRequested - bestSeats.length
        ) {
          tempBlock.push(availableSeats[i]);
          i++;
        }

        bestSeats.push(...tempBlock);
        start = i;
      }

      if (bestSeats.length >= numRequested) break;
    }

    return bestSeats.map((s) => s.seatNumber);
  }

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

  const handleLogout = () => {
    logout();
  };
  const handleReset = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        "https://seat-booking-backendsystem.onrender.com/seat/reset-booking",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("All bookings have been reset successfully.");
      fetchSeats();
    } catch (error) {
      console.error("Error resetting bookings:", error);
      alert("Failed to reset bookings.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Seat Booking</h2>

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
      <footer>
        <button onClick={handleLogout}>LogOut</button>
        <button onClick={handleReset}>Reset Bookings</button>
      </footer>
    </div>
  );
};

export default Home;
