# Seat Booking System - MERN Application

This is a full-stack seat booking application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows authenticated users to view available seats for various events or venues and book seats, with an algorithm that attempts to group their selected seats together.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Configuration](#configuration)
* [Running the Application](#running-the-application)
* [API Endpoints](#api-endpoints)
* [Database Schema](#database-schema)
* [Seat Grouping Algorithm](#seat-grouping-algorithm)
* [Authentication and Authorization](#authentication-and-authorization)
* [Contributing](#contributing)
* [License](#license)

## Features

**User Features:**

* **View Seat Availability:** See a visual representation of the seating arrangement, indicating available and booked seats.
* **Select Seats:** Choose one or multiple available seats.
* **Intelligent Seat Allocation:** The system attempts to book the user's selected seats in a contiguous and close manner.
* **Booking Confirmation:** Receive confirmation details after a successful booking.
* **User Authentication:** Secure user accounts for booking and managing their information.
* **User Authorization:** Users can only manage their own bookings.

## Technologies Used

* **Frontend:**
    * [React](https://react.dev/): A JavaScript library for building user interfaces.
    * [Context API](https://react.dev/learn/passing-data-deeply-with-context): For state management.
    * [React Router](https://reactrouter.com/en/main): For client-side routing.
    * [Axios](https://axios-http.com/): For making HTTP requests to the backend.
    * [Styled Components](https://styled-components.com/) or [CSS Modules](https://github.com/css-modules/css-modules): For styling.
* **Backend:**
    * [Node.js](https://nodejs.org/): A JavaScript runtime environment.
    * [Express.js](https://expressjs.com/): A minimalist and flexible Node.js web application framework.
    * [Mongoose](https://mongoosejs.com/): An elegant MongoDB object modeling for Node.js.
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For creating and verifying JWTs for authentication.
    * [bcrypt](https://www.npmjs.com/package/bcrypt): For password hashing.
* **Database:**
    * [MongoDB](https://www.mongodb.com/): A NoSQL document database.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* [Node.js](https://nodejs.org/) (version >= 18.x recommended)
* [npm](https://www.npmjs.com/) (usually installed with Node.js) or [yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud instance)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/programm3d/Seat-Booking-System.git
    cd Seat-Booking-System
    ```

2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install  
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../client
    npm install  
    ```

## Configuration

1.  **Backend Configuration:**
    * Create a `.env` file in the `backend` directory based on the `.env.example` file.
    * Configure the following environment variables:
        ```env
        PORT=5000  # Server port
        MONGODB_URI=mongodb://localhost:27017/seatbookingdb  # MongoDB connection URI
        JWT_SECRET=your_secret_key_for_jwt  # Secret key for JSON Web Tokens
        ```


## Running the Application

1.  **Start the backend server:**
    ```bash
    cd server
    node server.js 
    ```
    The backend server will typically run on `http://localhost:8080`.

2.  **Start the frontend development server:**
    ```bash
    cd client
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:3000`.

3.  **Access the application:** Open your web browser and navigate to `http://localhost:3000`.


## Seat Grouping Algorithm

When a user attempts to book multiple seats, the backend will employ an algorithm to try and allocate the selected seats in a contiguous and close manner. The algorithm might consider factors such as:

1.  **Proximity:** Prioritizing available seats that are adjacent (horizontally or vertically) to each other.
2.  **User Selection:** Respecting the user's initial seat selections as much as possible.
3.  **Availability:** Only considering currently unbooked seats.

**Note:** The specific implementation details of this algorithm will be in the backend booking logic. It might involve searching for clusters of available seats that best fit the user's request.

## Authentication and Authorization

* **Authentication:** Users are required to register and log in to book seats and manage their bookings. This is implemented using JSON Web Tokens (JWTs). Upon successful login, the user receives a JWT that must be included in the headers of subsequent requests for protected routes.
* **Authorization:** The backend implements authorization to ensure that users can only access and manage their own booking data. This is typically done by verifying the JWT and comparing the user ID in the token with the user ID associated with the requested resource (e.g., a specific booking).

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a pull request.

Please ensure your code follows the project's coding style and includes appropriate tests.
