namespace :deploy do
  task pre: ['db:migrate', 'db:seed', 'background_jobs:migrate']
end
