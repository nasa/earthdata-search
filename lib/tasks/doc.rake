namespace :doc do
  desc "Generate the UI documentation and tests"
  task :ui => ['environment', 'assets:clobber', 'assets:precompile'] do
    require 'fileutils'
    require Rails.root.join('doc', 'ui', 'support', 'offline_template')

    Dir.glob(Rails.root.join('doc', 'ui', 'templates', '**', '*.html.erb')) do |template|
      output_path = template.gsub('/templates/', '/').gsub(/\.erb$/, '')
      FileUtils.mkdir_p(File.dirname(output_path))
      File.delete(output_path) if File.exist?(output_path) # clean up previous versions
      f = File.new(output_path, 'w')
      f.puts(OfflineTemplate.new.render_to_string(:layout => 'layouts/application', :file => template))
      f.flush
      f.close
    end

    doc_assets = Rails.root.join('doc', 'ui', 'assets')
    app_assets = Rails.root.join('public', 'assets')
    FileUtils.rm_r(doc_assets)
    FileUtils.mkdir_p(doc_assets)
    FileUtils.cp_r(app_assets, Rails.root.join('doc', 'ui'))
  end
end

Rake::Task[:doc].enhance(['doc:ui'])
