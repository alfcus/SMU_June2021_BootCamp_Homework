-- sanity checks after loading toys data set
select * from review_id_table
where review_date > '2015-01-01';

select * from products
where product_title like 'Lego%';

select * from customers
where customer_count > 100
order by customer_count desc;

select * from vine_table
where star_rating >= 4
order by star_rating desc;

select p.product_title, v.star_rating, v.helpful_votes, r.review_date
from review_id_table r
join products p on r.product_id = p.product_id
join vine_table v on r.review_id = v.review_id
where v.star_rating = 5;

-- dropped tables and recreated since the second data set had duplicate product_id values
DROP TABLE review_id_table;
DROP TABLE products;
DROP TABLE customers;
DROP TABLE vine_table;

-- recreating tables
CREATE TABLE review_id_table (
  review_id TEXT PRIMARY KEY NOT NULL,
  customer_id INTEGER,
  product_id TEXT,
  product_parent INTEGER,
  review_date DATE -- this should be in the formate yyyy-mm-dd
);

-- This table will contain only unique values
CREATE TABLE products (
  product_id TEXT PRIMARY KEY NOT NULL UNIQUE,
  product_title TEXT
);

-- Customer table for first data set
CREATE TABLE customers (
  customer_id INT PRIMARY KEY NOT NULL UNIQUE,
  customer_count INT
);

-- vine table
CREATE TABLE vine_table (
  review_id TEXT PRIMARY KEY,
  star_rating INTEGER,
  helpful_votes INTEGER,
  total_votes INTEGER,
  vine TEXT
);


-- after second data set (video games) load
select * from review_id_table
where review_id = 'R10010D6B1QM7U';

select * from products
where product_id = 'B00CJ7IUI6';

select * from customers
where customer_count > 100
order by customer_count desc;

select * from vine_table
where star_rating >= 4
order by star_rating desc;

select p.product_title, v.star_rating, v.helpful_votes, r.review_date
from review_id_table r
join products p on r.product_id = p.product_id
join vine_table v on r.review_id = v.review_id
where v.star_rating = 5;



