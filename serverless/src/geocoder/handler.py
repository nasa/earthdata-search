import logging
import os
import boto3

from e84_geoai_common.llm.models.nova import BedrockNovaLLM
from natural_language_geocoding import extract_geometry_from_text
from natural_language_geocoding.geocode_index.geocode_index_place_lookup import (
    GeocodeIndexPlaceLookup,
)

import sys

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

bedrock_llm_model = os.getenv("BEDROCK_LLM", "amazon.nova-pro-v1:0")

# The PlaceCache file name used by the natural-language-geocoding library
PLACE_CACHE_FILENAME = "hierarchical_place_cache_v2.json"

# Lazy-initialized singletons for reuse across invocations.
# GeocodeIndexPlaceLookup connects to OpenSearch and builds an index (~15s),
# so we only want to do this once per process, not per request.
# Using lazy init rather than module-level construction so that a transient
# failure (e.g. OpenSearch not ready at ECS startup) doesn't crash the import.
_bedrock_llm = None
_place_lookup = None

def _download_place_cache_from_s3():
    """
    Download the pre-built PlaceCache file from S3 to the local cache directory.
    This avoids the ~15s OpenSearch query that PlaceCache performs when the file
    doesn't exist locally. If the download fails, PlaceCache will fall back to
    building from OpenSearch.
    """
    cache_dir = os.getenv("GEOCODE_INDEX_CACHE_DIR")
    cache_bucket = os.getenv("GEOCODE_INDEX_CACHE_BUCKET")

    if not cache_dir or not cache_bucket:
        return

    local_path = os.path.join(cache_dir, PLACE_CACHE_FILENAME)

    # Skip download if the cache file already exists (warm invocation)
    if os.path.exists(local_path):
        logger.info("Place cache already exists at %s, skipping S3 download", local_path)
        return

    try:
        s3_client = boto3.client("s3")
        s3_key = PLACE_CACHE_FILENAME
        logger.info("Downloading place cache from s3://%s/%s", cache_bucket, s3_key)
        os.makedirs(cache_dir, exist_ok=True)
        s3_client.download_file(cache_bucket, s3_key, local_path)
        logger.info("Place cache downloaded to %s", local_path)
    except Exception as err:
        logger.warning(
            "Failed to download place cache from S3, will build from OpenSearch: %s",
            err,
        )


def _get_bedrock_llm():
    global _bedrock_llm
    if _bedrock_llm is None:
        _bedrock_llm = BedrockNovaLLM()
    return _bedrock_llm


def _get_place_lookup():
    global _place_lookup
    if _place_lookup is None:
        # Attempt to download pre-built cache from S3 before initializing.
        # If the file is present, PlaceCache skips the ~15s OpenSearch rebuild.
        _download_place_cache_from_s3()
        _place_lookup = GeocodeIndexPlaceLookup()
    return _place_lookup

# Convert text to geometry
def main(event, context):
    """
    Convert a natural language location query into a geometric representation using OpenSearch.

    This function uses a combination of AWS Bedrock's Nova LLM and OpenSearch to interpret
    natural language location descriptions and convert them into geometric representations.

    Args:
        event (dict): The event payload containing the location query.
        context (object): The context in which the function is called.

    Returns:
        str: A geometric representation of the location in WKT format.
            Returns None if an error occurs during the conversion process.
    """

    query = event.get("query", "")

    # TODO tmp debug logging
    logger.info(f"Received geocoding query: {query}")

    # If the query is empty, return an empty response
    if not query:
        return {
            'status_code': 200,
            'body': None
        }

    try:
        bedrock_llm = _get_bedrock_llm()
        place_lookup = _get_place_lookup()

        geometry = extract_geometry_from_text(bedrock_llm, query, place_lookup)
        bounding_box = geometry.bounds if geometry else None

        # Convert bounding_box to WKT POLYGON format if geometry was successfully extracted
        if bounding_box:
            sw_lon, sw_lat, ne_lon, ne_lat = bounding_box
            bounding_box_wkt = f"POLYGON(({sw_lon} {sw_lat}, {sw_lon} {ne_lat}, {ne_lon} {ne_lat}, {ne_lon} {sw_lat}, {sw_lon} {sw_lat}))"

            return {
                'status_code': 200,
                'body': bounding_box_wkt
            }
        else:
            return {
              'status_code': 400
            }
    except Exception as e:
        logger.error(f"Error in natural_language_geocoder: {str(e)}")
        return {
          'status_code': 500
        }
