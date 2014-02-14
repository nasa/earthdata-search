require 'json'

class DataAccessController < ApplicationController
  def configure
    @project = JSON.parse(params[:project])
  end

  def retrieve
    @project = JSON.parse(params[:project])
  end
end
