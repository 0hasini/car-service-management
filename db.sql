CREATE DATABASE car;
USE car;

-- Customers Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    Fname VARCHAR(30) NOT NULL,
    Lname VARCHAR(30) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    street_no VARCHAR(5),
    street_name VARCHAR(50),
    building_name VARCHAR(50),
    city VARCHAR(30),
    state VARCHAR(30),
    pincode VARCHAR(10),
    role ENUM('Customer', 'Mechanic') NOT NULL
);

-- Vehicles Table of Customers
CREATE TABLE Vehicles (
    reg_no VARCHAR(10) PRIMARY KEY,
    customer_id INT,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    reg_year VARCHAR(4) NOT NULL,
    variant ENUM('Petrol', 'Diesel', 'Electric') NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Mechanics Table
CREATE TABLE Mechanics (
    mechanic_id INT PRIMARY KEY,
    specialization ENUM('Oil Change', 'Tire Rotation', 'Major Repair') NOT NULL,
    FOREIGN KEY (mechanic_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Services Table
CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_name ENUM('Oil Change', 'Tire Rotation', 'Major Repair') NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL
);

-- Bookings Table
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    reg_no VARCHAR(10),
    service_id INT,
    mechanic_id INT,
    service_date DATE NOT NULL,
    time_slot ENUM('Morning', 'Afternoon', 'Evening') NOT NULL,
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    pickup_option BOOLEAN DEFAULT FALSE COMMENT 'Whether customer requested pickup service',
    special_request TEXT,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reg_no) REFERENCES Vehicles(reg_no) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE,
    FOREIGN KEY (mechanic_id) REFERENCES users(user_id) ON DELETE SET NULL
);
-- Insert services
INSERT INTO Services (service_name, description, price) VALUES
('Oil Change', 'Standard oil change with filter replacement', 1499.00),
('Tire Rotation', 'Rotation of all four tires for even wear', 899.00),
('Major Repair', 'Diagnostic and repair of major mechanical issues', 4999.00);


