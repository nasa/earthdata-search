class ProjectsController < ApplicationController
  def show
    project = Project.find(params[:id])
    render :text => project.path

  rescue ActiveRecord::RecordNotFound => e
    render :text => '/'
  end

  def create
    id = params[:id].presence
    begin
      project = Project.find(params[:id]) if id
    rescue ActiveRecord::RecordNotFound => e
    end
    project = Project.new unless project
    project.path = request.body.read
    project.save!
    render :text => project.to_param
  end
end
