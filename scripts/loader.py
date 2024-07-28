import time
from pdf2image import convert_from_path
import pytesseract
import PyPDF2

# import required module
import os
import string
from langdetect import detect
import magic
import psycopg2


# assign directory
directory = 'libros'
conn = psycopg2.connect("host=127.0.0.1 dbname=postgres user=postgres password=basquade")

def clean_keywords(keywords):
    new_keywords = set()
    for k in keywords:
        for w in k.split(' '):
            new_keywords.add(w.strip())
    return new_keywords

def can_detect(text):
    try:
        detect(text)
        return True
    except Exception:
        return False

def valid_encoding(text):
    m = magic.open(magic.MAGIC_MIME_ENCODING)
    m.load()
    return m.buffer(text) == 'utf-8'

# iterate over files in
# that directory
for root, dirs, files in os.walk(directory):
    for filename in files:

        if filename.endswith('pdf'):
            fullname = os.path.join(root, filename)
            print(fullname)
            start = time.time()
            pdfFileObj = open(fullname,'rb')               #open allows you to read the file
            pdfReader = PyPDF2.PdfReader(pdfFileObj)   #The pdfReader variable is a readable object that will be parsed
            num_pages = len(pdfReader.pages)                 #discerning the number of pages will allow us to parse through all the pages

            count = 0
            text = ""

            while count < num_pages:                       #The while loop will read each page
                pageObj = pdfReader.pages[count]
                count +=1
                text += pageObj.extract_text()

            if text != "" and can_detect(text) and valid_encoding(text):
                text = text

            #If the above returns as False, we run the OCR library textract to #convert scanned/image based PDF files into text

            else:
                lang = detect(filename)

                if lang == 'es':
                    lang = 'spa'
                else:
                    lang = 'eng'

                pages = convert_from_path(fullname, 500)

                for pageNum,imgBlob in enumerate(pages):
                    t = pytesseract.image_to_string(imgBlob,lang= lang)

                    text += t

            print(text[0:500])
            lang = detect(text)

            if lang == 'es':
              lang = 'spanish'
              id = 1
            elif lang == 'en':
              lang = 'english'
              id = 2
            else:
              lang = 'portuguese'
              id = 3

            pdf = open(fullname, 'rb').read()
            cur = conn.cursor()
            cur.execute("INSERT INTO books VALUES (default, %s, %s, to_tsvector(%s, %s), %s)",
                         (filename,
                         pdf,
                        lang,
                         text,
                         id)
                )
            conn.commit()
            cur.close()

conn.close()
