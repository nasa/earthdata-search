module Api
  module V1
    class RetrievalCollectionsController < ApiController
      before_action :set_retrieval

      def index
        @collections = @retrieval.retrieval_collections
      end

      def show
        @collection = @retrieval.retrieval_collections.find(params[:id])
      end

      private

      def set_retrieval
        @retrieval = Retrieval.find(params[:retrieval_id])
      end
    end
  end
end
