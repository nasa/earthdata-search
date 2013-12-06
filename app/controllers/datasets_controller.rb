class DatasetsController < ApplicationController
  respond_to :json

  def index
    response = Echo::Client.get_datasets(params)
    respond_with(results: response.body, hits: response.headers['echo-hits'].to_i)
  end

  def show
    response = Echo::Client.get_dataset(params[:id])
    respond_with(results: DatasetDetailsPresenter.new(response.body.first))
  end

end
