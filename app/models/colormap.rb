class Colormap < ActiveRecord::Base
  store :jsondata, coder: JSON

  def to_param
    product
  end
end
