-- DATABASE SETUP

DROP DATABASE IF EXISTS ProjectDB;

CREATE DATABASE ProjectDB;

USE ProjectDB;

-- USERS

CREATE TABLE Users (

    user_id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100)
    UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role ENUM(
        'customer',
        'admin'
    )
    DEFAULT 'customer',

    phone VARCHAR(15)
    UNIQUE,

    address VARCHAR(150) NOT NULL,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);


-- SINGLE RESTAURANT

CREATE TABLE Restaurants (

    restaurant_id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    slogan VARCHAR(255),

    location VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    opening_time TIME,

    closing_time TIME,

    rating DECIMAL(2,1)
    DEFAULT 0.0,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);

-- DELIVERY AGENTS

CREATE TABLE DeliveryAgents (

    agent_id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    phone VARCHAR(15)
    UNIQUE NOT NULL,

    vehicle_type ENUM(
        'Bike',
        'Car'
    )
    DEFAULT 'Bike',

    is_available BOOLEAN
    DEFAULT TRUE,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);

-- MENU ITEMS

CREATE TABLE MenuItems (
    item_id INT PRIMARY KEY AUTO_INCREMENT,

    restaurant_id INT NOT NULL,

    name VARCHAR(150) NOT NULL,

    category VARCHAR(100) NOT NULL,

    description TEXT,

    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (restaurant_id)
        REFERENCES Restaurants(restaurant_id)
        ON DELETE CASCADE
);

-- ORDERS

CREATE TABLE Orders (

    order_id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    restaurant_id INT NOT NULL,

    agent_id INT NULL,

    total_amount DECIMAL(10,2)
    DEFAULT 0.00,

    delivery_address VARCHAR(255),

    order_time TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    status ENUM(
        'Placed',
        'Preparing',
        'Out for Delivery',
        'Delivered',
        'Cancelled'
    )
    DEFAULT 'Placed',

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (restaurant_id)
        REFERENCES Restaurants(restaurant_id)
        ON DELETE CASCADE,

    FOREIGN KEY (agent_id)
        REFERENCES DeliveryAgents(agent_id)
        ON DELETE SET NULL
);

-- ORDER ITEMS

CREATE TABLE OrderItems (

    order_item_id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT NOT NULL,

    item_id INT NOT NULL,

    quantity INT NOT NULL,

    item_price DECIMAL(10,2) NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (item_id)
        REFERENCES MenuItems(item_id)
        ON DELETE CASCADE
);

-- PAYMENTS

CREATE TABLE Payments (

    payment_id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT UNIQUE,

    amount DECIMAL(10,2) NOT NULL,

    method ENUM(
        'Cash',
        'Card',
        'Online'
    ),

    status ENUM(
        'Pending',
        'Completed',
        'Failed'
    )
    DEFAULT 'Pending',

    transaction_reference VARCHAR(255),

    payment_time TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
        ON DELETE CASCADE
);


CREATE TABLE Invoices (

    invoice_id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT UNIQUE NOT NULL,

    invoice_number VARCHAR(100)
    UNIQUE NOT NULL,

    subtotal DECIMAL(10,2) NOT NULL,

    tax DECIMAL(10,2)
    DEFAULT 0.00,

    delivery_fee DECIMAL(10,2)
    DEFAULT 0.00,

    total_amount DECIMAL(10,2) NOT NULL,

    generated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES Orders(order_id)
        ON DELETE CASCADE
);


CREATE TABLE Transactions (

    transaction_id INT PRIMARY KEY AUTO_INCREMENT,

    payment_id INT NOT NULL,

    transaction_reference VARCHAR(255),

    transaction_type ENUM(
        'Payment',
        'Refund'
    )
    DEFAULT 'Payment',

    amount DECIMAL(10,2) NOT NULL,

    transaction_status ENUM(
        'Pending',
        'Completed',
        'Failed'
    )
    DEFAULT 'Completed',

    transaction_time TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (payment_id)
        REFERENCES Payments(payment_id)
        ON DELETE CASCADE
);


-- REVIEWS

CREATE TABLE Reviews (

    review_id INT PRIMARY KEY AUTO_INCREMENT,

    user_id INT NOT NULL,

    restaurant_id INT NOT NULL,

    rating INT CHECK (
        rating >= 1
        AND rating <= 5
    ),

    comment TEXT,

    review_time TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (restaurant_id)
        REFERENCES Restaurants(restaurant_id)
        ON DELETE CASCADE
);

-- COUPONS

CREATE TABLE Coupons (

    coupon_id INT PRIMARY KEY AUTO_INCREMENT,

    code VARCHAR(50)
    UNIQUE NOT NULL,

    discount_percentage INT NOT NULL,

    expiry_date DATE,

    is_active BOOLEAN
    DEFAULT TRUE
);


-- INDEXES

CREATE INDEX idx_users_email
ON Users(email);

CREATE INDEX idx_orders_user
ON Orders(user_id);

CREATE INDEX idx_orders_status
ON Orders(status);

CREATE INDEX idx_orders_time
ON Orders(order_time);

CREATE INDEX idx_menu_category
ON MenuItems(category);

CREATE INDEX idx_menu_restaurant
ON MenuItems(restaurant_id);

CREATE INDEX idx_menu_price
ON MenuItems(price);

CREATE INDEX idx_reviews_rating
ON Reviews(rating);

CREATE INDEX idx_payments_status
ON Payments(status);

-- SAMPLE RESTAURANT

INSERT INTO Restaurants (

    name,
    slogan,
    location,
    phone,
    opening_time,
    closing_time,
    rating

)

VALUES (

    'Fusion Bites',

    'Desi, Chinese, Italian & Fast Food All In One Place',

    'Lahore',

    '042111223344',

    '11:00:00',

    '23:00:00',

    4.8
);

-- ANALYTICS TEST QUERIES

SELECT *
FROM users;

SELECT COUNT(*) AS total_users
FROM Users;

SELECT *
FROM Orders
WHERE order_id = 504;

SELECT COUNT(*) AS total_order_items
FROM OrderItems;

SELECT COUNT(*) AS total_payments
FROM Payments;

SELECT COUNT(*) AS total_reviews
FROM Reviews;

SELECT COUNT(*) AS total_menu_items
FROM MenuItems;

SELECT category, COUNT(*) AS total_items
FROM MenuItems
GROUP BY category;

SELECT status, COUNT(*) AS total_orders
FROM Orders
GROUP BY status;

SELECT AVG(rating) AS average_rating
FROM Reviews;

SELECT category, AVG(price) AS average_price
FROM MenuItems
GROUP BY category;

-- Example: delivered orders count
SELECT COUNT(*) AS delivered_orders
FROM Orders
WHERE status = 'Delivered';

SELECT 
  (SELECT COUNT(*) FROM Users) +
  (SELECT COUNT(*) FROM MenuItems) +
  (SELECT COUNT(*) FROM Orders) +
  (SELECT COUNT(*) FROM OrderItems) +
  (SELECT COUNT(*) FROM Payments) +
  (SELECT COUNT(*) FROM Invoices) +
  (SELECT COUNT(*) FROM Transactions) +
  (SELECT COUNT(*) FROM Reviews) +
  (SELECT COUNT(*) FROM Restaurants) + 
  (SELECT COUNT(*) FROM DeliveryAgents) AS total_rows;  
