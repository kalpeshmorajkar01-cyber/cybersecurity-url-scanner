CREATE DATABASE cyberguard;

USE cyberguard;

CREATE TABLE scan_history(
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(100),
 email VARCHAR(150),
 url TEXT,
 status VARCHAR(50),
 security_percentage INT,
 scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select* from scan_history;