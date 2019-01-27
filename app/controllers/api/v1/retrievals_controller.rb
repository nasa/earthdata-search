module Api
  module V1
    class RetrievalsController < ApiController
      def show
        @retrieval = Retrieval.find(params[:id])
      end
    end
  end
end
