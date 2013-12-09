require 'faraday_middleware/response_middleware'

module Echo
  module ClientMiddleware
    class AtomDatasetMiddleware < FaradayMiddleware::ResponseMiddleware
      def process_response(env)
        body = env[:body]

        env[:body] = Array.wrap(env[:body]['feed']['entry']).map do |dataset_json|
          dataset = Dataset.new
          dataset.id = dataset_json['id']
          dataset.dataset_id = dataset_json['dataset_id']
          dataset.summary = dataset_json['summary']
          dataset.updated = dataset_json['updated']
          dataset.short_name = dataset_json['short_name']
          dataset.version_id = dataset_json['version_id']
          dataset.data_center = dataset_json['data_center']
          dataset.archive_center = dataset_json['archive_center']
          dataset.processing_level_id = dataset_json['processing_level_id']
          dataset.time_start = dataset_json['time_start']
          dataset.time_end = dataset_json['time_end']
          dataset.links = dataset_json['links']
          dataset.boxes = dataset_json['boxes']
          dataset.points = dataset_json['points']
          dataset.dif_ids = dataset_json['dif_ids']
          dataset.online_access_flag = dataset_json['online_access_flag']
          dataset.browse_flag = dataset_json['browse_flag']
          dataset
        end

        env[:summary] = "#{env[:body].size} atom/json datasets"
      end

      def parse_response?(env)
        body = env[:body]
        body.is_a?(Hash) && body['feed'] && body['feed']['title'] == 'ECHO dataset metadata'
      end
    end
  end
end
