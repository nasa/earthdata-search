class GranulesController < CatalogController
  respond_to :json

  def index
    response = Echo::Client.get_granules(to_echo_params(params))

    if response.success?
      respond_with(results: response.body, hits: response.headers['echo-hits'].to_i, status: response.status)
    else
      respond_with(response.body, status: response.status)
    end
  end
end
