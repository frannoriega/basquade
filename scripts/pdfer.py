import sys
import subprocess
import re
import os

def convert_to(folder, source, timeout=None):
    args = [libreoffice_exec(), '--headless', '--convert-to', 'pdf', '--outdir', folder, source]

    process = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout)
    filename = re.search('-> (.*?) using filter', process.stdout.decode())

    return filename.group(1)


def libreoffice_exec():
    # TODO: Provide support for more platforms
    if sys.platform == 'darwin':
        return '/Applications/LibreOffice.app/Contents/MacOS/soffice'
    return 'soffice'

for root, dirs, files in os.walk('libros'):
    for file in files:
        if file.endswith('.rtf') or file.endswith('.docx') or file.endswith('.doc'):
            fullname = os.path.join(root, file)
            print(root)
            print(fullname)
            convert_to(root, fullname)
