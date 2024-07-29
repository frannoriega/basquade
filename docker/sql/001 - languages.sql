-- Los lenguajes presentes en los pdfs
CREATE TABLE lang (
  -- Un identificador autogenerado
  id SERIAL NOT NULL PRIMARY KEY,
  -- El lenguaje en si
  language VARCHAR(16) NOT NULL UNIQUE
);
