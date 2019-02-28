class ConversionsController < ApplicationController
  respond_to :json

  # This method is meant to be a very thin wrapper around calls to the http://ogre.adc4gis.com/
  # We should remain completely compatible with that API.  Doing things this way is slow and
  # will bog down our app.
  # I have a pull request in to fix CORS requests https://github.com/wavded/ogre/pull/22
  # in Ogre, at which point we can directly call their API in Javascript.  Alternatively, we
  # should configure the production webserver to directly proxy their service, or deploy our
  # own Ogre instance.
  def convert
    Rails.logger.info request.headers["Content-Type"]

    # Define local_path method required by Faraday
    upload = params[:upload]
    def upload.local_path
      @tempfile
    end

    response = OgreClient.convert_shapefile(params)

    # Store the shapefile in the database, unless it already exists
    json_response = JSON.parse(response.body)
    file_hash = Shapefile.generate_hash(json_response)

    shapefile = Shapefile.find_or_create_by(file_hash: file_hash) do |sf|
      sf.file = json_response
      sf.user = current_user
    end

    render json: shapefile.file_with_id, content_type: request.format
  end
end
