class PlacenamesController < ApplicationController
  respond_to :json

  def index
    result = []

    query = params[:q]
    current = params[:placename]

    if query.nil? || query.size < 3
      result = []
    else
      keywords, preposition, placename = query.split(/( (?:in|over|around|near|above|at|inside) )/, 2)

      prefix = ""

      prefix = keywords + preposition unless placename.nil?
      if placename.nil?
        placename = query
        preposition = ""
      end

      if placename == current || placename[/^C\d/] || placename.include?('_')
        # Completion has already been performed and placename hasn't changed or
        # the search is for an explicit collection id (avoids many requests in CI)
        result = []
      else
        result = PlacesClient.get_place_completions(placename).map do |completion|
          {
            placename: preposition + completion['description'],
            value: prefix + completion['description'],
            ref: completion['reference'],
            terms: completion['terms'].map {|t| t['value']}
          }
        end
      end
    end

    respond_with(result)
  end

  def show
    result = {}

    spatial = PlacesClient.get_spatial_for_place(params[:id])
    result[:spatial] = spatial if spatial.present?

    respond_with(result)
  end
end
