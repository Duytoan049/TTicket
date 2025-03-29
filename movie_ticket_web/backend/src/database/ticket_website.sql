CREATE DATABASE IF NOT EXISTS movie_ticket_website;
USE movie_ticket_website;

-- Bảng User
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    name varchar(100),
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer'
);
-- Bảng Movie
CREATE TABLE Movie (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_name VARCHAR(200) NOT NULL,
    ticket_price INT(10),
    poster_path VARCHAR(255)
);
-- Bảng Theater
CREATE TABLE Theater (
    theater_id INT AUTO_INCREMENT PRIMARY KEY,
    theater_name VARCHAR(150) NOT NULL,
    location VARCHAR(255) NOT NULL
);
INSERT INTO Theater (theater_name, location) VALUES
('CGV Vincom Hùng Vương', 'Vincom Plaza Hùng Vương, Số 2 Hùng Vương, Phường Thới Bình, Quận Ninh Kiều, TP. Cần Thơ'),
('CGV Sense City', 'Tầng 3, Trung Tâm Thương Mại Sense City, 01 Đại Lộ Hoà Bình, Quận Ninh Kiều, TP. Cần Thơ'),
('CGV Vincom Xuân Khánh', 'Vincom Xuân Khánh, 209 Đường 30 Tháng 4, Quận Ninh Kiều, TP. Cần Thơ');
-- Bảng Show_time
CREATE TABLE Show_time (
    show_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    theater_id INT,
    show_date date,
    show_time VARCHAR(5) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES Movie(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (theater_id) REFERENCES Theater(theater_id)
);
-- Bảng Ticket
CREATE TABLE Ticket (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    show_id INT,
    seat_number VARCHAR(20) NOT NULL,
    price INT(20) NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (show_id) REFERENCES Show_Time(show_id) ON DELETE CASCADE
);
-- Bảng Booking
-- CREATE TABLE Booking (
--     booking_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT,
--     booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
-- );
-- select * from Booking;

-- Bảng Payment
-- CREATE TABLE Payment (
--     payment_id INT AUTO_INCREMENT PRIMARY KEY,
--     booking_id INT,
--     payment_date DATE NOT NULL,
--     amount DECIMAL(10, 2) NOT NULL,
--     payment_method VARCHAR(100) NOT NULL,
--     FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
-- );
