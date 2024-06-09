--Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    profile_picture VARCHAR(250)
);

-- Create chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  picture VARCHAR(100) DEFAULT NULL,
  type VARCHAR(10)
);

-- Create messages tables
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text VARCHAR(1000),
  sender_id UUID NOT NULL REFERENCES users(id),
  room_id UUID NOT NULL REFERENCES chats(id)
);

-- Create joint table to relate users to chats;
CREATE TABLE chats_to_users (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  chat_id UUID NOT NULL REFERENCES chats(id)
);
