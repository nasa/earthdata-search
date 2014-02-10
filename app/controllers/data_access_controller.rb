require 'json'

class DataAccessController < ApplicationController
  def create
    # Parse, then stringify in view to protect against malicious requests
    @project = JSON.parse(params[:project])
  end
end