INSERT INTO users (Fname, Lname, username, password, phone_number, email, street_no, street_name, city, state, pincode, role) VALUES
('Rahul', 'Sharma', 'rahulsh', 'hashedpass1', '+919876543210', 'rahul.sharma@email.com', '12', 'MG Road', 'Mumbai', 'Maharashtra', '400001', 'Customer'),
('Priya', 'Patel', 'priyap', 'hashedpass2', '+919876543211', 'priya.patel@email.com', '34', 'Brigade Road', 'Bangalore', 'Karnataka', '560001', 'Customer'),
('Aarav', 'Singh', 'aaravs', 'hashedpass3', '+919876543212', 'aarav.singh@email.com', '56', 'Park Street', 'Kolkata', 'West Bengal', '700016', 'Customer'),
('Ananya', 'Gupta', 'ananyag', 'hashedpass4', '+919876543213', 'ananya.gupta@email.com', '78', 'Connaught Place', 'Delhi', 'Delhi', '110001', 'Customer'),
('Vihaan', 'Kumar', 'vihaank', 'hashedpass5', '+919876543214', 'vihaan.kumar@email.com', '90', 'Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 'Customer'),
('Ishaan', 'Verma', 'ishaanv', 'hashedpass6', '+919876543215', 'ishaan.verma@email.com', '23', 'Baner Road', 'Pune', 'Maharashtra', '411045', 'Customer'),
('Aditi', 'Joshi', 'aditij', 'hashedpass7', '+919876543216', 'aditi.joshi@email.com', '45', 'Gomti Nagar', 'Lucknow', 'Uttar Pradesh', '226010', 'Customer'),
('Kabir', 'Malhotra', 'kabirm', 'hashedpass8', '+919876543217', 'kabir.malhotra@email.com', '67', 'Salt Lake', 'Kolkata', 'West Bengal', '700091', 'Customer'),
('Diya', 'Reddy', 'diyar', 'hashedpass9', '+919876543218', 'diya.reddy@email.com', '89', 'Banjara Hills', 'Hyderabad', 'Telangana', '500034', 'Customer'),
('Arjun', 'Mehta', 'arjunm', 'hashedpass10', '+919876543219', 'arjun.mehta@email.com', '11', 'Koramangala', 'Bangalore', 'Karnataka', '560034', 'Customer'),
('Myra', 'Choudhary', 'myrac', 'hashedpass11', '+919876543220', 'myra.choudhary@email.com', '22', 'Viman Nagar', 'Pune', 'Maharashtra', '411014', 'Customer'),
('Reyansh', 'Agarwal', 'reyansha', 'hashedpass12', '+919876543221', 'reyansh.agarwal@email.com', '33', 'Sector 18', 'Noida', 'Uttar Pradesh', '201301', 'Customer'),
('Anika', 'Iyer', 'anikai', 'hashedpass13', '+919876543222', 'anika.iyer@email.com', '44', 'Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Customer'),
('Advait', 'Nair', 'advaitn', 'hashedpass14', '+919876543223', 'advait.nair@email.com', '55', 'Bodakdev', 'Ahmedabad', 'Gujarat', '380054', 'Customer'),
('Kiara', 'Saxena', 'kiaras', 'hashedpass15', '+919876543224', 'kiara.saxena@email.com', '66', 'Vaishali Nagar', 'Jaipur', 'Rajasthan', '302021', 'Customer');


INSERT INTO users (Fname, Lname, username, password, phone_number, email, street_no, street_name, city, state, pincode, role) VALUES
('Rajesh', 'Yadav', 'rajeshym', 'mechpass1', '+919876543225', 'rajesh.yadav@email.com', '77', 'Marine Lines', 'Mumbai', 'Maharashtra', '400002', 'Mechanic'),
('Suresh', 'Khan', 'sureshkm', 'mechpass2', '+919876543226', 'suresh.khan@email.com', '88', 'Frazer Town', 'Bangalore', 'Karnataka', '560005', 'Mechanic'),
('Vijay', 'Naidu', 'vijaynm', 'mechpass3', '+919876543227', 'vijay.naidu@email.com', '99', 'Rash Behari Ave', 'Kolkata', 'West Bengal', '700029', 'Mechanic'),
('Harish', 'Pillai', 'harishpm', 'mechpass4', '+919876543228', 'harish.pillai@email.com', '10', 'Lajpat Nagar', 'Delhi', 'Delhi', '110024', 'Mechanic'),
('Mahesh', 'Rao', 'maheshrm', 'mechpass5', '+919876543229', 'mahesh.rao@email.com', '20', 'Gachibowli', 'Hyderabad', 'Telangana', '500032', 'Mechanic'),
('Prakash', 'Mishra', 'prakashmm', 'mechpass6', '+919876543230', 'prakash.mishra@email.com', '30', 'Kothrud', 'Pune', 'Maharashtra', '411038', 'Mechanic'),
('Dinesh', 'Chauhan', 'dineshcm', 'mechpass7', '+919876543231', 'dinesh.chauhan@email.com', '40', 'Hazratganj', 'Lucknow', 'Uttar Pradesh', '226001', 'Mechanic'),
('Ramesh', 'Shetty', 'rameshsm', 'mechpass8', '+919876543232', 'ramesh.shetty@email.com', '50', 'New Town', 'Kolkata', 'West Bengal', '700156', 'Mechanic'),
('Ganesh', 'Venkatesh', 'ganeshvm', 'mechpass9', '+919876543233', 'ganesh.venkatesh@email.com', '60', 'Madhapur', 'Hyderabad', 'Telangana', '500081', 'Mechanic'),
('Manoj', 'Bose', 'manojbm', 'mechpass10', '+919876543234', 'manoj.bose@email.com', '70', 'Indiranagar', 'Bangalore', 'Karnataka', '560038', 'Mechanic'),
('Sunil', 'Desai', 'sunildm', 'mechpass11', '+919876543235', 'sunil.desai@email.com', '80', 'Kalyani Nagar', 'Pune', 'Maharashtra', '411006', 'Mechanic'),
('Anil', 'Trivedi', 'aniltm', 'mechpass12', '+919876543236', 'anil.trivedi@email.com', '90', 'Sector 62', 'Noida', 'Uttar Pradesh', '201309', 'Mechanic'),
('Vinod', 'Menon', 'vinodmm', 'mechpass13', '+919876543237', 'vinod.menon@email.com', '100', 'T Nagar', 'Chennai', 'Tamil Nadu', '600017', 'Mechanic'),
('Sanjay', 'Pillai', 'sanjaypm', 'mechpass14', '+919876543238', 'sanjay.pillai@email.com', '110', 'Satellite', 'Ahmedabad', 'Gujarat', '380015', 'Mechanic'),
('Nitin', 'Chawla', 'nitincm', 'mechpass15', '+919876543239', 'nitin.chawla@email.com', '120', 'Tonk Road', 'Jaipur', 'Rajasthan', '302018', 'Mechanic');


INSERT INTO Mechanics (mechanic_id, specialization) VALUES
(16, 'Oil Change'),
(17, 'Tire Rotation'),
(18, 'Major Repair'),
(19, 'Oil Change'),
(20, 'Tire Rotation'),
(21, 'Major Repair'),
(22, 'Oil Change'),
(23, 'Tire Rotation'),
(24, 'Major Repair'),
(25, 'Oil Change'),
(26, 'Tire Rotation'),
(27, 'Major Repair'),
(28, 'Oil Change'),
(29, 'Tire Rotation'),
(30, 'Major Repair');


INSERT INTO Vehicles (reg_no, customer_id, brand, model, reg_year, variant) VALUES
('MH01AB1234', 1, 'Maruti Suzuki', 'Swift', '2018', 'Petrol'),
('KA02CD5678', 2, 'Hyundai', 'Creta', '2020', 'Diesel'),
('WB03EF9012', 3, 'Tata', 'Nexon', '2019', 'Diesel'),
('DL04GH3456', 4, 'Honda', 'City', '2021', 'Petrol'),
('TS05IJ7890', 5, 'Toyota', 'Innova', '2017', 'Diesel'),
('MH06KL2345', 6, 'Mahindra', 'Scorpio', '2020', 'Diesel'),
('UP07MN6789', 7, 'Kia', 'Seltos', '2021', 'Petrol'),
('WB08OP0123', 8, 'Volkswagen', 'Polo', '2018', 'Petrol'),
('TS09QR4567', 9, 'Hyundai', 'Verna', '2019', 'Diesel'),
('KA10ST8901', 10, 'Maruti Suzuki', 'Baleno', '2020', 'Petrol'),
('MH11UV2345', 11, 'Tata', 'Harrier', '2021', 'Diesel'),
('UP12WX6789', 12, 'Honda', 'Amaze', '2019', 'Petrol'),
('TN13YZ0123', 13, 'Toyota', 'Fortuner', '2020', 'Diesel'),
('GJ14AB4567', 14, 'Kia', 'Sonet', '2021', 'Petrol'),
('RJ15CD8901', 15, 'Mahindra', 'Thar', '2020', 'Diesel'),
('MH01EF2345', 1, 'Hyundai', 'i20', '2019', 'Petrol'),
('KA02GH6789', 2, 'Maruti Suzuki', 'Dzire', '2018', 'Petrol'),
('WB03IJ0123', 3, 'Tata', 'Altroz', '2021', 'Petrol'),
('DL04KL4567', 4, 'Honda', 'Jazz', '2020', 'Petrol'),
('TS05MN8901', 5, 'Toyota', 'Glanza', '2019', 'Petrol');


INSERT INTO Bookings (customer_id, reg_no, service_id, mechanic_id, service_date, time_slot, status, special_request, pickup_option) VALUES
(1, 'MH01AB1234', 1, 16, '2025-01-15', 'Morning', 'Completed', 'Please check brakes also', TRUE),
(2, 'KA02CD5678', 2, 17, '2025-01-20', 'Afternoon', 'Completed', 'Need nitrogen filling', FALSE),
(3, 'WB03EF9012', 3, 18, '2025-02-05', 'Evening', 'Completed', 'Check engine noise', TRUE),
(4, 'DL04GH3456', 1, 19, '2025-02-10', 'Morning', 'Completed', 'Synthetic oil only', FALSE),
(5, 'TS05IJ7890', 2, 20, '2025-02-15', 'Afternoon', 'Completed', 'Balance wheels', TRUE),
(6, 'MH06KL2345', 3, 21, '2025-02-20', 'Evening', 'Completed', 'AC not cooling', FALSE),
(7, 'UP07MN6789', 1, 22, '2025-03-01', 'Morning', 'Completed', 'Regular service', TRUE),
(8, 'WB08OP0123', 2, 23, '2025-03-05', 'Afternoon', 'Completed', NULL, FALSE),
(9, 'TS09QR4567', 3, 24, '2025-03-10', 'Evening', 'Completed', 'Check suspension', TRUE),
(10, 'KA10ST8901', 1, 25, '2025-03-15', 'Morning', 'Completed', 'Full checkup', FALSE),
(11, 'MH11UV2345', 2, 26, '2025-03-20', 'Afternoon', 'Completed', 'Alignment needed', TRUE),
(12, 'UP12WX6789', 3, 27, '2025-03-25', 'Evening', 'Completed', 'Engine warning light', FALSE),
(13, 'TN13YZ0123', 1, 28, '2025-03-27', 'Morning', 'In Progress', NULL, TRUE),
(14, 'GJ14AB4567', 2, 29, '2025-03-28', 'Afternoon', 'In Progress', 'Tire pressure low', FALSE),
(15, 'RJ15CD8901', 3, 30, '2025-03-29', 'Evening', 'In Progress', 'Oil leak check', TRUE),
(1, 'MH01EF2345', 1, 16, '2025-03-30', 'Morning', 'Pending', 'Quick service', FALSE),
(2, 'KA02GH6789', 2, 17, '2025-03-31', 'Afternoon', 'Pending', NULL, TRUE),
(3, 'WB03IJ0123', 3, 18, '2025-01-10', 'Evening', 'Completed', 'Urgent repair', FALSE),
(4, 'DL04KL4567', 1, 19, '2025-01-25', 'Morning', 'Completed', 'First service', TRUE),
(5, 'TS05MN8901', 2, 20, '2025-02-28', 'Afternoon', 'Completed', 'Winter tires', FALSE),
(6, 'MH06KL2345', 3, 21, '2025-03-03', 'Evening', 'Completed', 'Check transmission', TRUE),
(7, 'UP07MN6789', 1, 22, '2025-03-12', 'Morning', 'In Progress', NULL, FALSE),
(8, 'WB08OP0123', 2, 23, '2025-03-18', 'Afternoon', 'In Progress', 'Wheel balancing', TRUE),
(9, 'TS09QR4567', 3, 24, '2025-03-22', 'Evening', 'Pending', 'AC gas refill', FALSE),
(10, 'KA10ST8901', 1, 25, '2025-04-05', 'Morning', 'Pending', 'Regular maintenance', TRUE),
(11, 'MH11UV2345', 2, 26, '2025-04-10', 'Afternoon', 'Pending', 'Tire replacement', FALSE),
(12, 'UP12WX6789', 3, 27, '2025-04-15', 'Evening', 'Pending', 'Engine tune-up', TRUE),
(13, 'TN13YZ0123', 1, 28, '2025-04-20', 'Morning', 'Pending', 'Oil leak fix', FALSE),
(14, 'GJ14AB4567', 2, 29, '2025-04-25', 'Afternoon', 'Pending', NULL, TRUE),
(15, 'RJ15CD8901', 3, 30, '2025-05-01', 'Evening', 'Pending', 'Major service', FALSE),
(1, 'MH01AB1234', 1, 16, '2025-05-05', 'Morning', 'Pending', 'Check battery', TRUE),
(2, 'KA02CD5678', 2, 17, '2025-05-10', 'Afternoon', 'Pending', 'Tire rotation', FALSE),
(3, 'WB03EF9012', 3, 18, '2025-05-15', 'Evening', 'Pending', 'Brake pads', TRUE),
(4, 'DL04GH3456', 1, 19, '2025-05-20', 'Morning', 'Pending', 'Coolant change', FALSE),
(5, 'TS05IJ7890', 2, 20, '2025-06-01', 'Afternoon', 'Pending', 'Wheel alignment', TRUE),
(6, 'MH06KL2345', 3, 21, '2025-06-05', 'Evening', 'Pending', 'Engine diagnostics', FALSE),
(7, 'UP07MN6789', 1, 22, '2025-06-10', 'Morning', 'Pending', 'Filter change', TRUE),
(8, 'WB08OP0123', 2, 23, '2025-06-15', 'Afternoon', 'Pending', NULL, FALSE),
(9, 'TS09QR4567', 3, 24, '2025-06-20', 'Evening', 'Pending', 'Suspension check', TRUE);