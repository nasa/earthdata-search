class PlacenamesController < ApplicationController
  respond_to :json

  def index
    result = []

    query = params[:q]
    current = params[:placename]

    if query.nil? || query.size < 3
      result = []
    else
      if match = /place:(["'])(?:(?=(\\?))\2.)*?\1/.match(query)
        placename = match.to_s
        keywords = query.gsub(placename, '')
        keywords, preposition = keywords.split(/( (?:in|over|around|near|above|at|inside) ?)/, 2)
      else
        keywords, preposition, placename = query.split(/( (?:in|over|around|near|above|at|inside) )/, 2)
      end
      prefix = ""

      prefix = "#{keywords} " unless placename.nil?
      if placename.nil?
        placename = query
      end

      if placename == current ||
          placename[/^C\d/] ||
          placename.include?('_') ||
          placename.downcase.start_with?('landsat') ||
          placename.downcase.start_with?('modis')
        # Completion has already been performed and placename hasn't changed or
        # the search is for an explicit collection id (avoids many requests in CI)
        # or the search is for landsat or modis which have a few insignificant results
        # that the user is unlikely to be interested in
        result = []
      else
        placename.gsub!("place:", "")
        result = PlacesClient.get_place_completions(placename).map do |completion|
          name = [completion['toponymName'], completion['adminName1'], completion['countryName']].map(&:presence).uniq.compact.join(', ')
          bbox = completion['bbox']
          if bbox
            spatial = "bounding_box:#{bbox['west']},#{bbox['south']}:#{bbox['east']},#{bbox['north']}"
          else
            spatial = "point:#{completion['lng']},#{completion['lat']}"
          end
          {
            placename: "place:\"#{name}\"",
            value: prefix + "place:\"#{name}\"",
            spatial: spatial
          }
        end
      end
    end

    respond_with(result)
  end
end
