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
    # TODO: These could be dangerous
    @user_id = cookies['name']
    @query = request.env['QUERY_STRING']
  end
end
