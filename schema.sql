CREATE DATABASE IF NOT EXISTS interest_app;
USE interest_app;

-- 1. admin table
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    duration INT,
    payment_method VARCHAR(100),
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending'
);

-- 3. payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    paid_amount DECIMAL(15, 2) NOT NULL,
    remaining_amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. interest_calculations table
CREATE TABLE IF NOT EXISTS interest_calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    monthly_interest DECIMAL(15, 2) NOT NULL,
    yearly_interest DECIMAL(15, 2) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert default admin
-- Note: 'admin123' is inserted as plain text as requested. 
-- If your backend uses bcrypt (like the one we just built), you'll want to use a valid bcrypt hash instead.
-- Example bcrypt hash for 'admin123': '$2b$10$w095A64ZzVzGclwV.Z9V8.QpA38ZtXwR5Xy4zTqW3o6I3J0vj1g5m'
INSERT INTO admin (username, password) 
VALUES ('admin', 'admin123')
ON DUPLICATE KEY UPDATE username=username;
