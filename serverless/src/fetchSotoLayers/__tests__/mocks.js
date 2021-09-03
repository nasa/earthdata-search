export const sotoResponse = `<Capabilities xmlns="http://www.opengis.net/wmts/1.0"
xmlns:ows="http://www.opengis.net/ows/1.1"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
<Contents>
  <Layer>
    <ows:Title xml:lang="en"> Sea Surface Temperature (L3, Day, Daily, Thermal, 4km, v2014.0, Standard, MODIS, Terra) </ows:Title>
    <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
      <ows:LowerCorner>-180 -90</ows:LowerCorner>
      <ows:UpperCorner>180 90</ows:UpperCorner>
    </ows:WGS84BoundingBox>
    <ows:Identifier>MODIS_Terra_L3_SST_Thermal_4km_Day_Daily</ows:Identifier>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.0" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.0/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <Style isDefault="true">
      <ows:Title xml:lang="en">default</ows:Title>
      <ows:Identifier>default</ows:Identifier>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_V.svg" xlink:title="GIBS Color Map Legend: Vertical" width="135" height="287"/>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_H.svg" xlink:title="GIBS Color Map Legend: Horizontal" width="377" height="85"/>
    </Style>
    <Format>image/png</Format>
    <TileMatrixSetLink>
      <TileMatrixSet>2km</TileMatrixSet>
    </TileMatrixSetLink>
    <ResourceURL format="image/png" resourceType="tile" template="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_L3_SST_Thermal_4km_Day_Daily/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
  </Layer>
  <Layer>
    <ows:Title xml:lang="en"> Sea Surface Temperature (L3, Night, Daily, Thermal, 4km, v2014.0, Standard, MODIS, Terra) </ows:Title>
    <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
      <ows:LowerCorner>-180 -90</ows:LowerCorner>
      <ows:UpperCorner>180 90</ows:UpperCorner>
    </ows:WGS84BoundingBox>
    <ows:Identifier>MODIS_Terra_L3_SST_Thermal_4km_Night_Daily</ows:Identifier>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.0" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.0/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <Style isDefault="true">
      <ows:Title xml:lang="en">default</ows:Title>
      <ows:Identifier>default</ows:Identifier>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_V.svg" xlink:title="GIBS Color Map Legend: Vertical" width="135" height="287"/>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_H.svg" xlink:title="GIBS Color Map Legend: Horizontal" width="377" height="85"/>
    </Style>
    <Format>image/png</Format>
    <TileMatrixSetLink>
      <TileMatrixSet>2km</TileMatrixSet>
    </TileMatrixSetLink>
    <ResourceURL format="image/png" resourceType="tile" template="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_L3_SST_Thermal_4km_Night_Daily/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
  </Layer>
  <Layer>
    <ows:Title xml:lang="en"> Sea Surface Temperature (L3, Day, Daily, Thermal, 4km, v2014.0, Standard, MODIS, Aqua) </ows:Title>
    <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
      <ows:LowerCorner>-180 -90</ows:LowerCorner>
      <ows:UpperCorner>180 90</ows:UpperCorner>
    </ows:WGS84BoundingBox>
    <ows:Identifier>MODIS_Aqua_L3_SST_Thermal_4km_Day_Daily</ows:Identifier>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.0" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.0/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <Style isDefault="true">
      <ows:Title xml:lang="en">default</ows:Title>
      <ows:Identifier>default</ows:Identifier>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_V.svg" xlink:title="GIBS Color Map Legend: Vertical" width="135" height="287"/>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_H.svg" xlink:title="GIBS Color Map Legend: Horizontal" width="377" height="85"/>
    </Style>
    <Format>image/png</Format>
    <TileMatrixSetLink>
      <TileMatrixSet>2km</TileMatrixSet>
    </TileMatrixSetLink>
    <ResourceURL format="image/png" resourceType="tile" template="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Aqua_L3_SST_Thermal_4km_Day_Daily/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
  </Layer>
  <Layer>
    <ows:Title xml:lang="en"> Sea Surface Temperature (L3, Night, Daily, Thermal, 4km, v2014.0, Standard, MODIS, Aqua) </ows:Title>
    <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
      <ows:LowerCorner>-180 -90</ows:LowerCorner>
      <ows:UpperCorner>180 90</ows:UpperCorner>
    </ows:WGS84BoundingBox>
    <ows:Identifier>MODIS_Aqua_L3_SST_Thermal_4km_Night_Daily</ows:Identifier>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.0" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.0/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Sea_Surface_Temperature.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <Style isDefault="true">
      <ows:Title xml:lang="en">default</ows:Title>
      <ows:Identifier>default</ows:Identifier>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_V.svg" xlink:title="GIBS Color Map Legend: Vertical" width="135" height="287"/>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" xlink:href="https://gibs.earthdata.nasa.gov/legends/MODIS_Sea_Surface_Temperature_H.svg" xlink:title="GIBS Color Map Legend: Horizontal" width="377" height="85"/>
    </Style>
    <Format>image/png</Format>
    <TileMatrixSetLink>
      <TileMatrixSet>2km</TileMatrixSet>
    </TileMatrixSetLink>
    <ResourceURL format="image/png" resourceType="tile" template="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Aqua_L3_SST_Thermal_4km_Night_Daily/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
  </Layer>
  <Layer>
    <ows:Title xml:lang="en"> Sea Surface Temperature Anomalies (L4, Best Available, MUR, GHRSST) </ows:Title>
    <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
      <ows:LowerCorner>-180 -90</ows:LowerCorner>
      <ows:UpperCorner>180 90</ows:UpperCorner>
    </ows:WGS84BoundingBox>
    <ows:Identifier>GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies</ows:Identifier>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_Sea_Surface_Temperature_Anomalies.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.0" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.0/GHRSST_Sea_Surface_Temperature_Anomalies.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/GHRSST_Sea_Surface_Temperature_Anomalies.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
    <Style isDefault="true">
      <ows:Title xml:lang="en">default</ows:Title>
      <ows:Identifier>default</ows:Identifier>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" xlink:href="https://gibs.earthdata.nasa.gov/legends/GHRSST_Sea_Surface_Temperature_Anomalies_V.svg" xlink:title="GIBS Color Map Legend: Vertical" width="135" height="287"/>
      <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" xlink:href="https://gibs.earthdata.nasa.gov/legends/GHRSST_Sea_Surface_Temperature_Anomalies_H.svg" xlink:title="GIBS Color Map Legend: Horizontal" width="377" height="85"/>
    </Style>
    <Format>image/png</Format>
    <TileMatrixSetLink>
      <TileMatrixSet>1km</TileMatrixSet>
    </TileMatrixSetLink>
    <ResourceURL format="image/png" resourceType="tile" template="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
  </Layer>
</Contents>
</Capabilities>`
