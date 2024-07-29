CREATE TABLE books (
  id SERIAL NOT NULL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file BYTEA NOT NULL,
  content TSVECTOR NOT NULL,
  lang INT NOT NULL REFERENCES lang(id)
  md5 TEXT NOT NULL UNIQUE
);

CREATE INDEX books_content_idx ON books USING gin (content);
