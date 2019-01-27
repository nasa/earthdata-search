module Api
  module V1
    class OrdersController < ApiController
      def index
        @orders = RetrievalCollection.find(params[:retrieval_collection_id]).orders
      end
    end
  end
end
