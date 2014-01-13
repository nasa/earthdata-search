module Echo
  module QueryTransformations
    extend ActiveSupport::Concern

    module ClassMethods
      def options_to_query(options={})
        options = options.with_indifferent_access

        query = {}

        load_query_page(options, query)
        load_query_page_size(options, query)
        load_echo_collection_query(options, query)
        load_keyword_query(options, query)
        load_spatial_query(options, query)
        load_temporal_query(options, query)
        load_browse_only_query(options, query)

        query
      end

      private

      def load_query_page(options, query)
        query[:page_num] = options[:page] if options[:page]
      end

      def load_query_page_size(options, query)
        query[:page_size] = options[:page_size] if options[:page_size]
      end

      def load_echo_collection_query(options, query)
        query[:echo_collection_id] = Array.wrap(options[:echo_collection_id]) if options[:echo_collection_id]
      end

      def load_browse_only_query(options, query)
        query[:browse_only] = options[:browse_only] if options[:browse_only]
      end

      def load_keyword_query(options, query)
        if options[:keywords]
          # Escape catalog-rest reserved characters, then add a wildcard character to the
          # end of each word to allow partial matches of any word
          query[:keyword] = catalog_wildcard(catalog_escape(options[:keywords]))
        end
      end

      def load_spatial_query(options, query)
        spatialStr = options[:spatial]
        if spatialStr.present?
          type, *pointStrs = spatialStr.split(':')
          type = type.gsub('-', '_').to_sym
          type = :polygon if type == :antarctic_rectangle || type == :arctic_rectangle

          # Polygon conditions must have their last point equal to their first
          pointStrs << pointStrs.first if type == :polygon

          points = pointStrs.map { |s| s.split(',').map(&:to_f) }

          points.map! do |lon, lat|
            lon += 360 while lon < -180
            lon -= 360 while lon > 180
            lat = [lat,  90.0].min
            lat = [lat, -90.0].max
            [lon, lat]
          end

          query[type] = points.flatten.join(',')
        end
      end

      def load_temporal_query(options, query)
        if options[:temporal]
          query[:temporal] = options[:temporal].flatten.join(',')
        end
      end

      # Given a string value, returns the string with catalog-rest wildcard characters appended
      # to each whitespace-delimited word, allowing for partial matches of each word.
      # "some string" becomes "some% string%"
      def catalog_wildcard(value)
        value.strip.gsub(/\s+/, '% ') + '%'
      end

      # Return a copy of value with all catalog-rest wildcards escaped.  If value is an Enumerable,
      # its string and enumerable elements will be escaped
      def catalog_escape(value)
        if value.is_a? String
          # Escape % and _ with a single \.  No idea why it takes 4 slashes before \1 to output a single slash
          value.gsub(/(%|_)/, '\\\\\1')
        elsif value.is_a? Hash
          Hash[value.map {|k, v| [k, catalog_escape(v)]}]
        elsif value.is_a? Enumerable
          value.map {|v| catalog_escape(v)}
        elsif !value.is_a?(TrueClass) && !value.is_a?(FalseClass) && !value.is_a?(Numeric)
          Rails.logger.warn("Unrecognized value type for #{value} (#{value.class})")
        end
      end
    end
  end
end
