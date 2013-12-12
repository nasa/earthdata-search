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
          dataset.boxes = parse_shapes(dataset_json['boxes'])
          dataset.points = parse_shapes(dataset_json['points'])
          dataset.polygons = parse_shapes(dataset_json['polygons'])
          dataset.lines = parse_shapes(dataset_json['lines'])
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

      private

      def parse_shapes(shape_array)
        return nil unless shape_array.present?

        shape_array.flatten.map do |shape|
          # Each shape is a string of space-separated numbers alternating between
          # lat and lon, e.g. "90.0 180.0 -90.0 -180.0.  This splits the string into
          # component numbers, coerces to float, and puts each pair into an array
          # e.g. [90.0, 180.0, -90.0, -180.0]
          shape.split(' ').map(&:to_f).each_slice(2).to_a
        end
      end
    end
  end
end
