/* eslint-disable no-useless-escape */
export const osdd = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:eo="http://a9.com/-/opensearch/extensions/eo/1.0/" xmlns:geo="http://a9.com/-/opensearch/extensions/geo/1.0/" xmlns:param="http://a9.com/-/spec/opensearch/extensions/parameters/1.0/" xmlns:semantic="http://a9.com/-/opensearch/extensions/semantic/1.0/" xmlns:sru="http://a9.com/-/opensearch/extensions/sru/2.0/" xmlns:time="http://a9.com/-/opensearch/extensions/time/1.0/" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
<ShortName>FEDEO</ShortName>
<Description>Provides interoperable access, following ISO/OGC interface guidelines, to Earth Observation metadata.</Description>
<Tags>FEDEO, ESA, Earth Observation, Digital Repository, HMA, HMA-S, HMA-SE, CEOS-OS-BP-V1.1/L1.</Tags>
<Url rel="self" template="https://fedeo.ceos.org/opensearch/description.xml?parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10" type="application/opensearchdescription+xml"/>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Fsru%2Bxml&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}&amp;recordSchema={sru:recordSchema?}" type="application/sru+xml">

        <param:Parameter maximum="1" minimum="0" name="recordSchema" title="XML/GeoJson schema of the records to be supplied in the response." value="{sru:recordSchema}">
            <param:Option label="OM" value="OM"/>
            <param:Option label="OM11" value="OM11"/>
            <param:Option label="ISO" value="ISO"/>
            <param:Option label="DC" value="DC"/>
            <param:Option label="GeoJson" value="geojson"/>
            <param:Option label="server-choice" value="server-choice"/>
        </param:Parameter>





        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Fmetalink%2Bxml&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}" type="application/metalink+xml">







        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Fmetalink4%2Bxml&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}" type="application/metalink4+xml">







        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Frdf%2Bxml&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}" type="application/rdf+xml">







        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Fld%2Bjson&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}" type="application/ld+json">







        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=text%2Fturtle&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}" type="text/turtle">







        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Fgeo%2Bjson&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}" type="application/geo+json">







        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Url xmlns:os="http://a9.com/-/spec/opensearch/1.1/" indexOffset="1" pageOffset="1" rel="results" template="https://fedeo.ceos.org/opensearch/request?httpAccept=application%2Fatom%2Bxml&amp;parentIdentifier=urn:ogc:def:EOP:VITO:VGT_S10&amp;maximumRecords={count?}&amp;startRecord={startIndex?}&amp;startPage={startPage?}&amp;query={searchTerms?}&amp;uid={geo:uid?}&amp;productType={eo:productType?}&amp;productionStatus={eo:productionStatus?}&amp;acquisitionType={eo:acquisitionType?}&amp;platform={eo:platform?}&amp;platformSerialIdentifier={eo:platformSerialIdentifier?}&amp;orbitDirection={eo:orbitDirection?}&amp;processorName={eo:processorName?}&amp;processingCenter={eo:processingCenter?}&amp;archivingCenter={eo:archivingCenter?}&amp;acquisitionStation={eo:acquisitionStation?}&amp;polarisationMode={eo:polarisationMode?}&amp;polarisationChannels={eo:polarisationChannels?}&amp;orbitNumber={eo:orbitNumber?}&amp;cloudCover={eo:cloudCover?}&amp;snowCover={eo:snowCover?}&amp;resolution={eo:resolution?}&amp;modificationDate={eo:modificationDate?}&amp;startDate={time:start?}&amp;endDate={time:end?}&amp;lat={geo:lat?}&amp;lon={geo:lon?}&amp;radius={geo:radius?}&amp;name={geo:name?}&amp;bbox={geo:box?}&amp;geometry={geo:geometry?}&amp;relation={geo:relation?}&amp;sortKeys={sru:sortKeys?}&amp;recordSchema={sru:recordSchema?}" type="application/atom+xml">

        <param:Parameter maximum="1" minimum="0" name="recordSchema" title="XML/GeoJson schema of the records to be supplied in the response." value="{sru:recordSchema}">
            <param:Option label="OM" value="OM"/>
            <param:Option label="OM11" value="OM11"/>
            <param:Option label="ISO" value="ISO"/>
            <param:Option label="DC" value="DC"/>
            <param:Option label="GeoJson" value="geojson"/>
            <param:Option label="server-choice" value="server-choice"/>
        </param:Parameter>





        <param:Parameter maximum="1" minimum="0" name="uid" pattern="[\w-]+" title="Local identifier of the record in the repository context." value="{geo:uid}"/>
        <param:Parameter maximum="1" minimum="0" name="productType" title="String identifying the entry type." value="{eo:productType}">
            <param:Option label="VGT_S10" value="VGT_S10"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="productionStatus" title="String identifying the status of the entry." value="{eo:productionStatus}">
            <param:Option label="CANCELLED" value="CANCELLED"/>
            <param:Option label="ARCHIVED" value="ARCHIVED"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionType" title="Used to distinguish at a high level the appropriateness of the acquisition for general use." value="{eo:acquisitionType}">
            <param:Option label="NOMINAL" value="NOMINAL"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platform" title="String with the platform short name." value="{eo:platform}">
            <param:Option label="SV04" value="SV04"/>
            <param:Option label="SV05" value="SV05"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="platformSerialIdentifier" title="String with the platform serial identifier." value="{eo:platformSerialIdentifier}">
            <param:Option label="4" value="4"/>
            <param:Option label="5" value="5"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="orbitDirection" title="String identifying the acquisition orbit direction." value="{eo:orbitDirection}">
            <param:Option label="ASCENDING" value="ASCENDING"/>
            <param:Option label="DESCENDING" value="DESCENDING"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="processorName" pattern="[\w-]+" title="String identifying the processor software name." value="{eo:processorName}"/>
        <param:Parameter maximum="1" minimum="0" name="processingCenter" title="String identifying the processing center." value="{eo:processingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="archivingCenter" title="String identifying the archiving center." value="{eo:archivingCenter}">
            <param:Option label="VITO" value="VITO"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="acquisitionStation" pattern="[\w-]+" title="String identifying the station used for the acquisition." value="{eo:acquisitionStation}"/>

        <param:Parameter maximum="1" minimum="0" name="polarisationMode" title="String identifying the polarisation mode. S (for single), D (for dual), T (for twin) or Q (for quad)." value="{eo:polarisationMode}">
            <param:Option label="Q" value="Q"/>
            <param:Option label="S" value="S"/>
            <param:Option label="D" value="D"/>
            <param:Option label="T" value="T"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="polarisationChannels" title="String identifying the polarisation transmit/receive configuration." value="{eo:polarisationChannels}">
            <param:Option label="HH" value="HH"/>
            <param:Option label="VV" value="VV"/>
            <param:Option label="HH, HV" value="HH, HV"/>
            <param:Option label="VH, VV" value="VH, VV"/>
            <param:Option label="HV" value="HV"/>
            <param:Option label="HH, VH" value="HH, VH"/>
            <param:Option label="VH" value="VH"/>
            <param:Option label="VV, HV" value="VV, HV"/>
            <param:Option label="VV, VH" value="VV, VH"/>
            <param:Option label="HV, VH" value="HV, VH"/>
            <param:Option label="HH, HV, VH, VV" value="HH, HV, VH, VV"/>
            <param:Option label="HH, VV" value="HH, VV"/>
            <param:Option label="VH, HV" value="VH, HV"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="orbitNumber" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval requesting the acquisition orbit." value="{eo:orbitNumber}"/>

        <param:Parameter maximum="1" minimum="0" name="cloudCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the cloud cover % (0-100)." value="{eo:cloudCover}"/>
        <param:Parameter maximum="1" minimum="0" name="snowCover" pattern="([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)|(\{([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)(,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?))*\})|(([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,?)|(\,?([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]])|([\[\]]([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)\,([1-9]?[0-9](\.[0-9]+)?|100(\.0+)?)[\[\]]))" title="A number, set or interval of the snow cover % (0-100)." value="{eo:snowCover}"/>
        <param:Parameter maximum="1" minimum="0" name="resolution" pattern="([1-9][0-9]*|0)|(\{([1-9][0-9]*|0)(,([1-9][0-9]*|0))*\})|(([\[\]]([1-9][0-9]*|0)\,?)|(\,?([1-9][0-9]*|0)[\[\]])|([\[\]]([1-9][0-9]*|0)\,([1-9][0-9]*|0)[\[\]]))" title="A number, set or interval of the resolution." value="{eo:resolution}">
            <param:Option label="1000" value="1000"/>
        </param:Parameter>


        <param:Parameter maximum="1" minimum="0" name="modificationDate" pattern="([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)|(\{([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)(,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?))*\})|(([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,?)|(\,?([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]])|([\[\]]([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)\,([0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?)[\[\]]))" title="A dateTime of a significant update of the metadata resource." value="{eo:modificationDate}"/>
        <param:Parameter maximum="1" minimum="0" name="startDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="Start of the temporal interval to search." value="{time:start}"/>
        <param:Parameter maximum="1" minimum="0" name="endDate" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?(Z|[\+\-][0-9]{2}:[0-9]{2})?)?" title="End of the temporal interval to search." value="{time:end}"/>

        <param:Parameter maximum="1" minimum="0" name="lat" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The latitude of a given point." value="{geo:lat}"/>
        <param:Parameter maximum="1" minimum="0" name="lon" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="The longitude of a given point." value="{geo:lon}"/>
        <param:Parameter maximum="1" minimum="0" name="radius" pattern="-?([1-9][0-9]*|0)(\.[0-9]+)?" title="A search radius from a lat-lon point (expressed in meters. No default value)." value="{geo:radius}"/>
        <param:Parameter maximum="1" minimum="0" name="name" pattern="[\pL\pN\pZs\pS\pP]+" title="A location criteria (Googleplace name) to perform the search.  Example : Paris, Belgium" value="{geo:name}"/>
        <param:Parameter maximum="1" minimum="0" name="bbox" pattern="-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?" title="Geographic bounding box in EPSG:4326." value="{geo:box}"/>
        <param:Parameter maximum="1" minimum="0" name="geometry" pattern="(?i)(POINT ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?\))|(LINESTRING ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))|(POLYGON ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))|(MULTIPOLYGON ?\(\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\)(, ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?){3,}\))*\))*\))|(MULTILINESTRING ?\(\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\)(, ?\(-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?(, ?-?[0-9]+(\.[0-9]+)? -?[0-9]+(\.[0-9]+)?)+\))*\))" title="Geographic area (geometry)." value="{geo:geometry}">
            <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="http://www.opengis.net/wkt/POLYGON" rel="profile" title="This service accepts WKT Polygons"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="relation" title="Spatial relation to result set (contains expects results that are fully inside the requested value)." value="{geo:relation}">
            <param:Option label="geometry intersects the query geometry (default)" value="intersects"/>
            <param:Option label="geometry is within the query geometry" value="contains"/>
            <param:Option label="geometry and the query geometry are disjoint" value="disjoint"/>
        </param:Parameter>
        <param:Parameter maximum="1" minimum="0" name="sortKeys" pattern="[a-zA-Z0-9,:. \\-]+" title="Specifies how to sort the result set.  It consists of one or more space separated sort keys, each with one or more of the following sub-parameters: a parameter (to sort against), a blank field, a boolean (0/1) indicating if the sort is ascending, a blank field, a parameter indicating what value to take for documents without the sort parameter (highValue/lowValue) " value="{sru:sortKeys}"/>


    <param:Parameter name="query" title="Textual search in the title, abstract or keyword section of the collection. Surround with double quotes for exact match." value="{searchTerms}"/>
</os:Url>
<os:Query xmlns:os="http://a9.com/-/spec/opensearch/1.1/" role="example" time:end="2016-07-02T12:30:15Z" time:start="2015-07-02T12:30:15Z"/>
<LongName>Earth Observation Catalogue</LongName>
<Image height="64" type="image/png" width="64">https://fedeo.ceos.org/opensearch/images/esa_favicon.ico</Image>
<Image height="16" type="image/vnd.microsoft.icon" width="16">https://fedeo.ceos.org/opensearch/images/esa_favicon.ico</Image>
<Developer>Spacebel s.a.</Developer>
<Attribution>Copyright 2017-2018, European Space Agency.</Attribution>
<SyndicationRight>open</SyndicationRight>
<AdultContent>false</AdultContent>
<Language>en-us</Language>
<OutputEncoding>UTF-8</OutputEncoding>
<InputEncoding>UTF-8</InputEncoding>
</OpenSearchDescription>
`
