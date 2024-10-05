#!/bin/bash
pushd /app/scripts

source venv/bin/activate
python process.py
deactivate
