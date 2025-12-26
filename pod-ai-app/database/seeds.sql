-- Seed data for testing

-- Insert test users
INSERT INTO users (email, password_hash, name) VALUES
  ('test@example.com', '$2a$10$hash1', 'Test User'),
  ('demo@example.com', '$2a$10$hash2', 'Demo User');

-- Get user IDs for reference
DO $$
DECLARE
  test_user_id UUID;
  demo_user_id UUID;
BEGIN
  SELECT id INTO test_user_id FROM users WHERE email = 'test@example.com';
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@example.com';

  -- Insert test images
  INSERT INTO images (user_id, prompt, image_url, status) VALUES
    (test_user_id, 'A beautiful sunset', 'https://example.com/image1.png', 'generated'),
    (test_user_id, 'Mountain landscape', 'https://example.com/image2.png', 'generated'),
    (demo_user_id, 'Ocean waves', 'https://example.com/image3.png', 'generated');
END $$;
