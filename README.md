CAR SERVICE MANAGEMENT SYSTEM <br/>
A web-based application where customers can book car services and mechanics can manamanage those bookings.
It allows users to signup, add their vehicles, book service appointments, view the progress of the services
<br/>
FEATURES: <br/>
Authentication System: Secure signup and login functionality using password hasing <br/>
Booking System: Customer can book service appointments <br/>
Mechanic Dashboard: Mechanics can view, accept and manage their bookings <br/>
Role Based Access: Separate dashboards and functionalities for customers and mechanics. <br/>
Service Status Tracking: Customers can track the progress of their car services. <br/>

<br/>
TECH STACK: <br/>
Frontend: HTML, CSS, JavaScript <br/>
Backend: Node.js with Express <br/>
Database: MySQL (hosted on Microsoft Azure Cloud) <br/>
Authentication & Encryption: bcrypt <br/>

<br/>
Project Structure:<br/>
server.js: Contains all the backend routes and server logic <br/>
passwordHash.js: Handles password encryption and verification<br/>
.env.example: Example of the required environment variables for setup<br/>
db.sql: SQL file for initializing the database schema<br/>

<br/>
Database Schema Overview:<br/>
    users: Stores customer and mechanic information (with role indicator)<br/>
    vehicles: Contains data about customer-owned vehicles<br/>
    services: Details available service types, their descriptions and prices<br/>
    mechanics: Information about service mechanics<br/>
    bookings: Holds appointment records and service statuses<br/>
    The MySQL database is hosted on Microsoft Azure Cloud<br/>

<br/>
Installation and SetUp<br/>
1. Clone the repositary<br/>
    Command: git clone <repository_url><br/>
2. Install dependencies<br/>
    Command: npm install<br/>
3. Configure environment variables<br/>
    rename .env.example to .env and fill the given variables with your Azure MySQL credentials:<br/>
4. Start the server<br/>
    Command: node server.js<br/>
5. Access the app <br/>
    Open your browser and go to http://localhost:3000.<br/>
