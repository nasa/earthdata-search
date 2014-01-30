class CatalogController < ApplicationController
  respond_to :json

  protected

  # Does application-specific transformations on params to make them
  # suitable for the ECHO client.  Including these in the ECHO client
  # would be inappropriate and make it difficult to distribute the
  # client as a gem
  def to_echo_params(params)
    result = params.dup

    # Remove bits of the keywords param that aren't ECHO keywords, such as placename
    keywords = params[:keywords].presence
    placename = params[:placename].presence
    keywords = keywords.gsub(placename, '') if keywords && placename
    if keywords.present?
      result[:keywords] = keywords
    else
      result.delete(:keywords)
    end

    result
  end
end
