export const gibsError = `<ExceptionReport xmlns="http://www.opengis.net/ows/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://schemas.opengis.net/ows/1.1.0/owsExceptionReport.xsd" version="1.1.0" xml:lang="en">
  <Exception exceptionCode="InvalidParameterValue" locator="REQUEST">
    <ExceptionText>Unrecognized request</ExceptionText>
  </Exception>
</ExceptionReport>`

export const gibsResponse = `<Capabilities
    xmlns="http://www.opengis.net/wmts/1.0"
    xmlns:ows="http://www.opengis.net/ows/1.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
    <Contents>
        <Layer>
            <ows:Title xml:lang="en">Deep Blue Aerosol Angstrom Exponent (Best Available, VIIRS, SNPP)</ows:Title>
            <ows:WGS84BoundingBox crs="urn:ogc:def:crs:OGC:2:84">
                <ows:LowerCorner>-180 -90</ows:LowerCorner>
                <ows:UpperCorner>180 90</ows:UpperCorner>
            </ows:WGS84BoundingBox>
            <ows:Identifier>VIIRS_SNPP_Angstrom_Exponent_Deep_Blue_Best_Estimate</ows:Identifier>
            <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Angstrom_Exponent_Deep_Blue.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
            <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.0" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.0/VIIRS_Angstrom_Exponent_Deep_Blue.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
            <ows:Metadata xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3" xlink:href="https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Angstrom_Exponent_Deep_Blue.xml" xlink:title="GIBS Color Map: Data - RGB Mapping"/>
            <Style isDefault="true">
                <ows:Title xml:lang="en">default</ows:Title>
                <ows:Identifier>default</ows:Identifier>
                <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/vertical" xlink:href="https://gibs.earthdata.nasa.gov/legends/VIIRS_Angstrom_Exponent_Deep_Blue_V.svg" xlink:title="GIBS Color Map Legend: Vertical" width="135" height="287"/>
                <LegendURL format="image/svg+xml" xlink:type="simple" xlink:role="http://earthdata.nasa.gov/gibs/legend-type/horizontal" xlink:href="https://gibs.earthdata.nasa.gov/legends/VIIRS_Angstrom_Exponent_Deep_Blue_H.svg" xlink:title="GIBS Color Map Legend: Horizontal" width="377" height="85"/>
            </Style>
            <Format>image/png</Format>
            <Dimension>
                <ows:Identifier>Time</ows:Identifier>
                <ows:UOM>ISO8601</ows:UOM>
                <Default>2020-10-02</Default>
                <Current>false</Current>
                <Value>2012-03-01/2020-10-02/P1D</Value>
            </Dimension>
            <TileMatrixSetLink>
                <TileMatrixSet>2km</TileMatrixSet>
            </TileMatrixSetLink>
            <ResourceURL format="image/png" resourceType="tile" template="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_SNPP_Angstrom_Exponent_Deep_Blue_Best_Estimate/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"/>
        </Layer>
        <TileMatrixSet>
            <ows:Identifier>2km</ows:Identifier>
            <ows:SupportedCRS>urn:ogc:def:crs:OGC:1.3:CRS84</ows:SupportedCRS>
            <TileMatrix>
                <ows:Identifier>0</ows:Identifier>
                <ScaleDenominator>223632905.6114871</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>2</MatrixWidth>
                <MatrixHeight>1</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>1</ows:Identifier>
                <ScaleDenominator>111816452.8057436</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>3</MatrixWidth>
                <MatrixHeight>2</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>2</ows:Identifier>
                <ScaleDenominator>55908226.40287178</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>5</MatrixWidth>
                <MatrixHeight>3</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>3</ows:Identifier>
                <ScaleDenominator>27954113.20143589</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>10</MatrixWidth>
                <MatrixHeight>5</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>4</ows:Identifier>
                <ScaleDenominator>13977056.60071795</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>20</MatrixWidth>
                <MatrixHeight>10</MatrixHeight>
            </TileMatrix>
            <TileMatrix>
                <ows:Identifier>5</ows:Identifier>
                <ScaleDenominator>6988528.300358973</ScaleDenominator>
                <TopLeftCorner>-180 90</TopLeftCorner>
                <TileWidth>512</TileWidth>
                <TileHeight>512</TileHeight>
                <MatrixWidth>40</MatrixWidth>
                <MatrixHeight>20</MatrixHeight>
            </TileMatrix>
        </TileMatrixSet>
    </Contents>
    <ServiceMetadataURL xlink:href="https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml"/>
</Capabilities>`
