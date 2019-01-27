json.order_id collection.orders.map(&:order_number)
json.order_status collection.order_status

json.service_options do
  json.total_orders collection.orders.count
  json.total_number collection.granule_count
  json.total_complete collection.orders.map { |o| o.granules_processed == o.granules_requested ? 1 : 0 }.sum
  json.total_processed collection.orders.map(&:granules_processed).sum
  json.download_urls collection.orders.map { |o| o.order_information.fetch('downloadUrls', {}).fetch('downloadUrl', []) }.flatten

  json.orders collection.orders do |order|
    json.download_urls order.order_information.fetch('downloadUrls', {}).fetch('downloadUrl', [])
    json.order_id order.order_number
    json.order_status order.order_status
    json.total_number order.granules_requested
    json.total_processed order.granules_processed

    json.contact do
      json.name order.order_information.fetch('contactInformation', {}).fetch('contactName', 'Earthdata Search Support')
      json.email order.order_information.fetch('contactInformation', {}).fetch('contactEmail', 'edsc-support@earthdata.nasa.gov')
    end
  end
end
