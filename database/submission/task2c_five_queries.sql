USE ProjectDB;

-- Query 1

WITH priced_orders AS (
    SELECT
        o.order_id,
        o.user_id,
        o.total_amount,
        o.order_time,
        o.status
    FROM Orders o
    WHERE o.status IN ('Placed', 'Preparing', 'Out for Delivery', 'Delivered')
)
SELECT
    po.order_id,
    u.name AS customer_name,
    po.total_amount,
    po.order_time,
    po.status
FROM priced_orders po
JOIN Users u
    ON u.user_id = po.user_id
WHERE u.role = 'customer'
    AND po.total_amount > 500
ORDER BY po.order_time ASC
LIMIT 50;


-- Query 2

SELECT
    category,
    COUNT(*) AS menu_item_count,
    ROUND(AVG(price), 2) AS average_price_rs
FROM MenuItems
WHERE price > 0
    AND category IS NOT NULL
GROUP BY category
ORDER BY category ASC;


-- Query 3

SELECT status FROM Orders
WHERE order_id = 15 AND status = 'Placed';


UPDATE Orders
SET status = 'Preparing'
WHERE order_id = 14
    AND status = 'Placed';


-- Query 4

DELETE FROM Coupons
WHERE is_active = FALSE
    AND expiry_date IS NOT NULL
    AND expiry_date < CURDATE();


-- Query 5

SELECT
    u.user_id,
    u.name,
    u.email,
    COUNT(o.order_id) AS total_orders,
    ROUND(SUM(IFNULL(o.total_amount, 0)), 2) AS lifetime_order_value_rs
FROM Users u
LEFT JOIN Orders o
    ON o.user_id = u.user_id
WHERE u.role = 'customer'
GROUP BY u.user_id, u.name, u.email
HAVING COUNT(o.order_id) > 0
ORDER BY total_orders DESC, lifetime_order_value_rs DESC;
