class ProjectsController < ApplicationController
  def index
    if current_user
      user_id = current_user.id
      @projects = Project.where(user_id: user_id)
    else
      redirect_to root_url
    end
  end

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
    project.name = params[:workspace_name] if params[:workspace_name]
    project.user_id = current_user.id if current_user
    project.save!
    render :text => project.to_param
  end

  def remove
    project = Project.find(params[:project_id])
    project.destroy
    user_id = current_user.id
    @projects = Project.where(user_id: user_id)

    respond_to do |format|
      format.js
    end
  end
end
