CREATE DATABASE IF NOT EXISTS app_db;

USE app_db;


DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS OrderLines;
DROP TABLE IF EXISTS CustomerLedger;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Products;


CREATE TABLE Customers (
  cust_id varchar(20) NOT NULL,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  phone varchar(30) NULL,
  credit_rating int(10) NOT NULL,
  last_updated datetime NOT NULL,
  
  CONSTRAINT idx_cust_pk PRIMARY KEY (cust_id),
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);

CREATE TABLE Products (
  prod_id varchar(20) NOT NULL,
  name varchar(20) NOT NULL,
  category varchar(20) NOT NULL,
  list_price int(10) NOT NULL,
  last_updated datetime NOT NULL,
  
  CONSTRAINT idx_prod_pk PRIMARY KEY (prod_id)
);


CREATE TABLE Orders (
  ord_id varchar(20) NOT NULL,
  cust_id varchar(20) NOT NULL,
  ord_date datetime NOT NULL,
  ship_date datetime NOT NULL,
  last_updated datetime NOT NULL,
  
  CONSTRAINT idx_ord_pk PRIMARY KEY (ord_id),
  CONSTRAINT cust_FK FOREIGN KEY (cust_id) REFERENCES Customers(cust_id)
);

CREATE TABLE OrderLines (
    ord_id VARCHAR(20) NOT NULL,
    ord_line_id VARCHAR(20) NOT NULL,
    prod_id VARCHAR(20) NOT NULL,
    qty INT(10) NOT NULL,
    sale_price INT(10) NOT NULL,
    last_updated DATETIME NOT NULL,
    
    CONSTRAINT idx_ord_line_pk PRIMARY KEY (ord_id , ord_line_id),
    CONSTRAINT prod_FK FOREIGN KEY (prod_id)
        REFERENCES Products (prod_id)
);

CREATE TABLE CustomerLedger (
  cust_id varchar(20) NOT NULL,
  event_id varchar(20) NOT NULL,
  event_date datetime NOT NULL,
  event_source varchar(20) NOT NULL,
  credit INT(10) NOT NULL,
  
  CONSTRAINT idx_cust_ledger_pk PRIMARY KEY (cust_id, event_id),
  INDEX idx_ledger_event_source (event_source),
  CONSTRAINT cust_ledger_FK FOREIGN KEY (cust_id) REFERENCES Customers(cust_id)
);


