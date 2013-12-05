require 'faraday_middleware/response_middleware'

module Echo
  module ClientMiddleware
    class Echo10DatasetMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = env[:body]

        env[:body] = Array.wrap(env[:body]['Collection']).map do |dataset_xml|
          dataset = Dataset.new
          dataset.dataset_id = dataset_xml['DataSetId']
          dataset.description = dataset_xml['Description']
          dataset.short_name = dataset_xml['ShortName']
          dataset.version_id = dataset_xml['VersionId']
          dataset.archive_center = dataset_xml['ArchiveCenter']
          dataset.processing_center = dataset_xml['ProcessingCenter']
          dataset.processing_level_id = dataset_xml['ProcessingLevelId']
          dataset.orderable = dataset_xml['Orderable']
          dataset.visible = dataset_xml['Visible']
          dataset.temporal = dataset_xml['Temporal']
          dataset.contacts = dataset_xml['Contacts']['Contact']
          dataset.science_keywords = dataset_xml['ScienceKeywords']['ScienceKeyword']
          dataset.online_access_urls = []
          dataset.online_access_urls = dataset_xml['OnlineAccessURLs']['OnlineAccessURL'] if dataset_xml['OnlineAccessURLs']
          dataset.online_resources = []
          dataset.online_resources = dataset_xml['OnlineResources']['OnlineResource'] if dataset_xml['OnlineResources']
          dataset.associated_difs = []
          dataset.associated_difs = dataset_xml['AssociatedDIFs']['DIF']['EntryId'] if dataset_xml['AssociatedDIFs'] && dataset_xml['AssociatedDIFs']['DIF']
          dataset.spatial = dataset_xml['Spatial']
          dataset.points = dataset_xml['Spatial']['HorizontalSpatialDomain']['Geometry']['Point']
          dataset.boxes = dataset_xml['Spatial']['HorizontalSpatialDomain']['Geometry']['BoundingRectangle']
          dataset.lines = dataset_xml['Spatial']['HorizontalSpatialDomain']['Geometry']['Line']
          dataset.polygons = dataset_xml['Spatial']['HorizontalSpatialDomain']['Geometry']['GPolygon']
          dataset.browse_images = []
          dataset.browse_images = dataset_xml['AssociatedBrowseImageUrls']['ProviderBrowseUrl'] if dataset_xml['AssociatedBrowseImageUrls']
          dataset
        end

        env[:summary] = "#{env[:body].size} echo10/xml datasets"
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['Collection'] 
      end
    end
  end
end
