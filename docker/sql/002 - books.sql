-- Tabla para guardar los pdfs
CREATE TABLE books (
  -- Un identificador autogenerado
  id SERIAL NOT NULL PRIMARY KEY,
  -- El título del pdf
  title VARCHAR(255) NOT NULL,
  -- El pdf en sí mismo
  file BYTEA NOT NULL,
  -- El texto de pdf, convertido en un TS VECTOR
  -- para poder realizar busquedas sobre el texto
  content TSVECTOR NOT NULL,
  -- El idioma del pdf
  lang INT NOT NULL REFERENCES lang(id)
  -- El hash MD5 del pdf
  md5 TEXT NOT NULL UNIQUE
);

-- Un indice para realizar busquedas rapidas sobre
-- el texto de los pdfs
CREATE INDEX books_content_idx ON books USING gin (content);
