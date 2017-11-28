class VariablesController < ApplicationController
  around_action :log_execution_time

  respond_to :json

  def index
    # byebug

    cmr_params = {
      format: 'umm_json'
    }

    cmr_params[:concept_id] = params[:concept_id] if params[:concept_id].reject { |c| c.empty? }.any?

    response = echo_client.get_variables(cmr_params, token)

    respond_with(response.body, status: response.status)
  end
end
