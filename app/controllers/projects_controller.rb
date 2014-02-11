class ProjectsController < ApplicationController
  def create
    @project = JSON.parse(params[:jsondata])
  end

  def update
    # Parse, then stringify in view to protect against malicious requests
    @project = JSON.parse(params[:project])
  end
end
