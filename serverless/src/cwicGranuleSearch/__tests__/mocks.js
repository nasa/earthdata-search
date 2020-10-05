export const cwicOsddResponse = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:cwic="http://cwic.wgiss.ceos.org/opensearch/extensions/1.0/" xmlns:dc="http://purl.org/dc/terms/" xmlns:esipdiscover="http://commons.esipfed.org/ns/discovery/1.2/" xmlns:geo="http://a9.com/-/opensearch/extensions/geo/1.0/" xmlns:params="http://a9.com/-/spec/opensearch/extensions/parameters/1.0/" xmlns:time="http://a9.com/-/opensearch/extensions/time/1.0/">
   <ShortName>CWIC OpenSearch</ShortName>
   <Description>CEOS WGISS Integrated Catalog OpenSearch</Description>
   <Url type="application/atom+xml" indexOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="1" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="1" minInclusive="2018-11-07T00:00:00Z" maxExclusive="2020-07-11" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="1" minExclusive="2018-11-07T00:00:00Z" maxInclusive="2020-07-11" />
      <params:Parameter name="startIndex" value="{startIndex}" title="Index number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" maxInclusive="200" />
   </Url>
   <Url type="application/atom+xml" pageOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startPage={startPage?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="1" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="1" minInclusive="2018-11-07T00:00:00Z" maxExclusive="2020-07-11" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="1" minExclusive="2018-11-07T00:00:00Z" maxInclusive="2020-07-11" />
      <params:Parameter name="startPage" value="{startPage}" title="Page number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" maxInclusive="200" />
   </Url>
   <Url type="text/html" indexOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="1" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="1" minInclusive="2018-11-07T00:00:00Z" maxExclusive="2020-07-11" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="1" minExclusive="2018-11-07T00:00:00Z" maxInclusive="2020-07-11" />
      <params:Parameter name="startIndex" value="{startIndex}" title="Index number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" maxInclusive="200" />
   </Url>
   <Url type="text/html" pageOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?datasetId=C1597928934-NOAA_NCEI&amp;startPage={startPage?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="1" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="1" minInclusive="2018-11-07T00:00:00Z" maxExclusive="2020-07-11" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="1" minExclusive="2018-11-07T00:00:00Z" maxInclusive="2020-07-11" />
      <params:Parameter name="startPage" value="{startPage}" title="Page number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" maxInclusive="200" />
   </Url>
   <Url type="application/atom+xml" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?uid={geo:uid}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="uid" value="{geo:uid}" title="CWIC granule id desired by the search client" minimum="1" />
   </Url>
   <Url type="text/html" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?uid={geo:uid}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="uid" value="{geo:uid}" title="CWIC granule id desired by the search client" minimum="1" />
   </Url>
   <Url type="application/atom+xml" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?id={dc:identifier}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="id" value="{dc:identifier}" title="CWIC granule id desired by the search client" minimum="1" />
   </Url>
   <Url type="text/html" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?id={dc:identifier}&amp;clientId=eed-edsc-dev">
      <params:Parameter name="id" value="{dc:identifier}" title="CWIC granule id desired by the search client" minimum="1" />
   </Url>
   <Query role="example" cwic:datasetId="C1597928934-NOAA_NCEI" startIndex="1" count="10" geo:box="-180,-90,180,90" time:start="2018-11-07T00:00:00Z" time:end="2020-07-11" esipdiscover:clientId="eed-edsc-dev" />
   <Tags>CWIC,CEOS,WGISS,OpenSearch</Tags>
   <Contact>cwic-help@wgiss.ceos.org</Contact>
   <Image>http://www.ceos.org/favicon.ico</Image>
   <Developer>CWIC Development Team</Developer>
   <Attribution>GHRSST</Attribution>
   <SyndicationRight>open</SyndicationRight>
   <Language>en-us</Language>
   <OutputEncoding>UTF-8</OutputEncoding>
   <InputEncoding>UTF-8</InputEncoding>
</OpenSearchDescription>`

export const cwicOsddErrorResponse = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:dc="http://purl.org/dc/terms/" xmlns:esipdiscover="http://commons.esipfed.org/ns/discovery/1.2/" xmlns:geo="http://a9.com/-/opensearch/extensions/geo/1.0/" xmlns:params="http://a9.com/-/spec/opensearch/extensions/parameters/1.0/" xmlns:time="http://a9.com/-/opensearch/extensions/time/1.0/">
   <ShortName>Exception</ShortName>
   <Description>REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset</Description>
   <Url type="application/atom+xml" indexOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId={dc:identifier}&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start?}&amp;timeEnd={time:end?}&amp;geoBox={geo:box?}&amp;clientId={esipdiscover:client_id?}">
      <params:Parameter name="datasetId" value="{dc:identifier}" title="CMR Concept ID desired by the search client" minimum="1" />
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="0" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="0" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="0" />
      <params:Parameter name="startIndex" value="{startIndex}" title="Index number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="clientId" value="{esipdiscover:client_id?}" title="Client ID" minimum="1" />
   </Url>
   <Url type="application/atom+xml" pageOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId={dc:identifier}&amp;startPage={startPage?}&amp;count={count?}&amp;timeStart={time:start?}&amp;timeEnd={time:end?}&amp;geoBox={geo:box?}&amp;clientId={esipdiscover:client_id?}">
      <params:Parameter name="datasetId" value="{dc:identifier}" title="CMR Concept ID desired by the search client" minimum="1" />
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="0" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="0" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="0" />
      <params:Parameter name="startPage" value="{startPage}" title="Page number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="clientId" value="{esipdiscover:client_id?}" title="Client ID" minimum="1" />
   </Url>
   <Url type="text/html" indexOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?datasetId={dc:identifier}&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start?}&amp;timeEnd={time:end?}&amp;geoBox={geo:box?}&amp;clientId={esipdiscover:client_id?}">
      <params:Parameter name="datasetId" value="{dc:identifier}" title="CMR Concept ID desired by the search client" minimum="1" />
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="0" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="0" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="0" />
      <params:Parameter name="startIndex" value="{startIndex}" title="Index number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="clientId" value="{esipdiscover:client_id?}" title="Client ID" minimum="1" />
   </Url>
   <Url type="text/html" pageOffset="0" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?datasetId={dc:identifier}&amp;startPage={startPage?}&amp;count={count?}&amp;timeStart={time:start?}&amp;timeEnd={time:end?}&amp;geoBox={geo:box?}&amp;clientId={esipdiscover:client_id?}">
      <params:Parameter name="datasetId" value="{dc:identifier}" title="CMR Concept ID desired by the search client" minimum="1" />
      <params:Parameter name="geoBox" value="{geo:box}" title="inventory which has a spatial extent overlapping this bounding box" minimum="0" />
      <params:Parameter name="timeStart" value="{time:start}" title="inventory which has a temporal extent containing this start time" minimum="0" />
      <params:Parameter name="timeEnd" value="{time:end}" title="inventory which has a temporal extent containing this end time" minimum="0" />
      <params:Parameter name="startPage" value="{startPage}" title="Page number of the set of search results desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="count" value="{count}" title="Number of search results per page desired by the search client" minimum="0" minInclusive="1" />
      <params:Parameter name="clientId" value="{esipdiscover:client_id?}" title="Client ID" minimum="1" />
   </Url>
   <Url type="application/atom+xml" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?uid={geo:uid}&amp;clientId={esipdiscover:client_id?}">
      <params:Parameter name="uid" value="{geo:uid}" title="CWIC granule id desired by the search client" minimum="1" />
      <params:Parameter name="clientId" value="{esipdiscover:client_id?}" title="Client ID" minimum="1" />
   </Url>
   <Url type="text/html" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?uid={geo:uid}&amp;clientId={esipdiscover:client_id?}">
      <params:Parameter name="uid" value="{geo:uid}" title="CWIC granule id desired by the search client" minimum="1" />
      <params:Parameter name="clientId" value="{esipdiscover:client_id?}" title="Client ID" minimum="1" />
   </Url>
   <Url type="application/atom+xml" template="https://cwic.wgiss.ceos.org/opensearch/granules.atom?id={dc:identifier}&amp;clientId=@@CLIENTID@@">
      <params:Parameter name="id" value="{dc:identifier}" title="CWIC granule id desired by the search client" minimum="1" />
   </Url>
   <Url type="text/html" template="https://cwic.wgiss.ceos.org/opensearch/granules.html?id={dc:identifier}&amp;clientId=@@CLIENTID@@">
      <params:Parameter name="id" value="{dc:identifier}" title="CWIC granule id desired by the search client" minimum="1" />
   </Url>
   <Contact>cwic-help@wgiss.ceos.org</Contact>
</OpenSearchDescription>`

export const cwicGranuleTemplate = {
  indexOffset: '0',
  'params:Parameter': [
    {
      minimum: '1',
      name: 'geoBox',
      title: 'inventory which has a spatial extent overlapping this bounding box',
      value: '{geo:box}'
    },
    {
      maxExclusive: '2020-07-11',
      minInclusive: '2018-11-07T00:00:00Z',
      minimum: '1',
      name: 'timeStart',
      title: 'inventory which has a temporal extent containing this start time',
      value: '{time:start}'
    },
    {
      maxInclusive: '2020-07-11',
      minExclusive: '2018-11-07T00:00:00Z',
      minimum: '1',
      name: 'timeEnd',
      title: 'inventory which has a temporal extent containing this end time',
      value: '{time:end}'
    },
    {
      minInclusive: '1',
      minimum: '0',
      name: 'startIndex',
      title: 'Index number of the set of search results desired by the search client',
      value: '{startIndex}'
    },
    {
      maxInclusive: '200',
      minInclusive: '1',
      minimum: '0',
      name: 'count',
      title: 'Number of search results per page desired by the search client',
      value: '{count}'
    }
  ],
  template: 'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev',
  type: 'application/atom+xml'
}

export const cwicGranuleResponse = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:cwic="http://cwic.wgiss.ceos.org/opensearch/extensions/1.0/" xmlns:dc="http://purl.org/dc/terms/" xmlns:esipdiscover="http://commons.esipfed.org/ns/discovery/1.2/" xmlns:geo="http://a9.com/-/opensearch/extensions/geo/1.0/" xmlns:georss="http://www.georss.org/georss" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:time="http://a9.com/-/opensearch/extensions/time/1.0/">
   <title>CWIC OpenSearch Response</title>
   <updated>2020-07-11T16:18:03Z</updated>
   <author>
      <name>CEOS WGISS Integrated Catalog (CWIC) - CWIC Contact - Email: cwic-help@wgiss.ceos.org - Web: http://wgiss.ceos.org/cwic</name>
      <email>cwic-help@wgiss.ceos.org</email>
   </author>
   <id>https://cwic.wgiss.ceos.org/opensearch/granules.atom/?datasetId=C1597928934-NOAA_NCEI</id>
   <dc:identifier>https://cwic.wgiss.ceos.org/opensearch/granules.atom/?datasetId=C1597928934-NOAA_NCEI</dc:identifier>
   <opensearch:totalResults>2656</opensearch:totalResults>
   <opensearch:startIndex>1</opensearch:startIndex>
   <opensearch:itemsPerPage>20</opensearch:itemsPerPage>
   <link rel="self" type="application/atom+xml" href="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;count=20&amp;clientId=eed-edsc-dev&amp;startPage=1" title="This Request" />
   <link rel="search" type="application/opensearchdescription+xml" href="https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev" title="Search this resource" />
   <link rel="first" type="application/atom+xml" href="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;count=20&amp;startIndex=1&amp;timeEnd=2020-07-11T16:17:52Z&amp;clientId=eed-edsc-dev" title="First result" />
   <link rel="last" type="application/atom+xml" href="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;count=20&amp;startIndex=2656&amp;timeEnd=2020-07-11T16:17:52Z&amp;clientId=eed-edsc-dev" title="Last result" />
   <link rel="next" type="application/atom+xml" href="https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;count=20&amp;startIndex=21&amp;timeEnd=2020-07-11T16:17:52Z&amp;clientId=eed-edsc-dev" title="Next results" />
   <opensearch:Query role="request" cwic:datasetId="C1597928934-NOAA_NCEI" esipdiscover:clientId="eed-edsc-dev" startIndex="1" count="20" time:end="2020-07-11T16:17:52Z" />
   <!-- Remote search completed in 10.702 seconds. -->
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-32.597469329833984 14.689370155334473 5.937497138977051 51.89847946166992</georss:box>
      <georss:polygon>-32.597469329833984 14.689370155334473 5.937497138977051 14.689370155334473 5.937497138977051 51.89847946166992 -32.597469329833984 51.89847946166992 -32.597469329833984 14.689370155334473</georss:polygon>
      <dc:date>2018-12-01/2018-12-01</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-76.67537689208984 -139.42160034179688 -36.574100494384766 -56.79916000366211</georss:box>
      <georss:polygon>-76.67537689208984 -139.42160034179688 -36.574100494384766 -139.42160034179688 -36.574100494384766 -56.79916000366211 -76.67537689208984 -56.79916000366211 -76.67537689208984 -139.42160034179688</georss:polygon>
      <dc:date>2018-11-10/2018-11-10</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110211000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>56.991580963134766 -180.0 90.0 180.0</georss:box>
      <georss:polygon>56.991580963134766 -180.0 90.0 -180.0 90.0 180.0 56.991580963134766 180.0 56.991580963134766 -180.0</georss:polygon>
      <dc:date>2018-11-10/2018-11-10</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/314/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/314/20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181110215000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>44.086631774902344 -91.46759033203125 85.08487701416016 144.47000122070312</georss:box>
      <georss:polygon>44.086631774902344 -91.46759033203125 85.08487701416016 -91.46759033203125 85.08487701416016 144.47000122070312 44.086631774902344 144.47000122070312 44.086631774902344 -91.46759033203125</georss:polygon>
      <dc:date>2018-12-04/2018-12-04</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204124000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>7.947690010070801 21.490310668945312 46.63800048828125 62.65871047973633</georss:box>
      <georss:polygon>7.947690010070801 21.490310668945312 46.63800048828125 21.490310668945312 46.63800048828125 62.65871047973633 7.947690010070801 62.65871047973633 7.947690010070801 21.490310668945312</georss:polygon>
      <dc:date>2018-12-04/2018-12-04</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204230000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-13.889459609985352 -131.7559051513672 24.532289505004883 -95.72888946533203</georss:box>
      <georss:polygon>-13.889459609985352 -131.7559051513672 24.532289505004883 -131.7559051513672 24.532289505004883 -95.72888946533203 -13.889459609985352 -95.72888946533203 -13.889459609985352 -131.7559051513672</georss:polygon>
      <dc:date>2018-11-28/2018-11-28</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128205000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-7.789478778839111 11.713350296020508 30.851730346679688 48.41225051879883</georss:box>
      <georss:polygon>-7.789478778839111 11.713350296020508 30.851730346679688 11.713350296020508 30.851730346679688 48.41225051879883 -7.789478778839111 48.41225051879883 -7.789478778839111 11.713350296020508</georss:polygon>
      <dc:date>2018-11-22/2018-11-22</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/326/20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/326/20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/326/20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/326/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/326/20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181122233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-4.7849931716918945 -65.2822494506836 33.87234115600586 -28.06878089904785</georss:box>
      <georss:polygon>-4.7849931716918945 -65.2822494506836 33.87234115600586 -65.2822494506836 33.87234115600586 -28.06878089904785 -4.7849931716918945 -28.06878089904785 -4.7849931716918945 -65.2822494506836</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112044000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-27.93998908996582 -26.145559310913086 10.580120086669922 10.335149765014648</georss:box>
      <georss:polygon>-27.93998908996582 -26.145559310913086 10.580120086669922 -26.145559310913086 10.580120086669922 10.335149765014648 -27.93998908996582 10.335149765014648 -27.93998908996582 -26.145559310913086</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112140000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>31.560190200805664 61.43933868408203 71.23969268798828 128.10719299316406</georss:box>
      <georss:polygon>31.560190200805664 61.43933868408203 71.23969268798828 61.43933868408203 71.23969268798828 128.10719299316406 31.560190200805664 128.10719299316406 31.560190200805664 61.43933868408203</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112055000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>52.326271057128906 -180.0 90.0 180.0</georss:box>
      <georss:polygon>52.326271057128906 -180.0 90.0 -180.0 90.0 180.0 52.326271057128906 180.0 52.326271057128906 -180.0</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112125000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-90.0 -180.0 -54.26192855834961 180.0</georss:box>
      <georss:polygon>-90.0 -180.0 -54.26192855834961 -180.0 -54.26192855834961 180.0 -90.0 180.0 -90.0 -180.0</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112134000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-90.0 -180.0 -50.855751037597656 180.0</georss:box>
      <georss:polygon>-90.0 -180.0 -50.855751037597656 -180.0 -50.855751037597656 180.0 -90.0 180.0 -90.0 -180.0</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112101000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-26.339210510253906 -172.6488037109375 12.179349899291992 151.06019592285156</georss:box>
      <georss:polygon>-26.339210510253906 -172.6488037109375 12.179349899291992 -172.6488037109375 12.179349899291992 151.06019592285156 -26.339210510253906 151.06019592285156 -26.339210510253906 -172.6488037109375</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112021000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-42.790008544921875 128.6656951904297 -4.090662002563477 168.6446075439453</georss:box>
      <georss:polygon>-42.790008544921875 128.6656951904297 -4.090662002563477 128.6656951904297 -4.090662002563477 168.6446075439453 -42.790008544921875 168.6446075439453 -42.790008544921875 128.6656951904297</georss:polygon>
      <dc:date>2018-11-12/2018-11-12</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/316/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/316/20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181112150000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-66.29741668701172 10.19124984741211 -26.843229293823242 68.44029998779297</georss:box>
      <georss:polygon>-66.29741668701172 10.19124984741211 -26.843229293823242 10.19124984741211 -26.843229293823242 68.44029998779297 -66.29741668701172 68.44029998779297 -66.29741668701172 10.19124984741211</georss:polygon>
      <dc:date>2018-12-04/2018-12-04</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204214000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-38.45954895019531 -124.32360076904297 0.19943110644817352 -85.75834655761719</georss:box>
      <georss:polygon>-38.45954895019531 -124.32360076904297 0.19943110644817352 -124.32360076904297 0.19943110644817352 -85.75834655761719 -38.45954895019531 -85.75834655761719 -38.45954895019531 -124.32360076904297</georss:polygon>
      <dc:date>2018-12-04/2018-12-04</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/338/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/338/20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181204080000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-17.11174964904785 12.34531021118164 21.500539779663086 48.24814987182617</georss:box>
      <georss:polygon>-17.11174964904785 12.34531021118164 21.500539779663086 12.34531021118164 21.500539779663086 48.24814987182617 -17.11174964904785 48.24814987182617 -17.11174964904785 12.34531021118164</georss:polygon>
      <dc:date>2018-11-28/2018-11-28</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128232000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>56.041908264160156 -180.0 90.0 180.0</georss:box>
      <georss:polygon>56.041908264160156 -180.0 90.0 -180.0 90.0 180.0 56.041908264160156 180.0 56.041908264160156 -180.0</georss:polygon>
      <dc:date>2018-11-28/2018-11-28</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128193000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <entry>
      <title>C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</title>
      <id>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</id>
      <dc:identifier>http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</dc:identifier>
      <updated>2018-12-07</updated>
      <author>
         <name>DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:</name>
         <email>NODC.DataOfficer@noaa.gov</email>
      </author>
      <georss:box>-51.655250549316406 -3.9195950031280518 -12.785490036010742 40.26871109008789</georss:box>
      <georss:polygon>-51.655250549316406 -3.9195950031280518 -12.785490036010742 -3.9195950031280518 -12.785490036010742 40.26871109008789 -51.655250549316406 40.26871109008789 -51.655250549316406 -3.9195950031280518</georss:polygon>
      <dc:date>2018-11-28/2018-11-28</dc:date>
      <link title="HTTPS" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="FTP" rel="enclosure" type="application/octet-stream" href="ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <link title="THREDDS OPeNDAP" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html" />
      <link title="THREDDS(TDS)" rel="enclosure" type="application/octet-stream" href="https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/332/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/332/20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc" />
      <summary type="text">Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181128233000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc</summary>
   </entry>
   <!-- Atom response generation completed in 1ms. -->
</feed>
<!-- OpenSearch response completed in 10752ms. -->`
