CAR SERVICE MANAGEMENT SYSTEM
A web-based application where customers can book car services and mechanics can manamanage those bookings.
It allows users to signup, add their vehicles, book service appointments, view the progress of the services

Features:
    Authentication System: Secure signup and login functionality using password hasing
    Booking System: Customer can book service appointments
    Mechanic Dashboard: Mechanics can view, accept and manage their bookings
    Role Based Access: Separate dashboards and functionalities for customers and mechanics.
    Service Status Tracking: Customers can track the progress of their car services.

Tech Stack:
    Frontend: HTML, CSS, JavaScript
    Backend: Node.js with Express
    Database: MySQL (hosted on Microsoft Azure Cloud)
    Authentication & Encryption: bcrypt

Project Structure:
    server.js: Contains all the backend routes and server logic
    passwordHash.js: Handles password encryption and verification
    .env.example: Example of the required environment variables for setup
    db.sql: SQL file for initializing the database schema

Database Schema Overview:
    users: Stores customer and mechanic information (with role indicator)
    vehicles: Contains data about customer-owned vehicles
    services: Details available service types, their descriptions and prices
    mechanics: Information about service mechanics
    bookings: Holds appointment records and service statuses

    The MySQL database is hosted on Microsoft Azure Cloud

Installation and SetUp
1. Clone the repositary
    Command: git clone <repository_url>
2. Install dependencies
    Command: npm install
3. Configure environment variables
    rename .env.example to .env and fill the given variables with your Azure MySQL credentials:
4. Start the server
    Command: node server.js
5. Access the app 
    Open your browser and go to http://localhost:3000.