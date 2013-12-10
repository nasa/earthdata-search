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
          dataset.contacts = Array.wrap(dataset_xml['Contacts']['Contact'])
          dataset.science_keywords = Array.wrap(dataset_xml['ScienceKeywords']['ScienceKeyword'])
          if dataset_xml['OnlineAccessURLs']
            dataset.online_access_urls = Array.wrap(dataset_xml['OnlineAccessURLs']['OnlineAccessURL']).map{ |url| url }
          else
            dataset.online_access_urls = []
          end
          if dataset_xml['OnlineResources']
            dataset.online_resources = Array.wrap(dataset_xml['OnlineResources']['OnlineResource']).map{ |url| url }
          else
            dataset.online_resources = []
          end
          dataset.associated_difs = []
          dataset.associated_difs = dataset_xml['AssociatedDIFs']['DIF']['EntryId'] if dataset_xml['AssociatedDIFs'] && dataset_xml['AssociatedDIFs']['DIF']
          dataset.spatial = dataset_xml['Spatial']
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
