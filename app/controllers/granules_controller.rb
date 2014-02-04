class GranulesController < ApplicationController
  respond_to :json

  def index
    catalog_response = Echo::Client.get_granules(request.query_parameters)

    if catalog_response.success?
      catalog_response.headers.each do |key, value|
        response.headers[key] = value if key.start_with?('echo-')
      end

      respond_with(catalog_response.body, status: catalog_response.status)
    else
      respond_with(catalog_response.body, status: catalog_response.status)
    end
  end
end
