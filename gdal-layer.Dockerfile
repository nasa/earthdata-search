# Builds an arm64 Lambda layer containing GDAL's `ogr2ogr`, used by the `convertShapefile` lambda.
#
#   npm run build:gdal-layer
#
# Output: layers/gdal-<GDAL_VERSION>-arm64.zip
#
# Lambda extracts layers into `/opt`, so everything is built with an `/opt` prefix. `/opt/bin` is
# already on the Lambda `PATH`, which lets the `ogr2ogr` npm package find the binary without configuration.
#
# To update GDAL or PROJ, change the versions below and run `npm run build:gdal-layer`. See the README.

ARG GDAL_VERSION=3.13.3
ARG PROJ_VERSION=9.9.0

# Amazon Linux 2023 is the OS used by the Node.js 22 Lambda runtime
FROM --platform=$BUILDPLATFORM public.ecr.aws/amazonlinux/amazonlinux:2023 AS build

ARG GDAL_VERSION
ARG PROJ_VERSION

RUN dnf install -y \
    binutils \
    cmake \
    findutils \
    gcc-c++ \
    gzip \
    make \
    sqlite \
    sqlite-devel \
    tar \
    zip \
  && dnf clean all

WORKDIR /build

# Install into `/opt` and make binaries look for their libraries in `../lib` relative to themselves
ENV CMAKE_COMMON_OPTIONS="-DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/opt -DCMAKE_INSTALL_LIBDIR=lib -DCMAKE_INSTALL_RPATH=\$ORIGIN/../lib -DBUILD_TESTING=OFF"

# PROJ is required by GDAL for reprojection (`-t_srs EPSG:4326`). TIFF and curl are only
# needed for downloading remote transformation grids, which we don't use
RUN curl -fsSL https://download.osgeo.org/proj/proj-${PROJ_VERSION}.tar.gz | tar xz \
  && cmake -S proj-${PROJ_VERSION} -B proj-build ${CMAKE_COMMON_OPTIONS} \
    -DBUILD_APPS=OFF \
    -DENABLE_CURL=OFF \
    -DENABLE_TIFF=OFF \
  && cmake --build proj-build -j"$(nproc)" \
  && cmake --install proj-build

# Minimal GDAL build to keep the layer well under Lambda's 250 MB unzipped limit: no language
# bindings, no optional external libraries, and only the vector drivers `convertShapefile` needs
RUN curl -fsSL https://download.osgeo.org/gdal/${GDAL_VERSION}/gdal-${GDAL_VERSION}.tar.gz | tar xz \
  && cmake -S gdal-${GDAL_VERSION} -B gdal-build ${CMAKE_COMMON_OPTIONS} \
    -DCMAKE_PREFIX_PATH=/opt \
    -DBUILD_CSHARP_BINDINGS=OFF \
    -DBUILD_JAVA_BINDINGS=OFF \
    -DBUILD_PYTHON_BINDINGS=OFF \
    -DGDAL_BUILD_OPTIONAL_DRIVERS=OFF \
    -DGDAL_USE_EXTERNAL_LIBS=OFF \
    -DGDAL_USE_ZLIB_INTERNAL=ON \
    -DOGR_BUILD_OPTIONAL_DRIVERS=OFF \
    -DOGR_ENABLE_DRIVER_GEOJSON=ON \
    -DOGR_ENABLE_DRIVER_SHAPE=ON \
  && cmake --build gdal-build -j"$(nproc)" \
  && cmake --install gdal-build

# Assemble the layer contents. sqlite is a PROJ runtime dependency that isn't guaranteed
# to exist in the Lambda runtime, so it is bundled as well
RUN mkdir -p /layer/bin /layer/lib /layer/share \
  && cp /opt/bin/ogr2ogr /layer/bin/ \
  && cp -P /opt/lib/libgdal.so* /opt/lib/libproj.so* /usr/lib64/libsqlite3.so* /layer/lib/ \
  && cp -r /opt/share/gdal /opt/share/proj /layer/share/ \
  && find /layer/bin /layer/lib -type f -exec strip --strip-unneeded {} + \
  && cd /layer \
  && zip -r9y /gdal-${GDAL_VERSION}-arm64.zip .

# Verify the layer works in the actual Lambda runtime image, using only the files in the layer
FROM --platform=$BUILDPLATFORM public.ecr.aws/lambda/nodejs:22 AS test

ARG GDAL_VERSION

# These match the environment variables the `convertShapefile` lambda needs
ENV GDAL_DATA=/opt/share/gdal
ENV PROJ_DATA=/opt/share/proj

COPY --from=build /layer /opt
COPY --from=build /gdal-${GDAL_VERSION}-arm64.zip /

WORKDIR /tmp/layer-test

# Round trip a point through a reprojected shapefile and back to GeoJSON in EPSG:4326
RUN /opt/bin/ogr2ogr --version \
  && printf '%s' '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"test"},"geometry":{"type":"Point","coordinates":[-77,38]}}]}' > input.geojson \
  && /opt/bin/ogr2ogr -f "ESRI Shapefile" output.shp input.geojson -t_srs EPSG:3857 \
  && /opt/bin/ogr2ogr -f GeoJSON /vsistdout/ output.shp -t_srs EPSG:4326 > result.geojson \
  && cat result.geojson \
  && test -s result.geojson

# Only export the zip. Copying from the `test` stage ensures the tests run before it is exported
FROM scratch
ARG GDAL_VERSION
COPY --from=test /gdal-${GDAL_VERSION}-arm64.zip /
