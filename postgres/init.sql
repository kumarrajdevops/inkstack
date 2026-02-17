CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url TEXT,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mock Data
-- Password is 'admin' hashed with bcrypt (example hash)
INSERT INTO users (username, password_hash, email, full_name)
VALUES 
('admin', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin@example.com', 'Admin User'),
('jane_doe', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'jane@example.com', 'Jane Doe');

INSERT INTO blogs (title, content, image_url, author_id)
VALUES
(
    'The Future of AI', 
    'Artificial Intelligence is reshaping the world...', 
    'https://images.unsplash.com/photo-1677442136019-21780ecad995', 
    1
),
(
    'A Trip to the Mountains', 
    'Hiking in the Alps was an unforgettable experience...', 
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 
    2
),
(
    'Modern Web Development', 
    'Exploring the stack of React, FastAPI, and Postgres.', 
    'https://images.unsplash.com/photo-1547658719-da2b51169166', 
    1
);

CREATE TABLE IF NOT EXISTS system_configs (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_configs (key, value)
VALUES ('footer_text', '© 2024 Inkstack. Powered by React, FastAPI & PostgreSQL.')
ON CONFLICT (key) DO NOTHING;
