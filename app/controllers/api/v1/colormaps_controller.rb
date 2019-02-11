module Api
  module V1
    class ColormapsController < ApiController
      def show
        @colormap = Colormap.find_by(product: params[:id])
      end
    end
  end
end
