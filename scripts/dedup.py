import os
import csv

import hashlib
# assign directory
directory = 'libros'

hashes = set()

# iterate over files in
# that directory
for root, dirs, files in os.walk(directory):
    for filename in files:

        if filename.endswith('pdf'):
            fullname = os.path.join(root, filename)
            hash = hashlib.md5(open(fullname,'rb').read()).hexdigest()
            if hash in hashes:
                print("Removing: "+fullname)
                os.remove(fullname)
            hashes.add(hash)
