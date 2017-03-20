class VariablesController < ApplicationController
  respond_to :json

  def index
    respond_with echo_client.variables(params['measurement']), status: 200
  end
end
