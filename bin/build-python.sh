#!/bin/bash

cd serverless/src/geocoder || exit 1
pip install -r requirements.txt -t .
