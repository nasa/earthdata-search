class ProjectsController < ApplicationController
  include CollectionParams

  respond_to :json, only: [:project_summary]

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

  rescue ActiveRecord::RecordNotFound => e
    respond_to do |format|
      format.html { render file: "#{Rails.root}/public/404.html", status: :not_found }
      format.json { render json: '{}' }
    end
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

  def project_summary
    sanitize_params! params
    collection_ids = params[:entries].map {|e| e[:collection]}
    collection_params = collection_params_for_request(request)
    collection_params[:echo_collection_id] = collection_ids
    collection_params.merge!(params[:query])
    catalog_response = echo_client.get_collections(collection_params, token)

    if catalog_response.success?
      results = {size: nil, unit: 'MB', granule_count: 0, collection_count: 0, collections:[]}
      size = 0.0
      granule_count = 0
      collection_count = 0
      entries = catalog_response.body['feed']['entry']
      entries.each do |entry|
        _size = 0.0
        _granule_count = 0
        granule_response = echo_client.get_granules({echo_collection_id: entry['id'], page_size: 20}.merge(params[:entries].select{|e| e[:collection] == entry['id']}.first[:query]), token)
        if granule_response.success?
          granules = granule_response.body['feed']['entry']
          if granules.size > 0
            sizeMB = granules.reduce(0) {|size, granule| size + granule['granule_size'].to_f}
            _size += (sizeMB / granules.size) * (granule_response.headers['cmr-hits'].to_i)
            size += _size
            _granule_count += granule_response.headers['cmr-hits'].to_i
            granule_count += _granule_count
            collection_count += 1
            entry['size'] = size_and_unit(_size)[:size]
            entry['unit'] = size_and_unit(_size)[:unit]
            entry['project_granule_count'] = _granule_count
            results[:collections].push entry
          end
        else
          respond_with(granule_response.body, status: granule_response.status, location: nil)
        end
      end

      results[:size] = size_and_unit(size)[:size]
      results[:unit] = size_and_unit(size)[:unit]
      results[:granule_count] = granule_count
      results[:collection_count] = collection_count

      respond_with results, status: :ok, location: nil
    else
      respond_with(catalog_response.body, status: catalog_response.status, location: nil)
    end
  end

  private

  def size_and_unit(size)
    units = ['MB', 'GB', 'TB', 'PB', 'EB']
    while size > 1024 && units.size > 1
      size = size.to_f / 1024
      units.shift()
    end
    {size: size, unit: units.first}
  end

  def sanitize_params!(params)
    params[:query].except!(:p, :pg, :tl, :features) if params[:query].present?
    params[:entries].each {|entry| entry[:query].except!(:v)}
  end
end
