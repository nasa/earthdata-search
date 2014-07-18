class ProjectsController < ApplicationController
  def show
    project = Project.find(params[:id])
    render :json => project.to_json

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
    project.path = params[:path]
    project.name = params[:project_name]
    project.user_id = current_user.id if current_user
    project.save!
    render :text => project.to_param
  end
end
