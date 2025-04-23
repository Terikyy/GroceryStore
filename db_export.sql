-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 23, 2025 at 09:42 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assignment1`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(10) UNSIGNED DEFAULT NULL,
  `product_name` varchar(20) DEFAULT NULL,
  `unit_price` float(8,2) DEFAULT NULL,
  `unit_quantity` varchar(15) DEFAULT NULL,
  `in_stock` int(10) UNSIGNED DEFAULT NULL,
  `main_category` varchar(50) NOT NULL,
  `subcategory` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `unit_price`, `unit_quantity`, `in_stock`, `main_category`, `subcategory`) VALUES
(1000, 'Fish Fingers', 2.55, '500 gram', 1500, 'Food & Beverages', 'Frozen Foods'),
(1001, 'Fish Fingers', 5.00, '1000 gram', 749, 'Food & Beverages', 'Frozen Foods'),
(1002, 'Hamburger Patties', 2.35, 'Pack 10', 1195, 'Food & Beverages', 'Frozen Foods'),
(1003, 'Shelled Prawns', 6.90, '250 gram', 10, 'Food & Beverages', 'Frozen Foods'),
(1004, 'Tub Ice Cream', 1.80, 'I Litre', 0, 'Food & Beverages', 'Frozen Foods'),
(1005, 'Tub Ice Cream', 3.40, '2 Litre', 1200, 'Food & Beverages', 'Frozen Foods'),
(2000, 'Panadol', 3.00, 'Pack 24', 2000, 'Household Essentials', 'Health & Medicine'),
(2001, 'Panadol', 5.50, 'Bottle 50', 1000, 'Household Essentials', 'Health & Medicine'),
(2002, 'Bath Soap', 2.60, 'Pack 6', 500, 'Household Essentials', 'Personal Care'),
(2003, 'Garbage Bags Small', 1.50, 'Pack 10', 500, 'Household Essentials', 'Cleaning & Laundry'),
(2004, 'Garbage Bags Large', 5.00, 'Pack 50', 300, 'Household Essentials', 'Cleaning & Laundry'),
(2005, 'Washing Powder', 4.00, '1000 gram', 800, 'Household Essentials', 'Cleaning & Laundry'),
(3000, 'Cheddar Cheese', 8.00, '500 gram', 0, 'Food & Beverages', 'Meat & Dairy'),
(3001, 'Cheddar Cheese', 15.00, '1000 gram', 1000, 'Food & Beverages', 'Meat & Dairy'),
(3002, 'T Bone Steak', 7.00, '1000 gram', 200, 'Food & Beverages', 'Meat & Dairy'),
(3003, 'Navel Oranges', 3.99, 'Bag 20', 200, 'Food & Beverages', 'Fruits'),
(3004, 'Bananas', 1.49, 'Kilo', 400, 'Food & Beverages', 'Fruits'),
(3005, 'Peaches', 2.99, 'Kilo', 500, 'Food & Beverages', 'Fruits'),
(3006, 'Grapes', 3.50, 'Kilo', 200, 'Food & Beverages', 'Fruits'),
(3007, 'Apples', 1.99, 'Kilo', 500, 'Food & Beverages', 'Fruits'),
(4000, 'Earl Grey Tea Bags', 2.49, 'Pack 25', 1200, 'Food & Beverages', 'Beverages'),
(4001, 'Earl Grey Tea Bags', 7.25, 'Pack 100', 0, 'Food & Beverages', 'Beverages'),
(4002, 'Earl Grey Tea Bags', 13.00, 'Pack 200', 800, 'Food & Beverages', 'Beverages'),
(4003, 'Instant Coffee', 2.89, '200 gram', 500, 'Food & Beverages', 'Beverages'),
(4004, 'Instant Coffee', 5.10, '500 gram', 500, 'Food & Beverages', 'Beverages'),
(4005, 'Chocolate Bar', 2.50, '500 gram', 300, 'Food & Beverages', 'Snacks & Confectionery'),
(5000, 'Dry Dog Food', 5.95, '5 kg Pack', 400, 'Pet Supplies', 'Pet Food'),
(5001, 'Dry Dog Food', 1.95, '1 kg Pack', 400, 'Pet Supplies', 'Pet Food'),
(5002, 'Bird Food', 3.99, '500g packet', 200, 'Pet Supplies', 'Pet Food'),
(5003, 'Cat Food', 2.00, '500g tin', 200, 'Pet Supplies', 'Pet Food'),
(5004, 'Fish Food', 3.00, '500g packet', 200, 'Pet Supplies', 'Pet Food'),
(2006, 'Laundry Bleach', 3.55, '2 Litre Bottle', 500, 'Household Essentials', 'Cleaning & Laundry');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD UNIQUE KEY `product_id` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
