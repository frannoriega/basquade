CREATE TABLE lang (
  id SERIAL NOT NULL PRIMARY KEY,
  language VARCHAR(16) NOT NULL UNIQUE
);
