class ConversionsController < ApplicationController
  respond_to :json


  def convert
    response = OgreClient.convert_shapefile(params[:file])
    Rails.logger.info request.format

    # render(json: current_user.to_fileupload(name, style), content_type: request.format)
    render text: response.body, content_type: request.format
  end
end
