json.array! @orders do |order|
  json.id order.id
  json.type order.type
  json.status order.aasm_state
  json.order_number order.order_number
end
