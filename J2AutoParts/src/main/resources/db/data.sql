-- SQL script to initialize roles and admin user
-- Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO roles (id, name) VALUES (2, 'ROLE_CUSTOMER') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Admin User: email = admin@j2autoparts.local, password = Admin@123 (BCrypt hash)
INSERT INTO users (id, email, password, full_name, enabled) 
VALUES (1, 'admin@j2autoparts.local', '$2a$12$R9h/lIPzHZPdB9T5Ybeu6uxf8HlG9v.F6i7Y89012345678901234', 'Quản trị viên', 1)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Assign Roles to Admin
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1) ON DUPLICATE KEY UPDATE user_id = user_id;
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2) ON DUPLICATE KEY UPDATE user_id = user_id;

-- Sample Categories
INSERT INTO categories (id, name, slug, description) 
VALUES (1, 'Phanh & ABS', 'phanh-abs', 'Má phanh, đĩa phanh, dầu phanh, cảm biến ABS')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO categories (id, name, slug, description) 
VALUES (2, 'Lọc & bảo dưỡng', 'loc-bao-duong', 'Lọc gió, lọc dầu, lọc nhiên liệu')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Sample Products
INSERT INTO products (name, sku, price, stock_quantity, description, image_url, category_id)
VALUES ('Má phanh trước Bosch', 'BOSCH-BP-001', 1250000, 24, 'Má phanh gốm, phù hợp sedan phổ biến', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, sku, price, stock_quantity, description, image_url, category_id)
VALUES ('Đĩa phanh sau', 'DISC-REAR-220', 2100000, 10, 'Đĩa gang, đường kính 280mm', NULL, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products (name, sku, price, stock_quantity, description, image_url, category_id)
VALUES ('Lọc gió động cơ', 'AIR-FLT-889', 185000, 80, 'Lọc gió OEM tương đương', NULL, 2)
ON DUPLICATE KEY UPDATE name = VALUES(name);
