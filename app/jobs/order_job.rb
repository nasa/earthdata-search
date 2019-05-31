class OrderJob < ActiveJob::Base
  after_perform do |job|
    # Ensure that the job has all 3 parameters, older jobs won't have 3 parameter
    if job.arguments.length == 3 && job.arguments.last
      order_id = job.arguments.first

      # Order status jobs operate on retreivals so that we can utilize the multi order endpoint to get
      # the status of more than one order at a time
      Order.find(order_id).retrieval_collection.retrieval

      # Using find_by because we obfuscate the id of Retrieval and the default
      # `find` method will look for an obfuscated id instead of the raw integer
      retrieval = Order.find(order_id).retrieval_collection.retrieval

      # After all the orders are submitted, kick off the order status jobs to retrieve updates from their respective services
      OrderStatusJob.perform_later(retrieval.id, retrieval.token, retrieval.environment)
    end
  end
end
