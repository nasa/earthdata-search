require 'json'

class DataAccessController < ApplicationController
  def configure
    @project = JSON.parse(params[:project])
  end

  def retrieve
    @project = JSON.parse(params[:project])
  end

  def data_download
    @ip = request.remote_ip
    @user_id = get_user_id
    # TODO: This could be dangerous
    @query = request.env['QUERY_STRING']
  end
end
