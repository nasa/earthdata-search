json.array! @orders do |order|
  json.id order.id
  json.type order.type
  json.status order.state
  json.order_number order.order_number
  json.order_information order.order_information
end
