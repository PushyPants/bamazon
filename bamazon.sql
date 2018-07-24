CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

DROP TABLE products;

CREATE TABLE IF NOT EXISTS products(
     item_id INT(10) NOT NULL AUTO_INCREMENT
    , product_name VARCHAR(255) NOT NULL
    , department_name VARCHAR(255) 
    , price DECIMAL(12,2) NOT NULL 
    , stock_quantity INT(10) NOT NULL
    , PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES('Rework', 'books', 13.82, 12)
,('Harry Potter 8 DVD collection','Movies',40.84,3)
,('Logitech Harmony Remote','Electronics',174.35,18)
,('Lawn Mower','Home & Garden',219.99, 4000)
,('Premium Body Wash & Shampoo','Health & Beauty',24.00,34)
,('Cards Against Humanity','Toys & Games',25.00,2)
,('Blue Shirt','Clothing', 24.00,4)
,('Sports Ball','Sports & Outdoors',11.00, 0)
,('Optimum Nutrition Multivitamin','Health & Beauty',23.98,9)
,('Smartwatch','Electronics',159.99,8);

SELECT * FROM bamazon.products;