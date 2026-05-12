
USE ProjectDB;


START TRANSACTION;

SELECT * FROM Orders
WHERE order_id = 24;

UPDATE Orders
SET status = 'Preparing'
WHERE order_id = 24
    AND status = 'Placed';

UPDATE Payments
SET status = 'Completed'
WHERE order_id = 24
    AND status = 'Pending';

COMMIT;

START TRANSACTION;

UPDATE MenuItems
SET price = price * 0.50  
WHERE item_id = 1;

ROLLBACK;
