CREATE DATABASE IF NOT EXISTS app_db;

USE app_db;

DROP TABLE IF EXISTS Customers;

CREATE TABLE Customers (
  cust_id varchar(20) NOT NULL,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  city varchar(30),
  last_updated datetime NOT NULL,
  rating int(10) NOT NULL,
  PRIMARY KEY (cust_id)
);
