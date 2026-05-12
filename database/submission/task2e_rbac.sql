USE ProjectDB;

DROP USER IF EXISTS 'fb_ops_admin'@'localhost';
DROP USER IF EXISTS 'fb_kitchen'@'localhost';
DROP USER IF EXISTS 'fb_analyst'@'localhost';


CREATE USER IF NOT EXISTS 'fb_ops_admin'@'localhost' IDENTIFIED BY 'OpsAdmin_Demo!';
CREATE USER IF NOT EXISTS 'fb_kitchen'@'localhost' IDENTIFIED BY 'Kitchen_Demo!';
CREATE USER IF NOT EXISTS 'fb_analyst'@'localhost' IDENTIFIED BY 'Analyst_Demo!';

GRANT SELECT, INSERT, UPDATE, DELETE ON ProjectDB.* TO 'fb_ops_admin'@'localhost';


GRANT SELECT ON ProjectDB.Orders TO 'fb_kitchen'@'localhost';
GRANT SELECT ON ProjectDB.OrderItems TO 'fb_kitchen'@'localhost';
GRANT SELECT ON ProjectDB.MenuItems TO 'fb_kitchen'@'localhost';
GRANT UPDATE ON ProjectDB.Orders TO 'fb_kitchen'@'localhost';


GRANT SELECT ON ProjectDB.Users TO 'fb_analyst'@'localhost';
GRANT SELECT ON ProjectDB.Orders TO 'fb_analyst'@'localhost';
GRANT SELECT ON ProjectDB.OrderItems TO 'fb_analyst'@'localhost';
GRANT SELECT ON ProjectDB.Payments TO 'fb_analyst'@'localhost';
GRANT SELECT ON ProjectDB.Invoices TO 'fb_analyst'@'localhost';
GRANT SELECT ON ProjectDB.MenuItems TO 'fb_analyst'@'localhost';

FLUSH PRIVILEGES;
