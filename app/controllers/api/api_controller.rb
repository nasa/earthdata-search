module Api
  class ApiController < ApplicationController
    before_action :refresh_urs_if_needed

    def require_login
      render json: { message: 'Your are not authorized to perform this action' }, status: :forbidden unless logged_in?
    end
  end
end
