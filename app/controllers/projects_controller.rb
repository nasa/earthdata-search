class ProjectsController < ApplicationController
  def index
    if current_user.present?
      # TODO PQ EDSC-1038: Include portal information here
      user_id = current_user.id
      @projects = Project.where("user_id = ? AND name != ?", user_id, '')
    else
      redirect_to edsc_path(root_url)
    end
  end

  def show
    project = Project.find(params[:id])
    if current_user.present? && current_user.id == project.user_id
      render :json => project.to_json
    else
      # if path is too long, create new project
      if project.path.size > Rails.configuration.url_limit
        new_project = Project.new
        new_project.path = project.path
        new_project.user_id = current_user.id if current_user
        new_project.save!
        render json: {path: new_project.path, new_id: new_project.to_param}
      else
        project.name = nil
        # project does not belong to the current user, reload the page in JS
        project.user_id = -1
        render json: project.to_json
      end
    end

  rescue ActiveRecord::RecordNotFound => e
    render :text => '/'
  end

  def create
    # TODO PQ EDSC-1038: Save portal information here
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
    render json: project.destroy, status: :ok
  end
end
