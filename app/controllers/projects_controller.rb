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
    if params[:id].nil?
      @project = Project.find(params[:projectId].to_i)
    else
      @project = Project.find(params[:id])
    end

    if current_user.present? && current_user.id == @project.user_id
      respond_to do |format|
        format.html { @project }
        format.json { render json: @project, status: :ok }
      end
    else
      # if path is too long, create new project
      if @project.path.size > Rails.configuration.url_limit
        new_project = Project.new
        new_project.path = @project.path
        new_project.user_id = current_user.id if current_user
        new_project.save!
        @project = new_project.dup
        respond_to do |format|
          format.html { @project }
          format.json { render json: @project, status: :ok }
        end
      else
        @project.name = nil
        # project does not belong to the current user, reload the page in JS
        @project.user_id = -1
        respond_to do |format|
          format.html { render 'projects/show' }
          format.json { render json: @project, status: :ok }
        end
      end
    end

  # rescue ActiveRecord::RecordNotFound => e
  #   respond_to do |format|
  #     format.html { render file: "#{Rails.root}/public/404.html", status: :not_found }
  #     format.json { render json: '{}' }
  #   end
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

  def new
    query_string = request.query_string
    @project = Project.new
    @project.path = "/search?#{query_string}"
    @project.name = params[:workspace_name] if params[:workspace_name]
    @project.user_id = current_user.id if current_user
    @project.save!
    render 'show'
  end
end
