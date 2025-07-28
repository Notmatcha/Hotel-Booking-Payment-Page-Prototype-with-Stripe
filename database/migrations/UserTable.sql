
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100),
    phone_number    VARCHAR(20),
    date_joined     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_profiles (
    user_id       INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender        VARCHAR(10),
    nationality   VARCHAR(50),
    address       TEXT
);

-- Table: "booking" will only result in it being added to purchase hist not an actual booking
CREATE TABLE purchase_history (
    booking_id      SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    hotel_id       INTEGER REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    room_id        INTEGER REFERENCES rooms(room_id) ON DELETE CASCADE,
    date_added     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in       DATE NOT NULL,
    check_out      DATE NOT NULL,
    total_price    DECIMAL(10,2),
    booking_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status         VARCHAR(20) DEFAULT 'not_booked' -- can be 'not_booked', 'booked', 'cancelled'
);

CREATE TABLE auth_tokens (
    token_id     SERIAL PRIMARY KEY,
    user_id      INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    token        TEXT NOT NULL,
    issued_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at   TIMESTAMP NOT NULL
);
