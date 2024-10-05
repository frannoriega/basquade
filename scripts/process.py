import os
import io
import numbers
import psycopg2
import pytesseract
import PyPDF2
import magic
from pdf2image import convert_from_path, convert_from_bytes
import logging
import time
logger = logging.getLogger("basquade-proc")

class Lang:
  def __init__(self, id, pg_lang, tesseract):
    self.id = id
    self.pg_lang = pg_lang
    self.tesseract = tesseract

class PendingBook:
  def __init__(self, row):
    self.id = row[0]
    self.title = row[1]
    self.description = row[2]
    self.file = row[3]
    self.md5 = row[4]
    self.lang = Lang(row[5], row[6], row[7])
    self.categoryId = row[8]

class Book:
  def __init__(self, pending, content, cover, authors):
    self.pending = pending
    self.content = content
    self.cover = cover
    self.authors = authors

def valid_encoding(text):
    m = magic.open(magic.MAGIC_MIME_ENCODING)
    m.load()
    return m.buffer(text) == 'utf-8'

def get_content(logger, title, blob, image, lang):
  logger.info("Extrayendo contenido del PDF '%s'", title)
  pdfReader = PyPDF2.PdfReader(io.BytesIO(bytes(blob)))   #The pdfReader variable is a readable object that will be parsed
  num_pages = len(pdfReader.pages)                 #discerning the number of pages will allow us to parse through all the pages

  count = 0
  text = ""

  while count < num_pages:                       #The while loop will read each page
    pageObj = pdfReader.pages[count]
    count +=1
    text += pageObj.extract_text()

  if text != "" and valid_encoding(text):
    text = text
    #If the above returns as False, we run the OCR library textract to #convert scanned/image based PDF files into text
  else:
    logger.info("PDF escaneado. Extrayendo contenido usando OCR")
    for imgBlob in image:
      t = pytesseract.image_to_string(imgBlob,lang=lang)
      text += t
  return text

def get_authors(logger, title, cursor, id):
  select_authors = f"SELECT a.\"authorId\" FROM \"AuthorOnPending\" AS a WHERE a.\"pendingId\" = {id}"
  logger.info("Extraídos los autores de '%s'", title)

  cursor.execute(select_authors)
  author_records = cursor.fetchall()
  authors = []
  for author in author_records:
    authors.append(author[0])

  return authors

LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

def main():
  logging.basicConfig(format=LOG_FORMAT, level=logging.INFO)
  logger.info("Comenzando procesamiento")
  POSTGRES_HOST=os.environ.get('POSTGRES_HOST')
  if POSTGRES_HOST == None:
    msg = "POSTGRES_HOST no fue configurado"
    logger.error(msg)
    raise Exception(msg)
  POSTGRES_DB=os.environ.get('POSTGRES_DB')
  if POSTGRES_DB == None:
    msg = "POSTGRES_DB no fue configurado"
    logger.error(msg)
    raise Exception(msg)
  POSTGRES_USER=os.environ.get('POSTGRES_USER')
  if POSTGRES_USER == None:
    msg = "POSTGRES_USER no fue configurado"
    logger.error(msg)
    raise Exception(msg)
  POSTGRES_PASSWORD=os.environ.get('POSTGRES_PASSWORD')
  if POSTGRES_PASSWORD == None:
    msg = "POSTGRES_PASSWORD no fue configurado"
    logger.error(msg)
    raise Exception(msg)
  BOOK_LIMIT=os.environ.get('BOOK_LIMIT', 10)
  if not isinstance(BOOK_LIMIT, numbers.Number):
    msg = "BOOK_LIMIT debe ser un número"
    logger.error(msg)
    raise Exception(msg)

  conn = psycopg2.connect(f"host={POSTGRES_HOST} dbname={POSTGRES_DB} user={POSTGRES_USER} \
  password={POSTGRES_PASSWORD}")
  logger.debug("Conectado a la base de datos")

  start = time.time()
  # Procesamos todos los que se puedan en un período de 3 horas
  while time.time() - start < 10800:
    select_pending = f"SELECT b.id, b.title, b.description, b.file, b.md5, b.\"langId\", l.pg_lang, \
      l.tesseract, b.\"categoryId\" FROM \"Pending\" AS b JOIN \"Lang\" AS l ON b.\"langId\" = l.id ORDER BY b.id LIMIT {BOOK_LIMIT};"

    cursor = conn.cursor()
    cursor.execute(select_pending)
    records = cursor.fetchall()

    if len(records) == 0:
      break

    logger.debug("Extraídos los libros pendientes de procesamiento")

    for row in records:
      pending = PendingBook(row)

      image = convert_from_bytes(pending.file)
      content = get_content(logger, pending.title, pending.file, image, pending.lang.tesseract)
      authors = get_authors(logger, pending.title, cursor, pending.id)
      cover = io.BytesIO()
      image[0].save(cover, format='PNG')

      logger.info("Libro pendiente %s, '%s' procesado. Guardando en base de datos...", pending.id, pending.title)

      insert_book = f"INSERT INTO \"Book\" (id, title, description, file, content, cover, md5, \"langId\", \
        \"categoryId\", needs_revision) VALUES (default, %s, %s, %s, \
      to_tsvector(CAST(%s AS regconfig), %s), %s, %s, %s, %s, false) \
       ON CONFLICT DO NOTHING RETURNING id;"
      cursor.execute(insert_book, (pending.title, pending.description, bytes(pending.file),
                                   pending.lang.pg_lang, content, cover.getvalue(), pending.md5,
                                   pending.lang.id, pending.categoryId))
      book_id = cursor.fetchone()

      delete_authors = f"DELETE FROM \"AuthorOnPending\" WHERE \"pendingId\" = {pending.id};"
      delete_pending = f"DELETE FROM \"Pending\" WHERE id = {pending.id};"
      if book_id == None:
        logger.warning(
          "Libro pendiente %s, '%s' no se pudo guardar debido a un conflicto en la base de datos",
          pending.id,
          pending.title
        )
        cursor.execute(delete_authors)
        cursor.execute(delete_pending)
        continue

      book_id = book_id[0]
      logger.info("Libro pendiente %s, '%s' guardado", pending.id, pending.title)
      logger.info("Guardando autores para %s, '%s'", pending.id, pending.title)

      for author in authors:
        insert_authors = f"INSERT INTO \"AuthorOnBook\" VALUES (default, {book_id}, {author}) \
        ON CONFLICT DO NOTHING;"
        cursor.execute(insert_authors)

      logger.info("Autores guardados")
      logger.info("Borrando registros de pendiente para %s, '%s'", pending.id, pending.title)


      cursor.execute(delete_authors)
      cursor.execute(delete_pending)
      logger.info("Registros de pendiente borrados")

    conn.commit()
    logger.info("Transacción terminada")
  logger.info("Procesamiento finalizado")

if __name__ == '__main__':
  main()
