import pke
import time
import PyPDF2
import textract

# import required module
import os
import string
import csv
from langdetect import detect
import magic
import re

 
# assign directory
directory = 'libros'

files = []

skiplist = set()

with open("skip.csv", 'r', newline='') as file:
    reader = csv.reader(file)
    for f in reader:
        skiplist.add(f[0])

print(skiplist)

def find(name: str, text: str, keyword: str):
    res = re.search(keyword, text, re.IGNORECASE)
    if res is not None:
        with open('found.txt', 'a', newline='') as file:
            writer = csv.writer(file)
            field = [name, keyword, res.start(0), res.end(0)]
            writer.writerow(field)


def register_book(name, text, pages, method):
    with open('register.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        field = [name, detect(text), len(text), pages, method, 'Si' if len(text) > 10**6 else 'No']
        writer.writerow(field)

def register_error(name, lang, e):
    with open('errors.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        field = [name, lang, repr(e), ]
        writer.writerow(field)

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
            if fullname in skiplist:
                continue
            print("Processing "+ fullname)
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
                register_book(fullname, text, num_pages, 'PDFReader')
                
            #If the above returns as False, we run the OCR library textract to #convert scanned/image based PDF files into text
            
            else:
                lang = detect(filename)
                
                if lang == 'es':
                    lang = 'spa'
                else:
                    lang = 'eng'
                text = textract.process(fullname, method='tesseract', language=lang)
                text = text.decode('utf-8').lower()
                register_book(fullname, text, num_pages, 'OCR/Tesseract')

            lang = detect(text)
            
            print("Text processed. Detected lang: "+lang)
            
            find(fullname, text, "metsulfuron")
            # 1. create a TopicRank extractor.
            extractor = pke.unsupervised.YAKE()
            
            # 2. load the content of the document.
            stoplist = list(string.punctuation)
            stoplist += pke.lang.stopwords.get(lang)
            if len(text) > 10**6:
                print("Truncating text")
                text = text[0:10**6]
                
            try:
                # extractor.load_document(input=text,
                #                     language=lang,
                #                     stoplist=stoplist)
                extractor.load_document(input=text,
                        language=lang,
                        )

                print("Successfully loaded document into model")
            except Exception as e:
                print("Failed: "+repr(e))
                register_error(fullname, lang, e)
                continue
            
            pos = {'NOUN', 'PROPN', 'ADJ'}
            extractor.candidate_selection()
            print("Extracted candidates")
            # 3. build the graph representation of the document and rank the words.
            #    Keyphrase candidates are composed from the 33-percent
            #    highest-ranked words.
            extractor.candidate_weighting()
            # 3. select the longest sequences of nouns and adjectives, that do
            #    not contain punctuation marks or stopwords as candidates.
            
            # 4. build topics by grouping candidates with HAC (average linkage,
            #    threshold of 1/4 of shared stems). Weight the topics using random
            #    walk, and select the first occuring candidate from each topic.
            # extractor.candidate_weighting(threshold=0.74, method='average')
            print("Weighted candidates")
            
            # 5. get the 10-highest scored candidates as keyphrases
            keyphrases = extractor.get_n_best(n=20)
            
            keywords = []
            for k in keyphrases:
                if k in set(pke.lang.stopwords.get('es')) or k in set(pke.lang.stopwords.get('en')):
                    continue
                keywords.append(k[0])

            data = [fullname, ','.join(clean_keywords(keywords))]
            with open('keywords.csv', 'a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(data)

            with open("skip.csv", 'a', newline='') as file:
                print("Added book to skiplist")
                writer = csv.writer(file)
                writer.writerow([fullname])

            print("=============================")
