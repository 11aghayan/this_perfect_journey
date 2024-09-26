ROLLBACK;
BEGIN;
-- EXTENSIONS
CREATE EXTENSION "uuid-ossp";

CREATE EXTENSION CITEXT;

-- DOMAINS
CREATE DOMAIN ID AS 
  UUID DEFAULT uuid_generate_v4() NOT NULL;

CREATE DOMAIN EMAIL AS CITEXT
  CHECK (value ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

CREATE DOMAIN SEX AS CHAR(1)
  CHECK (value ~ '^m$|^f$');

CREATE DOMAIN PERMISSION AS CHAR(1) NOT NULL
  CHECK(value ~ '^s$|^f$|^r$');

CREATE DOMAIN SEASON AS CHAR(2)
  CHECK(value ~ '^sp$|^su$|^au$|^wi$|^al$');

CREATE DOMAIN TRIP_TYPE AS CHAR(3)
  CHECK(value ~ '^rel$|^sig$|^act$|^cul$|^par$');

CREATE DOMAIN PRIORITY AS CHAR(1)
  CHECK(value ~ '^h$|^m$|^l$');

CREATE DOMAIN COVER_FOR AS CHAR(1)
  CHECK(value ~ '^d$|^t$');

CREATE DOMAIN COVER_POS AS CHAR(1)
  CHECK(value ~ '^l$|^m$|^r$');

CREATE DOMAIN RATING_SCORE AS SMALLINT
  CHECK(value >= 1 AND value <= 50);

-- TABLES
CREATE TABLE user_tbl (
  id ID PRIMARY KEY,
  email EMAIL UNIQUE NOT NULL,
  password_hash VARCHAR(60) NOT NULL,
  role CHAR(4) CHECK(role = 'user') DEFAULT 'user' NOT NULL,
  name VARCHAR(100) NOT NULL,
  birthday DATE,
  sex SEX,
  nationality VARCHAR(60),
  join_date DATE DEFAULT now() NOT NULL,
  last_login DATE,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL
  refresh_token VARCHAR(255),
  is_blocked BOOLEAN DEFAULT FALSE NOT NULL,
  block_reason VARCHAR(255),
);

CREATE TABLE admin_tbl (
  id ID PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  role CHAR(5) CHECK(role = 'admin') DEFAULT 'admin' NOT NULL,
  permission PERMISSION,
  password_hash VARCHAR(60) NOT NULL,
  refresh_token VARCHAR(255)
); 

CREATE TABLE profile_photo_tbl (
  user_id UUID UNIQUE NOT NULL,
  file TEXT NOT NULL,

  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES user_tbl(id) 
    ON DELETE CASCADE
);

CREATE TABLE trip_tbl (
  id ID PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL,
  view_count BIGINT DEFAULT 0 NOT NULL,
  cost INT,
  description TEXT NOT NULL,
  season SEASON[] NOT NULL,
  avg_rating RATING_SCORE,
  duration_from SMALLINT NOT NULL,
  duration_to SMALLINT NOT NULL,
  type TRIP_TYPE[] NOT NULL,
  create_date DATE DEFAULT NOW() NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE NOT NULL,
  block_reason VARCHAR(255),

  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES user_tbl(id) 
    ON DELETE CASCADE
);

CREATE TABLE picked_by_us_trip_tbl(
  trip_id UUID UNIQUE NOT NULL,

  CONSTRAINT fk_trip
    FOREIGN KEY(trip_id)
    REFERENCES trip_tbl(id) 
    ON DELETE CASCADE
);

CREATE TABLE destination_tbl(
  id ID PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  trip_id UUID NOT NULL,
  parent_destination_id UUID,
  priority PRIORITY DEFAULT 'm' NOT NULL,
  description TEXT NOT NULL,
  staying_cost INT,
  visiting_cost INT,
  stay_days SMALLINT NOT NULL,
  visiting_time_from SMALLINT,
  visiting_time_to SMALLINT, 


  CONSTRAINT fk_trip
    FOREIGN KEY(trip_id)
    REFERENCES trip_tbl(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_parent
    FOREIGN KEY(parent_destination_id)
    REFERENCES destination_tbl(id)
    ON DELETE CASCADE
);

CREATE TABLE photo_tbl(
  id ID PRIMARY KEY,
  file TEXT NOT NULL,
  trip_id UUID NOT NULL,
  destination_id UUID,
  cover_for COVER_FOR,
  cover_pos COVER_POS,

  CONSTRAINT fk_trip 
    FOREIGN KEY(trip_id)
    REFERENCES trip_tbl(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_destination
    FOREIGN KEY(destination_id)
    REFERENCES destination_tbl(id)
    ON DELETE CASCADE
);

CREATE TABLE rating_tbl(
  id ID PRIMARY KEY,
  trip_id UUID NOT NULL,
  user_id UUID NOT NULL,
  comment TEXT,
  score RATING_SCORE NOT NULL,
  replied_to UUID,
  like_count INT DEFAULT 0 NOT NULL,
  dislike_count INT DEFAULT 0 NOT NULL,

  CONSTRAINT fk_trip
    FOREIGN KEY(trip_id)
    REFERENCES trip_tbl(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES user_tbl(id),
  CONSTRAINT fk_reply
    FOREIGN KEY(replied_to)
    REFERENCES rating_tbl(id)
    ON DELETE CASCADE
);

COMMIT;