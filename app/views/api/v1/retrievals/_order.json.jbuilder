json.order_id collection.orders.map(&:order_number)
json.order_status collection.order_status

json.orders collection.orders do |order|
  json.order_status order.order_status
  json.order_id order.order_number
end
