-- 1. INSERT QUERY
INSERT INTO account (account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony','Stark',' tony@starkent.com','Iam1ronM@n');

-- 2. UPDATE QUERY
UPDATE account SET account_type = 'Admin' WHERE 
account_firstname = 'Tony' and account_lastname = 'Stark';

-- 3. DELETE QUERY

DELETE FROM account WHERE 
account_firstname = 'Tony' and account_lastname = 'Stark';

-- 4. REPLACE QUERY
UPDATE inventory SET inv_description = 
REPLACE(inv_description,'small interiors','a huge interior');

-- 5. INNER JOIN QUERY
SELECT inv.inv_make, inv.inv_model
FROM inventory inv
INNER JOIN classification cat
ON inv.classification_id = cat.classification_id 
WHERE cat.classification_name = 'Sport';

-- 6. REPLACE QUERY
UPDATE INVENTORY
SET inv_image = REPLACE(inv_image,'/images','/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail,'/images','/images/vehicles');

