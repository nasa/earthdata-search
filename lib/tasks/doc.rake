namespace :doc do
  desc "Generate the UI documentation and tests"
  task :ui => ['environment', 'assets:precompile:all'] do
    require Rails.root.join('doc', 'ui', 'support', 'offline_template')
    f = File.new(Rails.root.join('doc', 'ui', 'index.html'), 'w')
    template = Rails.root.join('doc', 'ui', 'templates', "index.html.erb")
    f.puts(OfflineTemplate.new.render_to_string(:layout => 'layouts/application', :file => template))
    f.close
  end
end
