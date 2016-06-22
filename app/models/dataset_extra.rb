class DatasetExtra < ActiveRecord::Base
  # DatasetExtra is deprecated.
  #
  # Everything related to 'dataset' extra now goes to 'CollectionExtra'. This file should be kept empty and its only
  # purpose is to be used during db:migrate (20140618143644_add_constraints_to_dataset_extra.rb refers to this model)

end