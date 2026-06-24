# docker build -f geocoder.Dockerfile -t geocoder-lambda .
# docker run -p 4001:8080 geocoder-lambda

FROM public.ecr.aws/lambda/python:3.13

ENV GEOCODE_INDEX_CACHE_BUCKET=cmr-nlp-geocoding-cache-sit
ENV GEOCODE_INDEX_CACHE_DIR=/tmp
ENV GEOCODE_INDEX_PORT=9200
ENV GEOCODE_INDEX_HOST=host.docker.internal
ENV GEOCODE_INDEX_REGION=us-east-1
ENV AWS_DEFAULT_REGION=us-east-1

# Copy geocoder directory to the container
COPY serverless/src/geocoder/ ${LAMBDA_TASK_ROOT}

# Install dependencies
RUN pip install -r requirements.txt

CMD ["handler.main"]
